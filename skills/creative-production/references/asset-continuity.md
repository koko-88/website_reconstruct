# Asset continuity and selected production handoffs

Keep this plan in the project's owning design/source manifest, separate from immutable inspection
evidence. Existing native commands are in assets.md; this reference defines what to commission.

For each subject record: stable ID, approved source/version/hash, intended role, silhouette and
details that must remain, camera/orientation/lens, materials/palette, light direction, background
or alpha, crop padding, physical/contact anchor, required aspect ratios/poses, rights and fallback.
Distinguish the subject from decorative atmosphere. A reference-conditioning tool can still drift;
compare critical product geometry, labels and identity visually instead of trusting a seed.

Reuse one approved cutout/model through the story where appropriate. If variants are needed,
change only the specified attributes and label them. Prepare a continuity sheet of whole subject,
close detail, hero, transformation, landing and mobile crops. Approval of one hero image does not
approve inconsistent later assets. Do not regenerate each scene independently by default.

## Alpha, plates and derivatives

Inspect real decoded alpha, edge halos on light/dark backgrounds, crop bounds and contact anchor.
A checkerboard painted into RGB is not transparency. Native Sharp resizing preserves existing
alpha; it does not perform semantic background removal. Request transparent_background through
the actual imagegen schema when selected, or use an authorized exposed cutout tool. Do not assume
Higgsfield has a callable remove-background operation because its website mentions one.
If absent, use an approved alpha original, separate Blender RGBA render, or a compositional
background that works; report a true missing capability rather than faking a cutout.
The exposed Canva remove_background schema accepts an already-uploaded MEDIA source reference
and returns a new alpha image. It is a selected cutout handoff, not permission to upload assets or
an account/entitlement guarantee. Use its actual ID/version and concise intent only after the
relevant authorization; preserve the original and inspect the returned alpha edges. No Canva job
or private account inventory was exercised in this hardening.

Clean plates help compose text and shadows without ghost subjects. Align padding/contact anchors
across variants before rotation/translation. Preserve high-resolution masters and prepare only
needed WebP/AVIF/PNG, poster, muted video, glTF/textures through the existing assets profile.
Video scrub requires actual decoded-frame readiness and mobile-safe seek behavior, not just
currentTime updates. For Blender/glTF retain .blend, exporter and optimized derivative provenance;
select compressed variants only with matching tested consumer decoders. Source licensing and
model/texture budgets remain obligations. See current independent asset-review limitations in
IMPLEMENTATION_VERIFICATION.md before relying on unverified edge cases.
Main's later implementation supplies captured-byte provenance, fresh staged Blender exports,
finite/index checks, output-link refusal and owned-tree shutdown, with functional regressions.
Use owned originals and ordinary unlinked destinations; source-file aliases to derived outputs
need the current merge review disposition. Guidance itself does not fix a pipeline or certify
hostile concurrent filesystem mutation. See assets.md and the central verification record.

## Provider decision and authorization

1. Discover actual exposed tools and read-only catalog/model schemas, installed skill and input
   roles. Check reference image support, aspect ratios, output type, quality/duration, price and
   entitlement. Missing cost is unknown, never zero. Public-page examples are not tool schemas.
2. Prepare a concrete brief and exact input list with approved subject IDs, continuity constraints,
   variants, output/alpha needs, destination and per-job/total spend cap. For private inputs get
   explicit authorization identifying data and external destination before any upload/transmission.
   Get explicit paid-generation authorization. Existing precise approval can be reused.
3. Use built-in imagegen for selected raster tasks; direct Higgsfield models_search/models_get
   and generation tools for ordinary media. The installed Higgsfield skill resolves named presets
   or slash commands; do not force ordinary media through an unrelated video/website workflow.
   Soul/identity training and reusable elements are optional selected features, not guarantees.
4. Submit once, retain returned job IDs/status/model/parameters/inputs/cost and original outputs.
   A timeout is an unknown submission, not permission to submit again. Follow the provider's
   bounded wait/display workflow, then inspect output before derivative preparation.
5. Review consistency, alpha and framing locally. Record rejected variants and human selection.
   Do not treat service health, a completed job or machine checks as creative acceptance.

No new vendor, paid identity training, publication or external asset upload is implied by this
factory hardening. Local original assets keep the workflow useful when generation is unselected.
