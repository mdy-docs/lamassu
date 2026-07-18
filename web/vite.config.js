import { defineConfig } from "vite";

// The playground deploys to the GitHub Pages project site
// https://mdy-docs.github.io/lamassu-js/, so assets must be served under that
// sub-path. Override with `--base=/` for a root deployment or local preview.
export default defineConfig({
  base: "/lamassu-js/",
  build: {
    outDir: "dist",
    target: "es2022", // top-level await in the engine's ESM loader
  },
  // The Emscripten .wasm must not be inlined as base64 — keep it a real asset
  // so streaming compilation works and the file stays cacheable.
  assetsInlineLimit: 0,
});
