---
name: creative-production
description: Build and refine original commercial websites with distinctive art direction, image-grounded moodboards, cinematic storytelling, causal motion, 3D, shaders, particles and consistent assets through the AI Factory. Use for original creative frontend authoring, expressive landing pages, scroll experiences, mobile art direction and browser visual critique, even when no engine is named. Reference inspection and reconstruction evidence belong to reference-reconstruction.
---

# Creative Production

Read repository AGENTS.md and the active project contract. This skill orchestrates original
authoring; it does not change reconstruction evidence, HBC gates or Reference Intelligence.
Work in the existing project or a selected consumer under projects/. The maintained workbench is
an implementation reference, not the default identity or dependency list for every site.

## Discover only what the project needs

Select profiles first with `npm run creative:route -- dom motion review`, then run
`npm run creative:discover -- dom motion review` from the factory root. Omit profiles only for an
explicit all-profile diagnostic; discovery does not certify connectivity or acceptance. Pass `-- --mcp-inventory FILE --output FILE`
only with a real current-agent inventory. `--output` refreshes the selected discovery snapshot;
use a fresh path when retaining a historical probe. Capture/review rounds remain exclusive and
never overwrite evidence. Installed/exposed is not exercised or certified.
For a selected consumer use `-- --consumer projects/<name>` so workspace-local peers resolve.
Read tooling/creative/capabilities.json; select `npm run creative:route -- dom motion review`,
adding spatial, particles, assets or textures only when needed. Probe selected executables/services.
Repair missing capabilities within authorization; do not install advertised upstream stacks blindly.
Load [specialized handoffs](references/composition.md) for the selected discipline. Use skill paths
from discovery; do not duplicate GSAP/Pixi/design manuals. Project audience, approved identity and
accessibility resolve conflicting design advice.

## Establish a direction the visitor can recognize

Read [direction and visual intelligence](references/direction.md) for new concepts or a makeover.
Capture purpose, audience, commercial action, content/proof, feeling and constraints in the
project's owning design/spec artifact. Infer known answers; ask only for consequential missing
decisions. A simple page may need a paragraph and a frame; an expressive experience needs a scene
score and representative desktop/mobile compositions.

Ground decisions in visible images, composition studies and material/type/light references.
Annotate each moodboard item with what it teaches and what stays original. Inspiration does not
authorize copying identity, assets, claims or proprietary layouts. Delegate reference acquisition
and evidence contracts to reference-reconstruction when inspection is needed; keep creative
interpretations separate from immutable observations.

Make structural originality concrete: a subject, visual grammar, commercial insight or signature
interaction recognizable without the logo/palette. Avoid generic decoration and universal style
bans. A quiet commercial page can be exceptional without a GPU scene. Get explicit human approval
of a concrete visual direction before treating subjective taste as settled. Existing approval
persists; prepare reviewable compositions through reversible work. Silence/test passes/agent taste
are not human approval.

## Score scenes, then select mechanisms

Read [story and motion](references/story-motion.md) for scroll, a persistent subject or cinematic
choreography. Give each beat a visitor feeling, information/proof, visible cause and response,
framing, motion ownership, reading/settling hold, mobile variant and resolution. Plan a memorable
moment when justified; resolve it into the commercial action. Emotional drama cannot displace
essential truthful content.

Keep a persistent hero only when it carries the story. Preserve identity and visual scale, compose
text around it, and make shadows respond to subject and receiving surfaces. Motion needs a cause,
deliberate order, launch/settle curves and stable landing. Repeated fades do not create a story.
Native scrolling and short readable compositions remain valid choices.

Reuse core/motion/Three/Pixi packages and [maintained patterns](references/authoring.md) and
[spatial guidance](references/spatial.md). Give one library ownership of each animated property.
Prefer transforms/opacity, scoped GSAP cleanup and demand rendering; avoid per-frame React state.
Do not add smooth-scroll middleware without a real requirement. Select Three/R3F/Drei/postprocessing
for scenes, Pixi for 2D fields, Motion for component transitions.

## Produce a coherent asset family

Read [asset continuity and provider handoff](references/asset-continuity.md) when commissioning,
generating, cutting out or replacing assets, and [native workflows](references/assets.md) for
commands. Specify identity, camera/orientation, silhouette, light, color/material, crop/alpha,
contact anchor and variants. Carry the approved subject through scenes. Review replacements in
every pose and mobile frame, not only the hero.

Use actual provider schemas and installed skills. Catalog/authentication is not generation.
Paid generation and external data transmission require explicit authorization for provider,
inputs and spend limit; a skill cannot grant it. Prepare the concrete request first. Do not
silently submit jobs, train identities, upload private assets, add accounts or publish. Keep
originals separate, record rights/provenance and use Blender/glTF/Sharp/FFmpeg/KTX for derivatives.
Hashes establish bytes, not rights or visual consistency.

## Review the browser, not the build alone

Read [visual and temporal review](references/visual-review.md) for captures, contact sheets,
dead-scroll triage and precise feedback. Inspect representative states and transitions on desktop,
touch/mobile and reduced motion: start/middle/end, entry/exit, reverse, fast/slow and interruption.
A moving background cannot prove story progression. Label intentional holds and judge whether
the reader has useful content during them.

Reuse Playwright/DevTools/Polypane/Spector. Create a sheet from actual captures with
`npm run creative:review -- --manifest CAPTURES.json --output REVIEW_DIRECTORY`; schema/example are
in visual-review. The helper does not capture, alter originals, judge aesthetics or refine
autonomously. Its flags need the scene score and actual interaction.

Collect feedback in bounded rounds: annotated capture, viewport/state/progress, observed problem,
intended result and affected scenes. Apply concrete authorized fixes and retain round evidence.
Require explicit human direction/final creative approval separately from engineering acceptance.
Do not build an autonomous self-refinement loop or fabricate subjective parity.

For changed workbench code run creative:build, creative:check and creative:test; consumers own their
checks. Verify keyboard/touch/focus, live reduced-motion, pause, resize, failures, lost graphics,
offscreen/hidden rendering and teardown. Keep essential content/actions in DOM with meaningful
static fallback. Measure actual renderer/DPR/draw calls/timings on target devices. Software GPU,
axe and screenshots provide bounded evidence, not full certification.

Record checks, omissions, outstanding reviews and human approval state in the owning task/plan and
IMPLEMENTATION_VERIFICATION.md. Preserve frozen evidence. Functional success cannot establish
WebLoved-wide visual equivalence. Read [source decisions](references/source-map.md) for the
differential and rejected upstream mandates; it is supporting rationale, not new project policy.
