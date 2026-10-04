"""Offline VISTA decision-logic audit. No browser, agents, models or downloads.

Run with the existing Inspect environment's Python and --source-root pointing
to source files from the commit recorded in vista-audit-receipt.json. Only
explicitly selected AST functions/constants are executed, never module imports
or VISTA's main(), Docker, CLIP, subprocesses or network entry points.
FakePage controls exercise scorer decisions, not actual browser reliability.
"""
from __future__ import annotations

import argparse
import ast
import asyncio
import collections
import hashlib
import importlib.metadata
import json
import math
from pathlib import Path
import re
import socket
import statistics
from types import SimpleNamespace


FUNCTIONS = {
    "iou", "center_distance", "text_similarity_score", "pick_best",
    "annotation_tier", "_jaccard", "_visible_words", "check_navigate",
    "check_generic_click", "check_toggle", "check_external", "check_popout",
    "click_safely", "find_anchors_from_anchor_json", "fit_affine", "apply_affine",
}
CONSTANTS = {"CRITICAL_CLICK_SUBTYPES", "LOCALIZATION_SCORE", "_NAV_WORD_RE"}


def selected_functions(path: Path) -> dict:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    nodes = []
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name in FUNCTIONS:
            nodes.append(node)
        elif isinstance(node, ast.Assign) and any(
            isinstance(t, ast.Name) and t.id in CONSTANTS for t in node.targets
        ):
            nodes.append(node)
    module = ast.Module(body=nodes, type_ignores=[])
    namespace = {
        "math": math, "re": re, "time": SimpleNamespace(sleep=lambda _: None),
        "PWTimeout": TimeoutError, "Page": object,
        "Optional": __import__("typing").Optional,
    }
    exec(compile(module, str(path), "exec"), namespace)
    assert FUNCTIONS <= namespace.keys()
    return namespace


