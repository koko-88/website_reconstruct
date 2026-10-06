# Reusable reconstruction workstation

This directory is the machine-level reproducibility profile for website reconstruction work. It is intentionally separate from HBC application dependencies.

## Contract

- `mise.toml` owns reusable host packages and pinned source repositories.
- Root `mise.toml`/`mise.lock` own this repository's project toolchain and tasks.
- `app/package.json`/`app/package-lock.json` will own application dependencies when the accepted Spec Kit task creates them.
- Browser/OS/font/DPR/GPU conditions that affect fidelity are **verified and recorded**, not blindly replaced by bootstrap.
- Project runtime candidates such as GSAP, Three.js, PixiJS, Babylon.js, Theatre.js and Lenis are never installed merely because the workstation can support them.

## Use

From the repository root:

```text
mise run workstation:status
mise run workstation:plan
mise run workstation:apply
mise run workstation:verify
```

`workstation:plan` is read-only. `workstation:apply` installs only missing declared packages/repositories; it does not upgrade every installed package on each run. Pinned repositories fail on dirty/conflicting checkouts instead of resetting local work.

The profile currently manages Windows host presence for Git, Blender, GIMP, RenderDoc, FFmpeg and uv, uses Scoop for KTX-Software when Scoop is available, and pins GSAP/PixiJS skills plus Spector.js and Blender MCP source checkouts to immutable commits. Root mise tooling additionally pins glTF Transform 4.5.1, gltfpack 1.3.0 and Babylon MCP servers 9.28.0. Full bootstrap runs a lock-respecting Spector MCP install/build and provisions its Playwright Chromium.

Some integration state remains intentionally verification-only: Codex/agent MCP configuration, Blender bridge reachability, browser extensions, exact Chrome identity, GPU/driver state and application runtime selection. Those surfaces are user/profile or task specific and must not be silently overwritten.

## Reuse in later projects

Keep this directory independent of HBC paths or product assumptions. It can be extracted into a dedicated setup repository later without redesigning the profile; `mise bootstrap --from <repo>?ref=<tag-or-commit>` is the intended machine-bootstrap form once published separately.

## Explicit MCP setup surfaces

Spector's pinned source/build is converged by `mise run workstation:apply`. MCP client configuration remains user-profile state and is verified rather than overwritten.

Blender MCP keeps its client/add-on setup explicit because it edits multiple user applications. After the workstation has uv, run the pinned setup only when needed:

```text
uvx mcp-for-blender@2.1.1 setup
```

Babylon's seven MCP executables are installed as the pinned `@babylonjs/mcp-servers@9.28.0` mise tool. Client-specific MCP entries are verified separately.
