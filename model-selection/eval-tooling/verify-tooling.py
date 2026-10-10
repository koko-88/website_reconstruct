"""Offline package/registry checks; no datasets, model generation, or agent runs.

Run with the Python executable inside the respective uv tool environment.
The only evaluated sample is a synthetic local solver/scorer plumbing check.
"""
from __future__ import annotations

import argparse
import ast
import asyncio
import hashlib
import importlib
import importlib.metadata as md
import inspect
import json
import os
from pathlib import Path
import platform
import socket
import sys
import tempfile
from datetime import datetime, timezone

EXPECTED = {"inspect-ai": "0.3.276", "inspect-evals": "0.23.0", "agentcompass": "1.0.0"}


def restrict_network():
    # Windows asyncio implements its wakeup socketpair over loopback TCP.
    # Permit that local IPC; reject remote endpoints without changing OS policy.
    for method in ("connect", "connect_ex"):
        original = getattr(socket.socket, method)

        def guarded(self, address, _original=original):
            if isinstance(address, tuple) and address[0] in ("127.0.0.1", "::1", "localhost"):
                return _original(self, address)
            raise RuntimeError("External network disabled by offline tooling verification")

        setattr(socket.socket, method, guarded)


def source_record(path: Path) -> dict:
    raw = path.read_bytes()
    result = {"file": path.name, "sha256": hashlib.sha256(raw).hexdigest()}
    if path.suffix == ".py":
        tree = ast.parse(raw.decode("utf-8-sig"))
        result["definitions"] = [{"name": node.name, "line": node.lineno}
            for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))]
    return result