class FakePage:
    def __init__(self, before="alpha beta gamma", after=None, url="http://app/source",
                 doms=None, html_lengths=(100, 100), snapshots=(), counts=(0, 0)):
        self.texts = iter((before, before if after is None else after))
        self.url = url
        self.doms = doms or []
        self.lengths = iter(html_lengths)
        self.snapshots = iter(snapshots)
        self.counts = iter(counts)
        self.mouse = SimpleNamespace(click=lambda *_: None)

    def evaluate(self, script, *args):
        if "document.body.innerText" in script:
            return next(self.texts)
        if "querySelectorAll('[data-testid" in script:
            return self.doms
        if "outerHTML.length" in script:
            return next(self.lengths)
        if "querySelectorAll('[role=" in script:
            return next(self.counts)
        if "pressed: el.getAttribute" in script:
            return next(self.snapshots)
        if "window.scrollY" == script:
            return 0
        if "target.click()" in script:
            return True
        return None

    def wait_for_load_state(self, *args, **kwargs):
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    root = args.source_root.resolve()
    path = root / "tasks/tools/eval_run.py"
    expected = "70cc6e3a5a037c2c1a2ef5759751e4bec8959b6b655dd2528a6f874bc6df6c70"
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    assert digest == expected, "Scorer bytes differ from the audited commit; stop and review the revision"
    f = selected_functions(path)
    cases = []

    def record(name, observed, expected, implication):
        assert observed == expected, (name, observed, expected)
        cases.append(dict(name=name, observed=observed, expected=expected,
                          implication=implication))

    target = dict(x=0, y=0, width=100, height=100)
    wrong_label = dict(target, text="unrelated control")
    record("overlap_ignores_wrong_label", f["pick_best"](target, [wrong_label])[1], 1,
           "Geometry can identify a semantically wrong control at full L=1.")
    record("no_candidate", f["pick_best"](target, [])[1], 0, "Missing controls get L=0.")
    distant = dict(x=2000, y=2000, width=100, height=100, text="search products")
    record("distant_text_match", f["pick_best"](target, [distant], {"reasoning": "search products"})[1], 5,
           "An arbitrarily displaced matching label can earn L=0.1.")
    near = dict(x=150, y=0, width=100, height=100)
    record("distance_boundary", f["pick_best"](target, [near])[1], 3,
           "The inclusive 150px tier earns L=0.3.")
    record("generic_noop", f["check_generic_click"](FakePage(), wrong_label, {})[0], 0.5,
           "No-op functional clicks can get B=0.5, hence S=0.5 at L=1.")
    record("wrong_destination", f["check_navigate"](FakePage(after="unrelated error screen"), wrong_label,
           {"navigateTo": {"name": "Checkout"}}, "http://app")[0], 1.0,
           "A content change is sufficient without destination validation.")
    record("empty_destination", f["check_navigate"](FakePage(after=""), wrong_label,
           {"navigateTo": {"name": "Checkout"}}, "http://app")[0], 1.0,
           "Empty/destroyed body can be treated as successful navigation.")
    record("navigation_noop_control", f["check_navigate"](FakePage(), wrong_label, {}, "http://app")[0], 0.0,
           "Unchanged word sets fail the navigation test.")
    record("cosmetic_toggle", f["check_toggle"](FakePage(snapshots=({"cls": "a"}, {"cls": "b"})),
           wrong_label, {})[0], 1.0, "A cosmetic class change can satisfy toggle behavior.")
    record("internal_absolute_external", f["check_external"](None, {"href": "http://app/internal"}, {})[0], 1.0,
           "Absolute internal links pass the external-link test.")
    record("hidden_dialog_count", f["check_popout"](FakePage(counts=(0, 1)), wrong_label, {})[0], 1.0,
           "The count probe has no visibility/content/focus requirement.")
    dom = dict(distant, tag="button", testid="search")
    anchor = {"ann_id": 1, "testid": "search", "bbox_png": {"x": 0, "y": 0, "w": 100, "h": 100}}
    matched = f["find_anchors_from_anchor_json"](FakePage(doms=[dom]), [anchor], 1)
    record("distant_testid_anchor", matched[0]["score"], 1.0,
           "Curated testid match returns score=1 despite a >2,000px displacement; main short-circuits to tier 1.")
    record("critical_music_click", f["annotation_tier"]({"type": "click", "subtype": "click_play_music"}), "critical",
           "The generic music probe affects the headline denominator.")
    record("unknown_navigation_bonus", f["annotation_tier"]({"type": "click", "subtype": "click_unknown_nav"}), "bonus",
           "Bonus annotations do not affect critical S.")
    record("dead_click_skipped", f["annotation_tier"]({"type": "click", "subtype": "click_dead"}), "skip",
           "Intentionally dead controls are excluded.")

    apps = []
    all_annotations = []
    malformed = []
    for directory in sorted((root / "tasks").iterdir()):
        if not directory.is_dir() or not re.match(r"^\d", directory.name):
            continue
        manifests = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
        anchors = json.loads((directory / (directory.name + "_anchors.json")).read_text(encoding="utf-8"))["anchors"]
        documents = [json.loads(p.read_text(encoding="utf-8")) for p in
                     sorted((directory / "interaction").glob("*human_interaction_annotation.json"))]
        annotations = [a for d in documents for a in d.get("annotations", [])]
        for d in documents:
            ids = [a["id"] for a in d.get("annotations", [])]
            if len(ids) != len(set(ids)):
                malformed.append(directory.name + "/" + d["page_name"] + ": duplicate IDs")
        all_annotations.extend(annotations)
        apps.append(dict(task=directory.name, pages=len(manifests),
                         anchor_pages=len(anchors), anchors=sum(map(len, anchors.values())),
                         interaction_pages=len(documents), annotations=len(annotations),
                         tiers=dict(collections.Counter(f["annotation_tier"](a) for a in annotations)),
                         widths=sorted(set(d.get("figma_meta", {}).get("figma_w") for d in documents))))

    # Inspect scorer API used directly on local metadata; no Task, model or
    # generate/eval call. Network guard permits only loopback asyncio IPC.
    original_connect = socket.socket.connect
    def guarded_connect(sock, address):
        if isinstance(address, tuple) and address[0] not in ("127.0.0.1", "::1", "localhost"):
            raise AssertionError("External network is forbidden during the probe")
        return original_connect(sock, address)
    socket.socket.connect = guarded_connect
    from inspect_ai.scorer import scorer, Score, accuracy
    @scorer(metrics=[accuracy()])
    def joint_audit():
        async def score(state, target):
            pairs = state.metadata["pairs"]
            return Score(value=sum(a*b for a, b in pairs) / len(pairs))
        return score
    async def check_inspect():
        result = await joint_audit()(SimpleNamespace(metadata={"pairs": [(1.0, 0.0), (0.0, 1.0)]}), None)
        record("inspect_mean_of_products", result.value, 0.0,
               "mean(L*B)=0, while mean(L)*mean(B)=0.25; aggregation must preserve pairing.")
    asyncio.run(check_inspect())
    totals = {k: sum(a[k] for a in apps) for k in ("pages", "anchors", "interaction_pages", "annotations")}
    assert totals == dict(pages=128, anchors=458, interaction_pages=126, annotations=3253)
    receipt = dict(benchmark_commit="dce2756fdeca450310af91034e78bd57203a001a",
                   scorer_sha256=digest, packages={name: importlib.metadata.version(name)
                   for name in ("inspect-ai", "inspect-evals")}, model_calls=0,
                   browser_calls=0, controls=cases, dataset=dict(apps=apps, totals=totals,
                   tier_counts=dict(collections.Counter(f["annotation_tier"](a) for a in all_annotations)),
                   annotation_types=dict(collections.Counter(a.get("type") for a in all_annotations)),
                   speculative_reasoning_count=sum(bool(re.search(r"\b(likely|implied|probably)\b", a.get("reasoning", ""), re.I))
                                                   for a in all_annotations), duplicate_id_findings=malformed))
    result_root = root / "trajectories/_runs_cursor_grok4.6_high_3x"
    if result_root.is_dir():
        batches = collections.defaultdict(list)
        batch_rounded = collections.defaultdict(list)
        result_hashes = {}
        no_effect = 0
        bypass = 0
        dates = []
        for result_path in sorted(result_root.glob("*/eval_result.json")):
            data = json.loads(result_path.read_text(encoding="utf-8"))
            critical = [a for a in data["results"] if a["tier"] == "critical"]
            raw_score = sum(a["localization"] * a["behavior"] for a in critical) / len(critical)
            assert round(raw_score, 3) == data["summary"]["combined_score_critical"]
            batch = result_path.parent.name.split("_")[0]
            batches[batch].append(raw_score)
            batch_rounded[batch].append(data["summary"]["combined_score_critical"])
            bypass += bool(data["summary"].get("auth_bypass_used"))
            no_effect += sum(a["behavior"] > 0 and "no observable effect" in a.get("note", "") for a in critical)
            relative = str(result_path.relative_to(root)).replace("\\", "/")
            result_hashes[relative] = hashlib.sha256(result_path.read_bytes()).hexdigest()
            summary_path = result_path.parent / "summary.json"
            if summary_path.exists():
                summary = json.loads(summary_path.read_text(encoding="utf-8"))
                dates.extend(t["ts"] for t in summary.get("turns", []) if t.get("ts"))
        assert len(batches) == 3 and all(len(values) == 10 for values in batches.values())
        means = [statistics.mean(values) for values in batches.values()]
        receipt["published_arithmetic"] = dict(model_label="Grok 4.6", harness_label="cursor-agent 2026.08.11",
            condition="C4", batch_means=dict(zip(batches, means)), mean=statistics.mean(means),
            sample_sd=statistics.stdev(means), rounded_batch_means={k: statistics.mean(v) for k, v in batch_rounded.items()},
            valid_task_runs=30, authentication_bypass_runs=bypass, positive_no_effect_critical_annotations=no_effect,
            observed_trajectory_date_range=[min(dates), max(dates)] if dates else [], result_sha256=result_hashes,
            limitation="Arithmetic verified from published artifacts; no independent browser rescore or agent rerun.")
    receipt["source_sha256"] = {str(p.relative_to(root)).replace("\\", "/"): hashlib.sha256(p.read_bytes()).hexdigest()
        for p in sorted(root.rglob("*")) if p.is_file() and "trajectories" not in p.parts}
    args.output.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(dict(controls=len(cases), totals=totals, source_sha256=digest,
                         model_calls=0, duplicate_id_findings=len(malformed))))


if __name__ == "__main__":
    main()
