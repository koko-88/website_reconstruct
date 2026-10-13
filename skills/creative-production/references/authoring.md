# Original authoring and review

Use a short project-specific design contract: purpose/audience, primary action, content hierarchy,
two or three material/layout choices, type scale, palette, responsive behavior, interaction states,
motion ownership and performance budget. Use the user-selected references as the explicit visual ambition target while keeping original assets and project-specific acceptance.
Run installed UI UX Pro Max design-system search when useful; evaluate the output against the
brief rather than accepting its generic palette/font recommendation automatically.

The workbench's adopted direction is warm paper/ink/rust/lime with editorial scale, numbered
disciplines, a live instrument and native controls. It uses system Arial/Georgia for offline operation.
Each scene has DOM instructions and controls. Its visual language is an example, not a mandate
for future projects.

## Maintained patterns

- creative-motion ScrollComposition: scoped useGSAP + ScrollTrigger, reversible native scrolling,
  preference/pause branching, revert on teardown. PresencePanel: Motion-owned opacity/translation.
- creative-three SpatialStage: local glTF cache, cloned instance materials, demand rendering at
  rest, bounded DPR, original shader, orbit controls with DOM orientation, optional bloom and KTX2.
- creative-pixi ParticleStage: async v8 Application ownership, private ticker, capped FPS,
  ResizeObserver, pointer and DOM orientation, bounded particle count, pause and context-loss fallback.
- creative-assets: originals/derivatives are separate. No renderer is needed for image/media work.

Use transforms/opacity instead of layout animation. Avoid per-frame React state. Keep animation
ownership explicit; never have GSAP and Motion write the same transform. Do not add smooth-scroll
middleware without a real requirement: native scroll already supports the reversible reference.

## Acceptance dimensions

Use installed Chrome locally; CI uses installed Playwright Chromium. Fresh contexts, bounded
readiness, normal-console cleanliness, keyboard/focus, touch, narrow/medium/wide layouts,
live reduced-motion changes, user pause, offscreen rest, remounts and explicit failure injection.
Axe is automated coverage, not screen-reader certification. Snapshot images require human/agent
visual inspection and do not replace temporal tests.

Baseline budgets: initial JS <200 KiB gzip; spatial GLB <=1 MB/20k triangles; workbench actual model
67,720 bytes/4,688 triangles. DPR <=1 (Eco), <=1.5 (High); Pixi 96/240 points, 30/60 FPS cap;
GPU draw calls <40 per sampled display frame. Test the intended target devices before accepting
performance. Software GPU results are functional evidence, not workstation GPU certification.

## Quality target for original projects

The user selected [WebLoved](https://www.youtube.com/@WebLoved) as the visual ambition target.
First-party browser inspection on 2026-10-12 included the
[exploded product](https://www.youtube.com/shorts/vd8IE8Cl4Jc) at assembled, close-up and separated
states, and a [scroll-driven scene](https://www.youtube.com/shorts/VwFlsB1dqRw). Observed: a dominant
3D subject, deliberate camera changes, controlled high-contrast palettes, editorial type, and
transitions that change the composition rather than merely fade cards. Videos show presentation;
they do not establish source mechanisms, load/performance, accessibility or exact site fidelity.

For each future project, adopt a specific art direction and storyboard before engineering: hero,
first transformation, interaction, resolution, narrow-screen framing and static fallback. Require
an original signature interaction and a coherent material/type/light language. Choose appropriate
source models, textures, illustrations or approved generated assets; additional engines are not a
substitute for art direction. Review the browser at those states and through transitions, including
reverse and interruption. Record visual shortcomings explicitly. Build/test success cannot certify
WebLoved-equivalent quality, and no universal fidelity score is claimed.

The maintained /showcase.html reference (SHIFT) provides a full-screen original composition,
scroll-driven exploded glTF, camera/material progression, shader particle atmosphere, optional
bloom and manual keyboard chapters. It reuses the same owned Blender source and source packages.
The editorial instrument and immersive study are different maintained consumers of the same
capabilities. Future projects own their identity and final visual acceptance.
