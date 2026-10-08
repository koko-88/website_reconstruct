# Stage 2 — Reusable skill hardening and asset acquisition

Status: **OPEN — prerequisite audit and tooling admission** (2026-10-08).
This is a reusable workstation/tooling stage, **not** authorization to implement HBC or to change accepted PRODUCT.md/ROADMAP.md. Track actionable issues and dependencies in **Beads**, not duplicate Markdown issue lists.

## Why this stage exists

The existing `skills/reference-reconstruction` v2.1.2 already has frozen-evidence handling, provenance, state/route/environment matrices, source and non-DOM inspection, Playwright capture, package verification and a 10-case historical test record. Its `scripts/capture.mjs` records HTTP response metadata and screenshots but does **not** persist original image/video/audio/font response bodies as a complete, verified asset library. The HBC package accordingly documents asset URLs and visual evidence yet lacks some reusable source media bytes.

Repair this one capability gap in the existing skill and its handoff/gates. Do not create a duplicate skill, reinterpret sealed historical captures, equate a response URL with downloaded bytes, or silently relax local-versus-release permissions. **The target is faithful UI/UX, interactions, motion and responsive behavior; no website backend or exact third-party ticket commerce.**

## Canonical boundaries

- `PRODUCT.md` governs HBC scope. `ROADMAP.md` governs execution admission. This stage changes neither.
- `skills/reference-reconstruction/` owns reusable inspection rules and scripts. `skill-hardening/` contains prior audit/test history, not current product policy.
- `tooling/reconstruction-workstation/`, `mise.toml` and `mise.lock` govern reusable host installation and reproducibility. Application dependencies remain task-scoped.
- `reference/**` remains immutable; write a new evidence revision for new acquisitions, including hashes, provenance and failures.
- Existing `tooling/creative-capabilities/` already inventories FFmpeg, Blender, GIMP, GSAP/Pixi skills, Spector.js, Babylon MCP and diagnostics. None of these substitutes for binary response acquisition.

## Tool admission

| Tool/capability | Role | Baseline action |
| --- | --- | --- |
| Existing Playwright capture + Chrome DevTools MCP | Scoped network inventory and original binary capture with safe writes | **Extend existing runner**; do not install a second browser automation framework |
| `ffprobe` / FFmpeg, image decoders | Source-video metadata and independent media structural inspection | Reuse workstation capability; verify before applying profile |
| Anthropic `skill-creator` | Versioned before/after skill evaluations, grader and trigger-review workflow | Discover installed global skill before acquiring a pinned upstream copy; do not automatically invoke expensive Claude runs |
| `promptfoo` | Optional agent prompt/skill behavior regression, cost-capped | Detect global installation; pin tool if admitted into the reusable bootstrap |
| `inspect-ai` | Optional complex agent-run evaluations | Detect `inspect` CLI; pin a narrow Python environment if admitted; full `inspect-evals` corpus is **not** required |
| Browsertrix Crawler | Optional WARC/WACZ archive acquisition when scoped Playwright is insufficient | **Conditional escalation only.** Official CLI requires Docker; no Docker is introduced into this website runtime. Use an isolated host or hosted provider only with a separate decision. |

Use `mise run hardening:preflight` for a read-only inventory. It does not install, claim integration reachability, incur LLM evaluation credits, or change the app. `mise run workstation:status` and `mise run workstation:verify` retain ownership for the existing reusable workstation.

## Acceptance contract for this stage

1. **Existing-capability inventory** — versions and paths, executable vs configured vs live/reachable states, no blind reinstallation. Install/admit only missing capabilities with reproducible versions and exact source/lock. Vendor skill copies must be pinned, not unbounded `main` downloads.
2. **Asset inventory** — discovered assets from DOM/HTML srcset, CSS URLs, SVG, runtime/network responses and relevant manifests; classify same-origin/CDN/third-party, lazy and state-dependent resources. Do not use guessed endpoints or unapproved private/credentialed traffic.
3. **Acquisition** — bounded requests and original bytes with safe URL handling, content-type checking, download limits, redirects and origin policies, status and timing. Do not indiscriminately persist cookies, signed query strings, PII, full HAR or credentials; record sanitized provenance.
4. **Integrity and media metadata** — sha256, original/mapped URL identity, bytes, dimensions/codec/duration/variants (using existing FFmpeg or appropriate verifier), duplicate detection, content validation and named failure reasons. Do not mistake manifest integrity for fidelity.
5. **Asset completeness gate** — each *required* reference visual/media dependency maps to a stored verified file or an explicit missing/inaccessible/intentional-replacement disposition. A source screenshot, asset path or temporary browser cache does not count as an acquired implementation asset.
6. **Separate permission gate** — publicly readable media does not establish a public redistribution license. Local validation input availability, public deployment authorization and replacement/deviation decisions remain independently assessed.
7. **Skill revisions** — refine original `reference-reconstruction` references, capture/asset helpers, package schema and handoff/gates with progressive disclosure. Keep original name, preserve frozen evidence and avoid per-website hardcoding.
8. **Deterministic regression** — offline fixtures cover CSS background, picture/srcset, fonts, poster/video, lazy loading, redirects, HTML/CSS/JS-discovered URLs, missing/oversized/invalid/truncated responses, duplicate bodies, withheld resources, zero-byte sources, no unauthorized requests, and safe retry/abort behavior.
9. **Skill evaluation** — compare current skill against revised skill on the same bounded tasks; use actual saved artifacts/automated assertions first, model-based grading only if results require it and with explicit token/run budgets. Failed/unknown cases block promotion.
10. **CI and change management** — PR gate executes deterministic tests and package integrity without live target traffic, Docker, external model calls or secret requirements. Host-only/paid evaluations run separately by explicit choice; record versions, outcome, failure evidence and rollback.
11. **HBC reconciliation** — produce a new writable acquisition revision and update only applicable pre-build packet/candidate corrections after measurements. The 13 ProductShape questions remain product-review inputs, not automatically answered by installing tools.

## Stop/go criteria

Stage 2 is **NOT COMPLETE** until one declared same-origin image, responsive variant, CSS texture and relevant video (or explicit honest inaccessible disposition) can be processed end-to-end in a controlled test, the local reference package has a truthful per-asset manifest, and the altered skill survives deterministic tests, review and CI. Do not promote `Complete` based only on tool presence, a successful prompt, a captured URL or a checksum.

## References

- [Existing skill](../../skills/reference-reconstruction/SKILL.md) and [existing hardening audit](../../skill-hardening/reference-reconstruction-v2-audit.md)
- [Current capability inventory](../creative-capabilities/README.md) and [workstation profile](../reconstruction-workstation/README.md)
- [HBC asset gaps](../../implementation-scope/pre-build-packet/typography-assets.md), [historical asset register](../../reference/haunted-boulder-city-v2/rev-2.0.0-real-01/asset-reuse.md)
- [Anthropic Skill Creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator), [Promptfoo](https://www.promptfoo.dev/docs/installation/), [Inspect](https://inspect.aisi.org.uk/), [Playwright response bytes](https://playwright.dev/docs/api/class-response#response-body), [Browsertrix Crawler](https://crawler.docs.browsertrix.com/user-guide/)
