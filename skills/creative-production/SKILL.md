---
name: creative-production
description: Produce original interactive websites with design direction, motion, 3D, shaders, particles and original assets using the AI Factory workbench. Use for creative authoring; reference inspection and fidelity evidence remain owned by reference-reconstruction.
---

# Creative Production

Read repository AGENTS.md and the active project contract. This skill owns original authoring and
capability selection. It does not change reconstruction evidence, HBC gates or Reference Intelligence.

## Discover and select

Run `npm run creative:discover` from the factory root. Supply `-- --mcp-inventory FILE --output FILE`
only with a real inventory from the current agent tool catalog. Discovery reports installed/exposed,
never certified. Read `tooling/creative/capabilities.json`, then use
`npm run creative:route -- dom motion spatial review` with only the required profiles.
Probe the selected native executable/service before use; configuration is not connectivity.

Use the maintained `projects/creative-workbench` as the runnable reference, and consume its source
packages in a new project under `projects/<name>`. Full root install includes the reference app.
A consumer selects individual packages/peers; do not copy the workbench's dependency list by default.

- DOM/layout: creative-core plus installed frontend-ui-engineering and UI UX Pro Max.
- UI transitions/scroll: creative-motion, installed GSAP core/react/scrolltrigger/performance skills;
  Motion for component transitions. Give one library ownership of each animated property.
- 3D/glTF/shader: creative-three, Three/R3F/Drei. Read [spatial patterns](references/spatial.md).
- 2D fields/sprites: creative-pixi plus installed pixijs router and its selected specialist skills.
- KTX2 textures: select the textures profile explicitly; it requires the chosen Three installation for local Basis decoders.
- Source assets: creative-assets; read [asset workflow](references/assets.md). Blender, glTF
  Transform, gltfpack, KTX and FFmpeg are optional native tools, never automatic reinstall targets.
- Validation: Playwright/axe plus available browser-testing-with-devtools, Polypane or Spector.
  Match the tool to the check and verify service connectivity before depending on it.

Find installed skill paths in discovery output; do not duplicate their manuals. If design intelligence
is unavailable, derive an explicit project design contract rather than falsely claiming a search.
Figma and image/video generation are optional authoring inputs; use their installed skills and
provider tools only when selected by the task. No paid generation or public publishing is implied.

## Author and verify

Before implementation, write purpose, audience, visual direction, typography/palette, responsive
rules, interaction states and acceptance in the project's owning spec/design artifact.
Use [authoring and review](references/authoring.md). Preserve source assets and record attribution,
license and hashes separately from derived serving assets. A hash does not grant reuse rights.

Run `npm run creative:build`, `npm run creative:check` and `npm run creative:test` for workbench
changes. Future projects own their own acceptance tests; workbench success is not acceptance of a
different website. Inspect screenshots AND temporal/state tests. Check reverse/interrupted scroll,
keyboard/touch, live reduced-motion changes, pause, offscreen/hidden rendering, resize, route cleanup,
load failures and lost graphics. Measure the actual renderer, DPR, draw calls and frame timings.
Essential content and actions stay in DOM; GPU failure needs a meaningful static view.

Record performed checks, missing integrations and review disposition under
IMPLEMENTATION_VERIFICATION.md and the owning task/plan. Keep frozen evidence intact.

Use the user-selected WebLoved visual ambition and the maintained immersive /showcase.html
reference when a project calls for expressive scenes. Carry the reference into a project-specific
storyboard and actual visual review; see authoring and review. SceneJourney combines camera,
exploded glTF and shader particles without adding another rendering engine. Functional checks do
not establish channel-equivalent visual quality by themselves.


For an installed but stopped Windows Blender/Polypane bridge, use
`pwsh -File tooling/creative/start-workstation.ps1 -Capability blender -Executable ABSOLUTE_BLENDER_EXE`
or the polypane capability with its verified executable. The launcher preserves existing processes
and never installs, replaces scenes, changes preferences or enables provider accounts. Re-probe the
MCP after launching. Polypane uses the documented --remote-debugging-port=5858; navigate an existing
pane with its page ID because its Electron runtime does not support Chrome's new-page/context APIs.
Chrome/Polypane MCP filesystem access may permit only the OS temporary directory when the client
has not negotiated repository roots. Save there, then copy the returned file into project artifacts
with normal authorized filesystem tools; do not disable the service's path protections.

Optional asset inputs are discoverable in capabilities.json: Figma, built-in imagegen, Higgsfield
image/video/3D catalogs and Firecrawl research. Use each selected provider's installed skill and
actual schema. Catalog/authentication health does not certify generation or a project's final assets.

