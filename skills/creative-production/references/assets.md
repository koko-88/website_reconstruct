# Asset production and handoff

Source art is under projects/creative-workbench/assets/source; derivatives under public/assets.
Original procedural SVG, Blender exporter and saved .blend are maintained alongside the served GLB.
Image/model/KTX provenance stores source and derivative hashes. LicenseRef-Project-Original records
project authorship; publication/distribution remains a separate project authorization. Basis decoder
bytes carry Apache-2.0 LICENSE/NOTICE. Do not use frozen reconstruction media in original examples.

Use existing native installations through absolute environment paths:
CREATIVE_BLENDER_PATH, CREATIVE_GLTF_TRANSFORM_CLI (installed JS CLI), CREATIVE_TOKTX_PATH,
CREATIVE_FFMPEG_PATH, CREATIVE_FFPROBE_PATH. Select existing versioned mise tools where possible.
No install command runs inside discovery or asset production. Native calls use no shell and have
a deadline. Blender runs separately with --background --factory-startup.

From factory root:
```text
npm run creative:assets -- model packages/creative-assets/export-form.py projects/creative-workbench/assets/source projects/creative-workbench/public/assets
npm run creative:assets -- image projects/creative-workbench/assets/source/poster.svg projects/creative-workbench/public/assets "Original project artwork" LicenseRef-Project-Original
npm run creative:assets -- texture projects/creative-workbench/assets/source/poster.svg projects/creative-workbench/public/assets/poster.ktx2 projects/creative-workbench/public/assets/basis
npm run creative:assets -- media SOURCE.mp4 OUTPUT.mp4 "Source attribution" LICENSE
npm run creative:assets -- inspect projects/creative-workbench/public/assets/form.glb
```

Select `npm run creative:route -- assets textures` for KTX2 production. The assets-only profile deliberately has no renderer peer.
Texture production resolves the selected consumer Three installation from the current project directory, or accepts an absolute CREATIVE_BASIS_SOURCE_DIR pointing to the already provisioned Basis JS/WASM source. The asset package declares no renderer peer, so image/media consumers do not pull in Three. The encoder PNG lives in a checked temporary directory outside the serving tree and is removed in finally on success or failure; the original SVG remains the source of record.
Muted media profile: H.264/yuv420p, faststart, <=1280px wide, <=30 seconds; FFprobe inspection and
FFmpeg decoding are mandatory. It is not an audio/mastering or streaming/DRM pipeline.

For source Blender work: choose meters, apply transforms intentionally, triangulate/bake materials,
name meshes/materials, preserve UVs and animation clips when required, budget texture dimensions,
export glTF 2.0 with Y-up, inspect dimensions/triangles/extensions and reload in browser. The current
static source has four meshes; it does not claim rigged/animated-character acceptance.

glTF Transform dedup is the served baseline. Native gltfpack -noq was also exercised on the same
source; select compression only with a matching loader/decoder profile and measured visual error.
KTX tools were exercised producing mipmapped UASTC KTX2 and loading it through the workbench.
Use [glTF Transform CLI](https://gltf-transform.dev/cli) and
[glTFpack](https://github.com/zeux/meshoptimizer/tree/master/gltf) for selected options.

Blender MCP addon connectivity is optional; preserve the user's live scene. ImageMagick is optional
when Sharp already satisfies the selected image transformation. Generated/provider assets require
their real skill/tools, provenance and any explicit cost/publication authorization.

For the maintained native media roundtrip regression, set CREATIVE_FFMPEG_PATH and
CREATIVE_FFPROBE_PATH to the verified absolute executable paths, then run
`npm run creative:verify-media`. It creates an original odd-sized FFV1 fixture, exports even-width/
height H.264/yuv420p, inspects metadata and fully decodes the result. This selected native workflow
fails clearly if its required tools are unavailable; it does not install or silently skip them.
Image and texture rasterization are capped at 20 million input pixels.

Source/output checks resolve existing directory links and canonicalize nonexistent children before
writing. Decoder output also stays separate from the selected decoder source. These checks protect
ordinary local authoring paths; they are not a sandbox for hostile concurrent filesystem mutation.

Set CREATIVE_MEDIA_BROWSER=1 to add the selected real-browser decode/playback check to
creative:verify-media. This requires the review/browser profile (installed Chrome by default);
image/media production and assets-only native checks remain independent of browser/3D engines.
Media regeneration validates a staged MP4 and its provenance before replacing served files. The
single-writer publication uses same-filesystem file renames and rolls back a failed second rename;
the pair is not a cross-file transaction or a concurrent-writer service. Encoding/probe/decode
failure leaves the previous video and provenance intact. A failed rollback retains backups and
reports their recovery directory. Native regression verifies real invalid-source preservation.

ImageMagick is a supplementary raster tool; Sharp remains the maintained image workflow. Verify
its executable and native DLL/module configuration, not only -version. In a process that predates
installation, use the verified installation directory on PATH plus MAGICK_HOME,
MAGICK_CONFIGURE_PATH and MAGICK_CODER_MODULE_PATH. No PDF/Ghostscript workflow is selected here.

All four export profiles stage complete outputs outside the serving tree, validate them and
prepare same-filesystem replacements/backups before publishing. Per-file renames and rollback
protect ordinary single-writer regeneration; this is not a crash-proof multi-file transaction or
a concurrent-writer service. Failed recovery retains backups and reports their locations.
`npm run creative:verify-assets` selects the existing Blender/glTF Transform/Toktx integrations:
it exports a real GLB and KTX2 and checks preservation after invalid optimized GLB bytes or an
obstructed decoder destination. Set their documented absolute environment paths first. Unlike
the portable suite, this selected native suite requires those tools and never silently skips them.
