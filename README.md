# AI Factory

Reusable capability infrastructure with project applications under `projects/`.
This checkout implements Creative Production. Reference Inspection remains provided by the mature
[reference-reconstruction skill](skills/reference-reconstruction/SKILL.md); Reference Intelligence
is outside this change. Start coding-agent work from [AGENTS.md](AGENTS.md).

## Run the Creative Workbench

Node 24.19.0 / npm 11.17.0; native workstation tools remain locked in mise.
```text
npm ci --workspace @ai-factory/creative-workbench --workspace @ai-factory/creative-assets --include-workspace-root=false --ignore-scripts
npm run creative:dev
npm run creative:build
npm run creative:check
npm run creative:test
npm run creative:discover
npm run creative:route -- dom motion spatial review
```

Open http://127.0.0.1:4173. Browser tests use installed Chrome; select
CREATIVE_BROWSER_CHANNEL=chromium for a provisioned Playwright Chromium installation.
The app runs entirely from local art/models/fonts/decoders. Asset regeneration requires selected
native executables, described in [asset workflow](skills/creative-production/references/assets.md).

## Reuse in projects/

- `packages/creative-core`: preferences, lifecycle, quality and failure presentation; React peer.
- `packages/creative-motion`: working GSAP scroll and Motion transition patterns.
- `packages/creative-three`: R3F/Drei/glTF/shader/bloom/KTX2 scene.
- `packages/creative-pixi`: working interactive PixiJS v8 field.
- `packages/creative-assets`: image, Blender/glTF, texture and muted-media processing.
- `projects/creative-workbench`: maintained consumer and native browser acceptance suite.
- `tooling/creative`: declarative capability registry, read-only discovery and explicit routing.

Create a normal Vite/Next/frontend project under projects/<name>. Declare only the selected
@ai-factory packages and their peers in that project's manifest. Source-package exports are
compiled by the consumer's TypeScript-aware bundler. A scoped install uses:
`npm install --workspace <project-name> --include-workspace-root=false`.
The full factory install intentionally includes the all-profile workbench and previously provisioned
root tools. It does not define the dependency list for every project. No universal rendering engine,
site generator, provider account or deployment system is added.

[Creative Production skill](skills/creative-production/SKILL.md) routes supported agents through thin
Codex/.agents, Claude, Cursor, Cline and OpenCode adapters. Existing global design/GSAP/Pixi skills
are discovered and reused rather than duplicated.

[Feature contract](specs/creative-production/spec.md),
[implementation plan](specs/creative-production/plan.md), and
[verification results](IMPLEMENTATION_VERIFICATION.md) distinguish operational workflows from
untested/optional integrations. Workbench validation does not advance HBC delivery gates.

## Immersive original reference

Open http://127.0.0.1:4173/showcase.html for SHIFT: an original scroll-driven sculpture with
exploded glTF geometry, a moving camera, shader particles and optional bloom. Manual chapter
controls work with keyboard, pause and reduced motion. The same consumer builds and browser tests
cover both the instrument and immersive reference. The user's [WebLoved quality target](https://www.youtube.com/@WebLoved)
is carried into [authoring and visual acceptance](skills/creative-production/references/authoring.md).

For selected native asset verification, run `npm run creative:verify-assets` after supplying the
verified Blender/glTF Transform/Toktx paths. `npm run creative:verify-media` uses verified FFmpeg/
FFprobe; set CREATIVE_MEDIA_BROWSER=1 for real Chrome H.264 playback. The portable check remains
independent of native application installation. See the canonical skill for the Windows MCP
launcher and permitted temporary screenshot handoff. Optional Figma/imagegen/Higgsfield/Firecrawl
inputs are routed through their existing skills and real provider schemas.

Creative direction, scene scoring, asset continuity and subjective approval are routed through
the hardened canonical skill's progressive references. See its source-map for adopted practices
and consciously deferred integrations. Generate a labeled contact sheet from actual browser
captures with `npm run creative:review -- --manifest CAPTURES.json --output REVIEW_DIRECTORY`.
The visual-review reference defines the manifest and conservative hold flags; it never grants
creative approval. To verify integration against a running built workbench, set
CREATIVE_REVIEW_URL to its loopback origin and run `npm run creative:verify-review`.
Use a fresh review directory each round. Verification creates a unique capture round; an explicit
CREATIVE_REVIEW_RUN_ID must be new. Prior captures/reports remain intact. See the centralized
verification record for reconciled engineering findings, merge checks and pending human feedback.
