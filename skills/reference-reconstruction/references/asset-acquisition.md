# Original asset acquisition and completeness

Use when the requested phase needs original implementation assets, or when auditing their availability. Reference captures and an intact package are insufficient. Asset availability is a fidelity-readiness input; the four existing gates and phase-specific rights decisions remain independent.

## Workflow

1. Map the active contract to asset obligations and the State & Route / Environment matrices. Include typography, responsive/DPR alternatives, hidden/revealed/lazy states, posters/media, sprites/masks, inline SVG, and renderer dependencies when material. Group environments only with demonstrated equivalent asset selection. A contract-authorized replacement or exclusion retains its authority and fidelity effect.
2. Reuse adequate supplied sources and raw observations. For new runtime observations, add optional `assetDiscovery` to the existing schema-2 capture plan. It uses the asset plan's `policy` shape: authorization, exact allowedOrigins, publicQueryKeys and optional limits. The capture runner writes asset-observations.json into its new sealed raw run. Default capture behavior remains unchanged.
3. Acquire a new sidecar with the asset plan below. Import supplied originals through confined file mappings or a sealed capture run. Static HTML/CSS/JS/SVG/manifest/glTF and HLS/DASH declarations contribute dependency edges. Runtime observations contribute selected sources, computed/pseudo styles, open shadows, approved frames, worker/network references and exact environment/state occurrences. Source-declared paths are not proof of executed use. An inferred string is a candidate until promoted through an explicit seed; no arbitrary string crawl.
4. Inspect acquired bytes, formats, aliases, dependency edges, omissions and version identity. Anonymous GET occurs later than the reference observation. Confirm designated version with a captured/source-authority hash, archive/build identity or explicit evidence-backed decision. A URL, ETag or successful response alone cannot authenticate it. Original bytes are never resized, transcoded or rewritten.
5. Create a review bound to the exact asset-run manifest. Assess coverage, all candidate dispositions and implementation obligations. Generate a handoff even when blocked if the requested phase is evidence-only. Derive implementation clearance through completeness-gate.md; the CLI's PASS is only a scoped asset input.

## Runtime and tooling

Asset tools use Node >=22 and the skill-local locked package.json/package-lock.json. Check for an existing usable install first. If missing and installation is authorized, run `npm ci --ignore-scripts --no-audit --no-fund` in the skill directory. These parsers/decoders are tooling, not website runtime libraries. Existing hash/probe/source-report tools and default capture do not need the asset dependencies. Missing asset dependencies fail explicitly; asset regression suites skip without them. Playwright remains optional and uses the existing capture module-resolution contract.

Sharp decodes raster originals, xmldom checks SVG/XML, Fontkit inspects font metrics/glyph coverage/axes, glTF Transform loads scenes from acquired resources without network, WebAssembly.validate checks modules without executing them, and installed FFprobe checks media stream/container metadata. Verifiers run in disposable processes with finite deadlines. Full raster decoding is stronger than media-container or font-metric parsing; the recorded verification level says exactly what ran. Decoder checks do not establish visual fidelity, actual rendered font, playback/GPU capability or reuse rights.

For required formats without a compatible built-in decoder (KTX/HDR/compressed glTF extensions, opaque buffers/shaders or codec-specific dependencies), use an existing specialist tool only for the named gap. A pinned external verification receipt records URL, exact SHA256, tool identity, verification level, evidence IDs and authority. It can resolve unverified formats; it cannot override failed format checks or unavailable bytes. Do not install an entire creative toolchain merely to inspect assets.

## CLI and immutable outputs

From the skill directory:

```text
node scripts/capture.mjs CAPTURE_PLAN.json NEW_RAW_RUN [EXISTING_PLAYWRIGHT_MODULE_DIR]
node scripts/assets.mjs acquire ASSET_PLAN.json NEW_ASSET_RUN
node scripts/assets.mjs verify ASSET_RUN
node scripts/assets.mjs assess ASSET_RUN ASSET_REVIEW.json
node scripts/assets.mjs handoff ASSET_RUN ASSET_REVIEW.json NEW_HANDOFF
node scripts/package.mjs verify HANDOFF
```

