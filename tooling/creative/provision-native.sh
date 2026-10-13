#!/usr/bin/env bash
# Hosted Linux profile only. Windows continues using verified existing absolute paths.
set -euo pipefail
[[ "$(uname -s)" == Linux && "$(uname -m)" == x86_64 ]]
: "${RUNNER_TEMP:?Run only inside the selected CI runner}"
: "${GITHUB_ENV:?Missing CI environment destination}"
lock=tooling/creative/native-tools.lock.json
native_dir=$(mktemp -d "$RUNNER_TEMP/creative-native.XXXXXX")
for tool in blender ktx; do
  url=$(jq -er ".$tool.url" "$lock")
  digest=$(jq -er ".$tool.sha256" "$lock")
  directory=$(jq -er ".$tool.directory" "$lock")
  executable=$(jq -er ".$tool.executable" "$lock")
  archive="$native_dir/${url##*/}"
  curl --fail --location --retry 3 --connect-timeout 20 --max-time 240 "$url" --output "$archive"
  printf '%s  %s\n' "$digest" "$archive" | sha256sum --check --strict
  tar -xf "$archive" -C "$native_dir"
  selected="$native_dir/$directory/$executable"
  [[ -x "$selected" ]]
  "$selected" --version
  variable=CREATIVE_BLENDER_PATH
  [[ "$tool" != ktx ]] || variable=CREATIVE_TOKTX_PATH
  printf '%s=%s\n' "$variable" "$selected" >> "$GITHUB_ENV"
done
cli="$(mise where npm:@gltf-transform/cli)/node_modules/@gltf-transform/cli/bin/cli.js"
[[ -f "$cli" ]]
node "$cli" --version
printf 'CREATIVE_GLTF_TRANSFORM_CLI=%s\n' "$cli" >> "$GITHUB_ENV"
