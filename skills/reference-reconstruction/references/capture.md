# Reliable capture mechanics

## Save preflight and transfers

Resolve a new writable revision, reject frozen/existing destinations, and test a small ordinary file write. Separately test the browser tool's allowed file root with a disposable capture. MCP's workspace root may differ from the agent's; absolute paths alone do not fix that. After one denied save, inspect the error/root capability. Use returned binary/image blocks or a supported local file adapter; verify actual file bytes/type/dimensions/hash. A returned intended path or screenshot rendered in chat is not a saved artifact. Do not change server roots/trust settings to fix a routine save.

Prefer binary files/local writes. Never embed large base64 in shell arguments, smart-quoted command strings or chat. Use a file handle/stdin or bounded ordered chunks with count/byte/hash checks. Partial transfer gets an error record, never an evidence ID for the missing artifact. Keep original bytes; previews/compression/crops are derived files with parent hash and modification policy.

## Readiness and phases

Set a total deadline and finite scroll/image limits before capture. Poll document/fonts, required visible selectors, absent loaders, visible-image load/decode and stability of specified geometry. Offscreen lazy images are not prerequisites for top-of-page captures. Decode visible images concurrently under **one shared budget**, never an unbounded serial all-image loop. A timeout produces an unsettled artifact and the pending list; it does not silently become settled. Network-idle alone cannot establish readiness on polling/video pages.

Forward/reverse scroll sweeps have max steps and time; record truncation and inserted infinite-scroll content. Capture per-section/sticky/scroll-state checkpoints separately from full-page context. Full-page stitching can preserve the last scroll state's opacity/chapter and cannot prove sticky behavior. Reset to a named state before the screenshot. Bound dimensions/total pixels; use section captures for oversized pages.

Record phase: transient, settled, simulated, modified, or unsettled. Preserve early frames and final checkpoints separately with time origin and reset. Do not disable animations, inject CSS, fix a clock, block resources or emulate reduced motion without recording it. Screenshot stability is not motion equivalence. Ambient loops may coexist with stable layout; name the geometry checked and residual variable regions.

## Evaluation calls

Read the actual evaluate_script schema. Provide a complete inspectable function string, not a missing variable, statement fragment, browser handle or unresolved promise. The shared page-probe.js is one standalone function expression, read-only apart from bounded image decode. Pass selectors/limits as JSON data through supported arguments; do not concatenate page/user text into code. Validate syntax locally; browser execution still requires appropriate context. Return small JSON-serializable records; no DOM nodes, cycles, BigInt or huge HTML/body dumps. Set read-only stable-DOM flags only when exposed by the schema. Missing orchestration state after a terminated cell must be reconstructed explicitly; do not retry an empty function.

## Provenance

Per capture: evidence/source/contract/case/state/environment IDs; UTC timestamp and configured timezone; requested and actual URL/query/hash (sanitized or privately retained as required), browser version/OS/headless mode, CSS viewport/client/screenshot dimensions, DPR/visual scale/zoom, scrollbar, input/UA/touch, locale/direction/theme/motion, session/consent/fixture and reset/actions. Record readiness/deadline/pending signals, scroll, performance time origin, screenshot start/end, modifications, format/quality, probe/plan/runner hashes and limits. Never substitute file-save time for temporal event time.

The runner supplies bounded raw records, not automatic semantic fidelity judgment. Inspect artifacts and assemble required reports/matrices with evidence-linked claims. Verify closure with package.mjs; adding later reports needs a new manifest revision, never edits to a sealed directory.