Use [asset-plan.example.json](../assets/asset-plan.example.json) and [asset-review.example.json](../assets/asset-review.example.json). Defaults in the review intentionally remain unresolved. Asset schema 1 is independent of workflow version 2.2.0 and existing capture/manifest schema 2. A raw status ACQUIRED/INCOMPLETE is not a gate. Acquisition or assessment blockage returns nonzero while retaining honest sealed outputs. Command-level invalid inputs fail before creating output.

All output leaves must be new and have an existing parent. Output cannot be inside input evidence. Inputs are read-only; supplied mappings reject traversal and symlinks. Originals live at blobs/SHA256.bin. Equal bytes share storage; different URL queries remain distinct identities. SVG fragments belong to occurrences. Embedded identity includes source base context, so identical inline bytes can retain different dependency resolution. URL-to-local mapping, MIME and dependency references let the receiving implementation serve or derive paths without changing original bytes. Derived rewrites/transforms need their own lineage and checks.

The sidecar contains plan.json (host input roots omitted), inputs.json (supplied/capture hashes), runtime-observations.json, asset-run.json and the existing manifest.json. Move the files together; provide new local source roots if reacquisition is required. Never append assessments to a sealed run. Handoff creates a new sealed package containing required originals plus transitive dependencies, review, assessment and implementation-assets.json. Reverify manifest and individual hashes on receipt. Reference tracking, live backend URLs and diagnostic source bundles do not belong in the target application.

## Asset plan schema 1

Top-level: schemaVersion, packageId, contractId, sourceId, phase, policy, sources, seeds. IDs are portable and unique.

- policy: existing authorization, exact HTTP(S) allowedOrigins, explicit non-sensitive publicQueryKeys, optional limits. Each redirect is rechecked. Only anonymous GET is supported; no cookies, profile/session import, authorization headers, request bodies or endpoint replay.
- limits: maxAssets (1000), maxAssetBytes (32 MB), maxTotalBytes (256 MB), maxDepth (8), requestTimeoutMs (20 s), totalTimeoutMs (300 s), maxSourceBytes (5 MB), maxPixels (40 million). Values are positive integers, capped at ten times defaults. Byte/time/depth/count omissions are explicit, never absence findings. Shared totals include failed body transfers.
- file source: id, type=file, root, relative path, exact reference url, optional kind/mime/sha256. This is an explicit URL-to-original mapping, not a directory crawl. Expected hashes fail on disagreement. Sources for an archive resolve through supplied mappings; any unmatched dependency uses authorized GET and remains a new-version observation.
- capture source: id, type=capture, root, optional observations sha256. The sealed run must have matching contract/source IDs and asset-observations.json. An old capture without asset observations remains valid evidence; use adequate supplied assets or new focused observations rather than modifying it.
- seed: exact identified public url, evidenceId, optional kind/sha256. Use for publicly referenced assets or reviewed source declarations, not guessed paths. Supported kinds include image, svg, font, video/audio/media/media-segment, css/html/javascript/json, gltf, wasm, shader, binary and unknown.

Partial/range responses never stand for complete originals. HTTP failures, truncated/oversized streams, HTML masquerading as an asset, wrong expected hashes, decode failures and unresolved dependencies remain unavailable/failed. Acquisition keeps compressed transport provenance but stores response payload bytes; it does not claim wire-byte identity.

## Review schema 1 and completeness

Bind contractId, sourceId, phase, assetRunManifestSHA256 and assessor. Changes to bytes, source, scope or requirements need a new review/revision.

