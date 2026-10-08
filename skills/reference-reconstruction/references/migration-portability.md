# v1 migration and portability

Keep the skill name and invocation policy. Workflow version 2.0.0 and new capture/manifest schema 2 are separate from any reference version. v1 files remain evidence, not implicitly v2-conforming packages.

Workflow 2.2.0 adds independent asset-plan/review/observation schema 1 and skill-local optional acquisition tooling; capture and manifest schema 2 remain compatible. Installed adoption is a separate operation. Existing packages are not implicitly asset-complete. Add acquisition/completeness assessments in new sealed sidecars, linking designated originals and prior evidence by hash, never writing into old runs.

For a frozen v1 package: hash all files before/after audit; never rerun its write-capable helpers. Retain original manifest, gate, uncertainties and capture precedence unchanged. A new v2 sidecar/revision may link originals by stable ID/hash and carry **new dated decisions**, never overwrite them or retroactively assert an old blocked gate passed. Do not fabricate missing conditions to relabel old files as v2 captures. Reuse adequate evidence; recapture only new material obligation/condition gaps with authority. An integrity audit is not fresh reference inspection.

Stage and validate an installed-skill replacement first; retain a byte-for-byte rollback copy outside the skill; compare intended changes; update only its directory. Preserve unrelated UI/dependency/policy metadata. Do not create duplicate user-scope skills or change another skill's responsibilities/configuration. Metadata discovery may need a reload/new chat.

Use relative resource/package paths, JSON/Markdown, plain Node modules and explicit CLI plan/output choices. No fixed websites, ports, machine paths, harness APIs or backend. Core probe/hash/static-source inspection need no Playwright. Browser MCP agents can apply the same probe/conditions/schema manually; unsupported fields stay unknown.

Codex may use agents/openai.yaml; Cursor/other agents need SKILL.md and linked resources in their supported directory. Discovery location is host-specific; never edit global settings automatically. Automated capture needs Node, compatible Playwright/browser binaries and authorized URL access. Optional Polypane/MCP/GPU/physical-device setup follows evidence gaps.

Handoff carries contract, source authority, hashes, exact reset/environment, state graph, claims and unknowns, report limits, gate revisions and acceptance seeds. Transfer files or bounded chunks with whole-file hash checks; base64 chat blobs and task-local variables are not replay infrastructure.
