# Local Fixture Interface and Dependency Gate

Owner: this feature's [plan](../plan.md), under [PRODUCT.md / FC-TARGET-DESIGN-01](../../../PRODUCT.md). This contract does not grant new acquisition/publication rights or alter sealed evidence. Local validation can use already-present package assets; public distribution and real adaptation retain TR-01/TA-01 gates. Reference application HTML/CSS/JS/widget code is not a fixture dependency.

## Concrete audited inventory

All present font paths below are relative to `reference/haunted-boulder-city-v2/rev-2.0.0-real-01/public/`; copy permitted local-validation inputs to repository-root gitignored `local-fixtures/home/` without changing originals. Build/test preparation stages selected bytes into gitignored `app/public/fixtures/home/`. Neither directory may contain tracked third-party/local-only fixture bytes. The 2026-10-06 replan changes application serving/build paths, not the observed inventory or reuse basis.

| Role | File/status | Bytes / SHA-256 |
| --- | --- | --- |
| City/display Anton |`display.ttf`, present |170812 /`a4ba3a92350ebb031da0cb47630ac49eb265082ca1bc0450442f4a83ab947cab` |
| HAUNTED Manticore |`manticore.woff2`, present |138348 /`58dee0b74d93d9468b43cb4b62d74e2d4c994fa8d8ae1668c1ed536ce211fb58` |
| Labels Space Mono |`space-mono-400.woff2`, present |9464 /`e0c8e616bda27642f4c3cebaecff6525d901e73afc8a227cbbb0f2af4810f300` |
| Body/control Arial |Windows system dependency |installed/rendered identity must be recorded, not an invented file copy |
| Hero town |`haunted-downtown-boulder-city.webp` and `-960.webp`, missing |source/inventory/PNG describe role, not available bytes |
| Loader/home fog |`fog.webp`, missing |cannot certify replacement from intention alone |
| Header brand |`bz-logo.svg`, missing |declared intrinsic1326x655 does not supply artwork |
| Arrows/star/grain |independent assets to author |source-embedded paths/encoded noise are not standalone reusable input code |

This inventory reflects targeted present-file examination, not new reference observations. No missing media was fetched during planning. Each new fixture must be stored separately from `reference/**`, attributed to its actual acquisition/authoring date, and never presented as historic byte identity. The tracked repository stores only fixture metadata/provenance; local-only bytes remain in ignored source/staging locations.

## Manifest interface

Planned `app/fixtures/home/manifest.json` contains `schemaVersion`, `fixtureId`, `revision`, `phase`, `assets[]`, `referenceInputs[]` and `deviations[]`. Asset fields are defined in [data-model](../data-model.md). Requirements:

1. Every required role has exactly one selected binding or a deterministic declared source-variant set. Each source file is allowlisted beneath gitignored repository-root `local-fixtures/home/` with exact size/hash/media type; generated serving copies live only beneath gitignored `app/public/fixtures/home/`. Record `stagedPath`, `builtPath` and local `runtimeUrl` for each binding; built passthrough bytes are beneath `app/dist/fixtures/home/`. Paths have explicit root semantics; reject traversal and symbolic/junction escapes. No executable application code, remote URL at runtime or unlisted asset.
2. Each original points to an existing package path and digest; each independently authored asset records the authoring source and resulting shape/texture/metric consequences. Missing assets explicitly stay missing; no fabricated digest/path or pending intention can be `verified`.
3. Newly supplied/acquired original media needs a concrete source and applicable authorization/phase basis. FC's already-present allowance is not silently extended to missing live media. Newly downloaded current bytes, if separately authorized later, are implementation fixtures rather than sealed observations.
4. Replacement records contain an actual file/source, permitted use basis, intrinsic aspect ratio/focal point/crop, alternative text as relevant and measured appearance consequences. If required composition cannot meet the contract, acceptance fails or remains blocked; a documented substitution is not automatically approved fidelity.
5. Original-font copy hashes are exact. Expected loaded face/glyph metrics/wrapping must also pass. Arial resolution is an environment prerequisite. All visible media/texture/font dependencies must actually load; broken image `complete` is insufficient.
6. Reference inputs list canonical HOME PNG/JSON/E2-013/E2-014 and the exact relevant original files with SHA-256. Verifier checks before/after identity and does not write to sealed/frozen input trees or the historical packet receipt.
7. Staging verifies exact selected-file set equality and size/hash identity, not merely the presence of required files. The complete `app/public/` tree may contain only the selected fixture serving paths; stale/unlisted files fail preflight. Do not copy a source directory wholesale or transcode/optimize originals implicitly. A concrete independently authored replacement records tool/recipe/output identity and consequences; optional GIMP/Blender/FFmpeg availability is not a selected replacement or a new acquisition allowance.
8. `build` performs staging and fixture preflight automatically. Verify exact fixture file-set/hash equality again in `app/dist/fixtures/home/`; inspect all built output for unexpected source, metadata, test, evidence or inspector files. Fixture metadata is not served. Vite's public directory is copied as-is, so ignore rules alone cannot enforce the build boundary. Use application-local Vite configuration, never repository root as publicDir or a source alias. Any generated cleanup is confined to resolved, checked application staging/output paths, never source fixtures, sealed evidence or provisional root npm state.

## Resolution and validation order

Select actual permitted town/fog/logo bytes, or concrete allowed replacements with measured effects, before five-region fidelity acceptance. Static/lifecycle work can be validated in isolation while supply is unresolved, but no affected result can claim SC-007/PASS. Do not implement placeholders that are silently promoted to fixtures. For authoring simple icon/noise replacements, compare metrics/shape/depth against named evidence and retain visible consequences.

`verify:fixtures` checks bytes/hash/allowlist/source identity and MUST fail if local-only fixture or staged serving bytes are tracked by Git. Browser readiness verifies hero and brand decode/currentSrc/positive natural dimensions, decoded fog texture even when used by CSS, intended font faces and role metrics. Runtime visual requests must stay local and limited to these assets; only main/CSS/fixture requests are allowed. Provider widgets, analytics, UFO/spirit/later imagery and commerce are out of scope.

The manifest and local-only distribution status must survive the build. Before any public/distributed release or real adaptation, return to FC's canonical source/license/replacement and target-mapping gates. This design is not publication clearance.