- coverage: unique id, route, state, environmentId, evidenceIds, disposition complete/excluded/unresolved; exclusions require reason/authority. Each row lists reviewed surfaces (kind, disposition, reason, evidenceIds; non-required/excluded surfaces require authority). Cover source/runtime discovery, responsive selection, fonts and relevant media/non-DOM internals; a canvas exists fact cannot establish complete texture/shader coverage.
- obligations: unique id, coverageIds, evidenceIds, authority; mode original/replacement/excluded/none. Original specifies urls and slot. Replacement additionally specifies replacement.url, authority and fidelityEvidenceIds. Excluded/none require scoped reasons; inaccessibility is not exclusion. Implementation bindings require sourceMatch.status=confirmed with evidenceIds, and reuse result PASS or explicit NOT REQUIRED with authority, reason and the exact requested phase. Optional expected metadata checks width/height etc. Font family/glyph/axes and crop/codec/rendering parity remain evidence obligations.
- dispositions: every candidate URL, mode required/source-only/excluded/not-required/allowed-unknown, reason, authority, evidenceIds and obligationIds for required assets. Inferred candidates, diagnostic bundles and unused alternatives still need a disposition; acquisition count does not define implementation scope.
- issueResolutions: assetId for source parsing/runtime limits, or runIssues=true for listed run omissions, plus reason, authority and evidenceIds. Relate each resolution to the affected contract/surface; do not dismiss material unknowns merely because a tool cannot inspect them.
- optional verifications: URL, exact sha256, result PASS, tool, level, authority and evidenceIds for an externally verified format. Maintain the actual receipt separately with commands, versions, findings and limits.

PASS requires populated scoped coverage and obligations, justified dispositions, confirmed original/replacement version and phase-specific reuse, verified required files plus transitive dependencies, and resolved discovery limits. An empty asset list or unknown rendering surface cannot pass automatically. The assessment cannot authenticate a reviewer's evidence/authority; independent review still checks those claims.

## Relevant special surfaces

| Surface | Required discovery / remaining obligation |
| --- | --- |
| Responsive/lazy/dynamic assets | Declared srcset/picture/image-set alternatives and runtime currentSrc at planned widths/DPR/states; replay lazy sweeps and breakpoint transitions. One selected source does not cover other variants. |
| Fonts | Acquire font-face files/subsets and descriptors; verify family/axes/glyph ranges, actual rendered font and load/fallback states. A local() declaration can depend on host fonts. |
| SVG/CSS effects | Preserve original inline/external SVG, fragments, styles, masks, filters, sprites and dependency closure. DOM serialization is derived evidence, not original authored bytes. |
| Media | Manifest-context segment/init/part references use media-segment regardless of generic MIME; native FFprobe supplies standalone audio/video/subtitle stream metadata. FFprobe failures remain failed and cannot be cleared by an external receipt. Initialization-dependent fragments are not supported by the standalone profile; a separately verified initialization-aware decoder is future work; TypeScript `.ts` paths are not globally classified as video. Preserve poster, complete files and declared manifests/segments/init resources. HLS keys are not automatically retrieved. DASH templates, byte-range/chunk playback, live future segments, codec support and DRM remain explicit obligations; use authorized exported originals/segment receipts where needed. |
| Canvas/WebGL/WebGPU/worker | Observe ordinary texture/model/WASM/worker requests; inspect identified shaders/material/atlas/environment/compression dependencies. Binary glTF embeds remain inside original GLB. Required decoder extensions need specialist verification. A frame capture is diagnostic evidence, not an original source asset. |
| Blob/generated/private/embedded surfaces | Opaque blob URLs, closed shadows, inaccessible frames, service-worker caches and generated GPU resources need focused authorized export/owner originals or a contract-approved equivalent. Never turn unavailable probes into absence or substitute screenshots silently. |

For evidence-only delivery, retain BLOCKED asset scope and the smallest resolving input. For reconstruction, required original availability cannot be waived by a rights exception. For frozen v1/v2 evidence, link by hash in a new sidecar and leave previous gates unchanged.

Source parsers accept UTF-8 originals. Non-UTF8 source bytes remain unchanged and unverified until explicit encoding/decoded-derivative evidence resolves their asset declarations. Resource timing alone, unknown response types, and non-GET/application data responses remain review candidates; promote only an identified authorized asset through a seed or supplied mapping.
