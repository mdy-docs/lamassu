/*
 * @mdy-docs/lamassu-js — friendly ESM wrapper over the Emscripten build.
 *
 * The heavy lifting lives in ./dist/lamassu.mjs (the engine compiled to a
 * WebAssembly ES module by Emscripten). This wrapper turns its low-level
 * cwrap surface into a small typed API and handles locating the .wasm in both
 * native ESM (import.meta.url) and bundled (explicit wasmUrl) setups.
 */
import createLamassuModule from "./dist/lamassu.mjs";

/**
 * Instantiate the engine. Resolves to a Lamassu instance.
 *
 * @param {object} [options]
 * @param {string} [options.wasmUrl]  Explicit URL for lamassu.wasm. Required
 *   when a bundler (Vite/webpack/…) relocates the module — import it with
 *   `import wasmUrl from "@mdy-docs/lamassu-js/lamassu.wasm?url"`. Omit for
 *   native ESM, where the sibling .wasm is found via import.meta.url.
 * @param {(text: string) => void} [options.print]  Sink for the engine's
 *   internal stdout (rarely needed; script output is returned by `eval`).
 */
export async function createLamassu(options = {}) {
  const moduleArg = {};
  if (options.wasmUrl) {
    moduleArg.locateFile = (path) =>
      path.endsWith(".wasm") ? options.wasmUrl : path;
  }
  if (typeof options.print === "function") {
    moduleArg.print = options.print;
    moduleArg.printErr = options.print;
  }

  const M = await createLamassuModule(moduleArg);
  const evalRaw = M.cwrap("jsvm_eval", "string", ["string"]);
  const resetRaw = M.cwrap("jsvm_reset", null, []);

  return {
    /**
     * Evaluate a chunk of source in the persistent REPL context. Top-level
     * `let`/`const`/`function` declarations carry across calls. Returns the
     * combined `print()` output followed by the completion value (prefixed
     * with "⇒ ") or an error line — never throws.
     * @param {string} source
     * @returns {string}
     */
    eval(source) {
      return evalRaw(String(source ?? ""));
    },

    /** Discard all REPL state and start from a fresh VM + context. */
    reset() {
      resetRaw();
    },

    /** The underlying Emscripten module, for advanced/low-level use. */
    module: M,
  };
}

export default createLamassu;
