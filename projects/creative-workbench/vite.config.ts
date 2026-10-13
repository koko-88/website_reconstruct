import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: {
    chunkSizeWarningLimit: 850,
    rolldownOptions: {
      input: {
        workbench: fileURLToPath(new URL('./index.html', import.meta.url)),
        showcase: fileURLToPath(new URL('./showcase.html', import.meta.url)),
        modelReplacement: fileURLToPath(new URL('./tests/fixtures/model-replacement.html', import.meta.url)),
      },
      output: { codeSplitting: { groups: [{ name: 'three-engine', test: /node_modules[\\/]three[\\/]/ }] } },
      onLog(level, log, handler) {
        // This is a client-only Vite application; library RSC directives have no semantics here.
        if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('use client')) return;
        handler(level, log);
      },
    },
  },
});
