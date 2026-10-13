export function requireHardwareRenderer(renderer, forcedSoftware) {
  if (forcedSoftware === '1' || typeof renderer !== 'string' || !renderer.trim() ||
      /masked|swiftshader|llvmpipe|softpipe|lavapipe|software|basic render|unknown/i.test(renderer) ||
      !/nvidia|geforce|quadro|radeon|\bamd\b|intel|apple|adreno|mali|powervr/i.test(renderer)) {
    throw new Error(`Hardware performance acceptance requires an observed hardware renderer; got ${renderer}. Run portable checks with CREATIVE_TEST_PROFILE=portable and retain hardware acceptance as NOT_RUN.`);
  }
  return renderer;
}
export function testProfile(value = 'hardware') {
  if (!['portable', 'hardware'].includes(value)) throw new Error(`Unknown CREATIVE_TEST_PROFILE: ${value}`);
  return value;
}