def inspect_checks() -> dict:
    import yaml
    import inspect_ai
    import inspect_evals
    from inspect_ai import Task, eval as run_eval, task
    from inspect_ai.dataset import MemoryDataset, Sample
    from inspect_ai.log import read_eval_log, list_eval_logs
    from inspect_ai.model import Model, ModelOutput
    from inspect_ai.scorer import match
    from inspect_ai.solver import solver
    from inspect_ai.tool import tool
    from inspect_ai.agent import react, agent_bridge, sandbox_agent_bridge
    from inspect_ai.tool import mcp_server_stdio, mcp_tools
    from inspect_ai._util.registry import registry_find, registry_info
    from inspect_ai.util import store

    root = Path(inspect_evals.__file__).parent
    metadata = []
    for path in sorted(root.glob("*/eval.yaml")):
        item = yaml.safe_load(path.read_text(encoding="utf-8"))
        compact = {key: item.get(key) for key in ("title", "group", "version")}
        compact["tasks"] = [{key: entry.get(key) for key in ("name", "dataset_samples")}
                            for entry in item.get("tasks", [])]
        metadata.append({"directory": path.parent.name, "metadata": compact,
                         "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    registry_file = root / "_registry.py"
    registry_tree = ast.parse(registry_file.read_text(encoding="utf-8"))
    imported_tasks = [alias.name for node in ast.walk(registry_tree)
        if isinstance(node, ast.ImportFrom) and (node.module or "").startswith("inspect_evals.")
        for alias in node.names]
    registry_result = {"source": source_record(registry_file), "static_imports": sorted(imported_tasks)}
    try:
        importlib.import_module("inspect_evals._registry")
        registry_result["runtime_import"] = "PASS"
        registry_result["runtime_task_names"] = sorted(registry_info(obj).name
            for obj in registry_find(lambda info: info.type == "task" and info.name.startswith("inspect_evals/")))
    except Exception as exc:
        registry_result["runtime_import"] = f"{type(exc).__name__}: {exc}"

    @tool
    def offline_echo():
        async def execute(value: str) -> str:
            """Echo a local string.

            Args:
                value: The string to echo.
            """
            return value
        return execute

    @solver
    def local_solver():
        async def solve(state, generate):
            answer = await offline_echo()("offline-pass")
            source = mcp_tools(mcp_server_stdio(command=sys.executable, args=[str(Path(__file__).resolve()), "--mcp-server"]))
            available_tools = await source.tools()
            assert len(available_tools) == 1
            mcp_answer = await available_tools[0](value=answer)
            mcp_text = mcp_answer if isinstance(mcp_answer, str) else "".join(item.text for item in mcp_answer)
            assert mcp_text == answer, mcp_answer
            store().set("mcp_echo", mcp_text)
            state.output = ModelOutput.from_content("mockllm/tooling", answer)
            return state
        return solve

    @task
    def offline_tooling_task():
        return Task(dataset=MemoryDataset([
                        Sample(id="tooling-1", input="local pass control", target="offline-pass"),
                        Sample(id="tooling-2", input="local fail control", target="different-target")]),
                    solver=local_solver(), scorer=match(), version=1,
                    metadata={"purpose": "tooling smoke only; not workload or benchmark evidence"})

    async def forbidden_generation(*args, **kwargs):
        raise AssertionError("Model.generate must not be called during this verification")

    original_generate = Model.generate
    Model.generate = forbidden_generation
    try:
        with tempfile.TemporaryDirectory(prefix="inspect-tooling-") as temporary:
            logs = run_eval(offline_tooling_task(), model="mockllm/tooling", log_dir=temporary, display="none")
            assert len(logs) == 1
            assert logs[0].status == "success", logs[0].error.message if logs[0].error else logs[0].status
            log_files = list_eval_logs(temporary)
            # list_eval_logs currently drops the Windows drive from its name.
            # Use the real local file path for the public log reader.
            local_logs = list(Path(temporary).glob("*.eval"))
            assert len(log_files) == len(local_logs) == 1
            loaded = read_eval_log(str(local_logs[0]))
            assert loaded.samples and len(loaded.samples) == 2 and loaded.samples[0].scores
            scores = {name: score.value for name, score in loaded.samples[0].scores.items()}
            assert all(value == "C" for value in scores.values()), scores
            negative_scores = {name: score.value for name, score in loaded.samples[1].scores.items()}
            assert all(value == "I" for value in negative_scores.values()), negative_scores
            smoke = {"status": loaded.status, "sample_count": len(loaded.samples), "scores": scores,
                     "negative_control_scores": negative_scores, "mcp_stdio_echo": "PASS",
                     "model_generate_calls": 0, "events": [event.event for event in loaded.samples[0].events],
                     "log_roundtrip": "PASS", "listed_log_name_has_drive": bool(Path(log_files[0].name).drive),
                     "log_persistence": "temporary directory removed after verification"}
    finally:
        Model.generate = original_generate

    from inspect_ai import list_tasks
    with tempfile.TemporaryDirectory(prefix="inspect-discovery-") as temporary:
        sample_file = Path(temporary) / "discover.py"
        sample_file.write_text("from inspect_ai import task, Task\n@task\ndef discovery_fixture():\n    return Task()\n", encoding="utf-8")
        discovered = list_tasks("discover.py", root_dir=Path(temporary))
        assert any(entry.name == "discovery_fixture" for entry in discovered)
    relevant = ["swe_bench", "swe_lancer", "scbench", "humaneval", "mbpp", "apps", "bigcodebench",
                "class_eval", "ds1000", "mind2web", "osworld", "agent_bench", "assistant_bench", "gaia",
                "tau2", "agentdojo", "bfcl", "bfcl_v4", "longbench", "infinite_bench", "niah", "browse_comp"]
    sources = {}
    for name in relevant:
        directory = root / name
        if directory.is_dir():
            sources[name] = [source_record(p) for p in sorted(directory.glob("*.py"))]
    return {"module_imports": "PASS", "custom_task_discovery": "PASS", "custom_solver_tool_scorer_log": smoke,
            "agent_api_signatures": {fn.__name__: str(inspect.signature(fn))
                for fn in (react, agent_bridge, sandbox_agent_bridge, mcp_server_stdio, mcp_tools)},
            "registered_custom_task": registry_info(offline_tooling_task).name,
            "eval_registry": registry_result, "eval_metadata": metadata, "relevant_source_inventory": sources}


def shipped_registrations(root):
    registrations = {}
    # Enumerate shipped registration declarations even when full discovery fails.
    # These declarations must never be described as a working runtime registry.
    kinds = ("BENCHMARKS", "HARNESSES", "ENVIRONMENTS", "RECIPES", "ANALYZERS")
    for kind in kinds:
        registrations[kind.lower()] = []
    for path in sorted(root.rglob("*.py")):
        tree = ast.parse(path.read_text(encoding="utf-8-sig"))
        for node in tree.body:
            if isinstance(node, ast.ClassDef):
                register_class_declarations(node, path, root, kinds, registrations)
    return registrations


def register_class_declarations(node, path, root, kinds, registrations):
    for decorator in node.decorator_list:
        if not (isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Attribute)
                and decorator.func.attr == "register" and isinstance(decorator.func.value, ast.Name)
                and decorator.func.value.id in kinds):
            continue
        name = None
        for assignment in node.body:
            if isinstance(assignment, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ("id", "kind")
                    for t in assignment.targets) and isinstance(assignment.value, ast.Constant):
                name = assignment.value.value
        registrations[decorator.func.value.id.lower()].append({"name": name or node.name,
            "class": node.name, "file": path.relative_to(root).as_posix(), "line": node.lineno,
            "evidence": "shipped source declaration", "source": source_record(path)})


def compass_checks() -> dict:
    import agentcompass
    from agentcompass.runtime import registry
    root = Path(agentcompass.__file__).parent
    result = {"module_imports": "PASS", "status": "READY", "registries": {}}
    try:
        registry.load_builtin_components()
        result["runtime_discovery"] = "PASS"
    except ModuleNotFoundError as exc:
        if exc.name != "fcntl" or sys.platform != "win32":
            raise
        result["status"] = "PARTIAL"
        result["runtime_discovery"] = "BLOCKED: ModuleNotFoundError: No module named 'fcntl'"
        result["blocker_source"] = source_record(root / "benchmarks/frontier_engineering/frontier_engineering.py")
    result["runtime_available_registries"] = {}
    for module, label in (("harnesses", "HARNESSES"), ("environments", "ENVIRONMENTS"), ("analyzers", "ANALYZERS")):
        importlib.import_module("agentcompass." + module)
        result["runtime_available_registries"][label.lower()] = getattr(registry, label).names()
    result["registries"] = shipped_registrations(root)
    codex = next(entry for entry in result["registries"]["harnesses"] if entry["name"] == "codex")
    result["codex"] = {"class": codex["class"], "registration_declaration": True,
                       "runtime_registry_verified": "codex" in registry.HARNESSES.names(), "executed": False}
    from agentcompass.runtime import AssistantContent, StepInfo, Trajectory, TrajMetric, RunResult, TaskStatus, TaskSpec
    task = TaskSpec(task_id="offline-trajectory", question="synthetic", category="tooling", ground_truth=None)
    trajectory = Trajectory(steps=[StepInfo(step_id=1,
        assistant_content=AssistantContent(content="", reasoning_content="synthetic", tool_calls=[]), metric=TrajMetric())])
    run_result = RunResult(task_id=task.task_id, status=TaskStatus.COMPLETED, trajectory=trajectory)
    analyzer = registry.ANALYZERS.create("EmptyContentAnalyzer")
    analysis = asyncio.run(analyzer.analysis(task, None, run_result, None, None))
    assert analysis.is_badcase is True and abs(analysis.score - 1.0) <= 1e-12
    assert json.loads(json.dumps(run_result.json, default=str))["trajectory"]["schema_version"] == "ACTF_v1.0"
    result["synthetic_trajectory_analysis"] = {"analyzer": "EmptyContentAnalyzer", "is_badcase": analysis.is_badcase,
                                              "score": analysis.score, "serialization": "PASS"}
    result["runtime_sources"] = []
    for name in ("runner", "checkpoint", "models", "metrics"):
        source = root / "runtime" / (name + ".py")
        if not source.exists():
            source = root / "runtime" / name / "__init__.py"
        result["runtime_sources"].append(source_record(source))
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["inspect", "agentcompass"])
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.output:
        output = args.output.resolve()
        if output.exists() or output in [Path(__file__).with_name(name).resolve()
                                        for name in ('inspect-verification.json', 'agentcompass-verification.json')]:
            parser.error('Output must be a new file outside historical receipts')
    else:
        output = Path(tempfile.mkdtemp(prefix='benchmark-verification-')) / f'{args.mode}-verification.json'
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["HF_DATASETS_OFFLINE"] = "1"
    os.environ["LITELLM_LOCAL_MODEL_COST_MAP"] = "True"
    restrict_network()
    versions = {name: md.version(name) for name in (
        ("inspect-ai", "inspect-evals", "mcp") if args.mode == "inspect" else ("agentcompass",))}
    for name, version in versions.items():
        if name in EXPECTED:
            assert version == EXPECTED[name], (name, version, EXPECTED[name])
    assert platform.python_version() == "3.12.15", platform.python_version()
    checks = inspect_checks() if args.mode == "inspect" else compass_checks()
    result = {"checked_at_utc": datetime.now(timezone.utc).isoformat(), "mode": args.mode, "versions": versions,
              "python": platform.python_version(), "platform": platform.platform(),
              "network": "external sockets blocked; loopback IPC permitted for Windows asyncio", "model_calls": 0, "agent_runs": 0,
              "status": checks.get("status", "READY"), "checks": checks}
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('x', encoding='utf-8') as stream:
        stream.write(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"mode": args.mode, "versions": versions, "status": result["status"], "output": str(output)}))


if __name__ == "__main__":
    if "--mcp-server" in sys.argv:
        restrict_network()
        from mcp.server.mcpserver import MCPServer
        server = MCPServer("offline-tooling")

        @server.tool()
        def echo(value: str) -> str:
            """Echo a local string over stdio; no model or network endpoint."""
            return value

        server.run(transport="stdio")
    else:
        main()
