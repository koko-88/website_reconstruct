# Story score and causal choreography

Scale this to the project. A simple interaction needs a state transition; a cinematic page needs
a compact score. Do not force a film, continuous pinned world, persistent hero or long scroll
onto a task whose purpose is fast information or purchase.

| Beat | Visitor feeling / information | Subject and composition | Cause -> response | Motion/hold | Mobile/static | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Arrival | Curiosity; identify product | Dominant approved subject, readable name | Entry settles -> identity becomes legible | Brief owned entrance, reading hold | Focal crop and clear title | Arrival capture |
| Transformation | Understanding; demonstrate benefit | Same subject, material/detail focus | Subject turn -> detail/copy answers | One deliberate peak, bounded travel | Manual step or compact reveal | Entry/mid/exit and reverse |
| Resolution | Confidence; choose next action | Subject lands near truthful proof/action | Final alignment -> controls become available | Stable final pose; no overshoot | Full DOM action/static proof | Keyboard/touch/action capture |

These are example beats, not mandatory sections. Replace them with the brief's actual sequence.
Write a feeling curve: desired feeling plus the visible cause, rather than device names first.
Vary attention with quiet/readable moments, tension and resolution when relevant. A peak can be
stillness on a busy page. Similar adjacent feelings can be intentional; cut only genuine filler.
Feeling never outranks accurate content, accessibility or the real user task.

## Motion causality

For each moving property, specify its trigger, owner, order/overlap, easing, duration or scroll
range, stable endpoints and interruption behavior. A turn can uncover a headline; a shadow can
cross a photo to express depth. If an event has no purpose, remove or subordinate it. Preserve
reading time and focus. Avoid making the action wait behind decorative spectacle.

Use installed GSAP timeline/ScrollTrigger skills for sequencing and reversible progress, Motion
for component state transitions, R3F useFrame for the rendered scene and Pixi's private ticker
for its field. One property has one owner. Split wrappers or use explicit shared progress rather
than competing transforms. Read the selected APIs rather than inventing wrappers or easing names.
Linear scroll progress can map to poses; authored segment easing controls local launch/settle.
Do not blindly apply a time tween's ease to the whole scroll timeline or double-smooth input.

## Subject, light and depth

Keep the same approved subject identifier, orientation/contact anchor and silhouette across
scenes where continuity matters. Maintain useful visual scale; recompose type/crops before
shrinking away the story. Shadow direction, softness, density and position follow the subject,
light and receiving plane. Check shadows on actual words/images and light/dark surfaces, while
preserving readable contrast. A cutout's baked shadow may not match a rotating DOM shadow;
choose separate alpha subject/shadow assets or render a real scene when justified.

## Responsive and temporal obligations

Plan entry, travel, intentional reading/settling hold, exit and resolved pose, including fast
wheel/touch, reverse, mid-transition interruption and viewport resize. Essential information
must not exist only at a fleeting progress value. Reduced motion shows the story's meaningful
states via a static/manual path; pause retains pose and control usability. Avoid fixed-device
scroll lengths: tune against real content and contact sheets. Reuse the workbench's lifecycle,
cleanup, static fallback and demand rendering. No autonomous taste/refinement loop is introduced.
