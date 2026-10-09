# Asset acquisition hardening — repository candidate

Stage: implementation only. Independent evaluation, validation and installed-skill adoption are separate. The repository skill advances from 2.1.2 to a 2.2.0 candidate; installed copies and reference evidence are not changed.

## Audit and architecture

The existing runner owns environment/state replay, finite readiness, capture provenance and immutable raw runs. package.mjs owns inventory, hashing and sealing. source-report.mjs owns static public-source/map reports. None establishes implementation asset availability or dependency closure. Reuse these owners rather than introduce a crawler, CDP framework, second browser runner or a stronger meaning for manifest integrity.

Use an opt-in asset observer inside capture.mjs, maintained static dependency parsers and a separate sealed acquisition sidecar. Original bytes remain content-addressed and unchanged. Record identity, occurrence conditions, declared/runtime provenance, dependencies, format verification and contract-specific obligations. Generate a receiving implementation handoff. Availability contributes to fidelity readiness; reuse decisions remain independent.

Maintained integrations: Playwright for runtime page/worker response observations; parse5 for HTML; PostCSS/value-parser for CSS; parse-srcset for responsive candidates; Acorn for JS declarations; xmldom for SVG/XML; Sharp for raster decoding; Fontkit for font parsing/metrics; glTF Transform for GLB/glTF structural loading; FFprobe for media metadata. Dependencies are skill-local and locked, not website runtime dependencies. No automatic provisioning. Missing codecs/tools produce unresolved verification. Browsertrix/WARC exports can be supplied inputs; a second archival crawler is not required.

## Requirements and acceptance obligations

- Discover static and executed assets, responsive alternatives, computed/pseudo assets, open shadows, frames and network references. Retain bounded scan limits and version/occurrence identity. Declarations never prove execution. No speculative endpoints or map-source crawl.
- Acquire explicitly authorized origins/public query keys through bounded anonymous GET, embedded bytes or confined supplied files. Validate every redirect. No cookies, authenticated replay, POST, bypass, transformation or URL-based filename writes. Record failures, partial responses and limits.
- Verify hash, payload type and applicable format decoding/parsing. Keep byte identity, fidelity and rights separate. Preserve original bytes, URL query identity, occurrence fragments and dependency edges; merge only identical bytes.
- Assess explicit route/state/environment obligations, discovery review, dependency closure, verification, version identity and implementation mapping. Empty/truncated inventories, inaccessible internals, pending substitutes and unresolved decisions cannot silently pass. Scoped exclusions/substitutions need authority and fidelity evidence.
- Generate portable sealed manifest, assessment and handoff with local paths, pins, aliases, variant/font/media/rendering descriptors and blockers. Reverify on receiving side. Preserve existing four gates and frozen revisions.
- Preserve default schema-2 capture and dependency-free regressions. Engineering tests cover realistic synthetic runtime/static sources, corruption, unauthorized redirects, partial/oversize responses, responsive dependencies and negative completeness.

## Boundaries

Tools cannot prove all dynamic paths or recover private/generated/GPU-only resources. These remain reviewed obligations. Supplied archives retain their version; later GET is a new observation requiring a version match decision. DRM/streaming, closed shadows, service workers, codecs and renderer dependencies need focused evidence or owner-supplied originals when material. Visibility/downloads never grant rights.

Pre-existing tooling deletions are untouched. Their committed catalog was read with git show. No Git commit or remote sync is authorized.

## Integration sources

- [Playwright network](https://playwright.dev/docs/network), [Response](https://playwright.dev/docs/api/class-response): runtime observations and service-worker limits.
- [parse5](https://github.com/inikulin/parse5), [PostCSS API](https://postcss.org/api/): maintained syntax parsers.
- [Sharp](https://sharp.pixelplumbing.com/api-input/), [Fontkit](https://github.com/foliojs/fontkit), [glTF Transform](https://gltf-transform.dev/modules/core/classes/NodeIO), [FFprobe](https://ffmpeg.org/ffprobe.html): format-aware verification.

Engineering regression results will be recorded here. They are not independent evaluation or adoption.

## Delivered implementation

The 2.2.0 repository candidate adds opt-in capture asset observations, static dependency discovery, bounded anonymous/supplied acquisition, original-byte deduplication and pins, isolated format verifiers, scoped completeness review, and sealed implementation asset handoff. It covers responsive sources, pseudo/mask/SVG assets, font subsets/axes, media posters/playlists/segments/renditions, workers/WASM, and glTF resources. Runtime declarations, acquired bytes, version identity, fidelity and rights remain separate.

The existing capture/manifest schema 2, four readiness gates, source-report helper, invocation metadata and frozen reference evidence are preserved. Optional asset schema 1 and tooling dependencies are documented in the skill; no global installation or adoption was performed.

## Engineering check results

- Canonical serial browser-enabled regressions: **41 passed, 0 failed, 0 skipped**. Includes original capture/settled-appearance coverage and capture-to-acquisition import, original hashes, closure/handoff, endpoint replay prevention, failures, font and audio verification.
- Portable copy without parser/browser dependencies: **12 passed, 0 failed, 17 intentionally skipped**. Existing core workflow remains available.
- All skill scripts pass syntax checks; JSON and local resource links resolve; skill-creator quick validation passes; Git whitespace checks pass.
- Locked dependencies resolve; npm audit reported **0 vulnerabilities** at implementation time.
- Engineering receipts: [engineering-regressions.log](engineering-regressions.log), [portable-core-regressions.log](portable-core-regressions.log), [implementation-verification.json](implementation-verification.json).
- Execution: Node 24.19.0, installed Playwright/Chrome; installed Fontkit parsing against a disposable system-font read and FFprobe 9.0.2 against synthetic PCM audio. No reference website or production service was used for tests.

## Unresolved blockers and handoff

No implementation-stage blocker remains. Per-project protected/generated assets, closed or inaccessible surfaces, live/DRM/templated media, required GPU decoder extensions, unsupported encodings and unconfirmed versions/rights remain explicit scoped obligations with acquisition/export/specialist verification or authorized replacement paths. Their discovery/verification cannot be inferred from a screenshot or manifest. The pipeline records and blocks material gaps rather than promising universal discovery of arbitrary dynamic programs.

Work is on main, uncommitted and unpushed. Pre-existing tooling deletions and the untracked all_skills collection were left untouched. Suggested future commit: include the skill and this implementation receipt after the separately requested evaluation/adoption decision; do not include unrelated pre-existing deletions without their own authority.

Independent skill evaluation, dedicated validation and final installed adoption have **not** been performed and remain the separate stage requested by the user.
