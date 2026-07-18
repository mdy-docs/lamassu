# @mdy-docs/lamassu-js

A strict, safe **JavaScript-subset engine written in C and compiled to
WebAssembly**. It runs untrusted scripts in a sandbox with bounded CPU (fuel),
bounded memory, and no ambient host access — designed for evaluating
user-provided templates. The package ships the compiled `.wasm` plus a small
typed ESM wrapper.

> Strict-mode-only, ES-module-aware subset: `let`/`const` (no `var`),
> arrow/async functions, template literals, destructuring, classes-free objects,
> `try/catch`, promises, `import`/`export`, and ECMAScript `RegExp`. See the
> [project README](https://github.com/mdy-docs/lamassu-js) for the full language
> scope and the safety model.

## Install

```sh
npm install @mdy-docs/lamassu-js
```

## Usage

### With a bundler (Vite, webpack, …)

Import the wasm as a URL asset and hand it to the factory:

```js
import { createLamassu } from "@mdy-docs/lamassu-js";
import wasmUrl from "@mdy-docs/lamassu-js/lamassu.wasm?url"; // Vite

const engine = await createLamassu({ wasmUrl });

console.log(engine.eval("const x = 40; x + 2;")); // "⇒ 42"
console.log(engine.eval("print('hi'); x * 10;")); // "hi\n⇒ 420"  (state persists)
engine.reset();                                    // fresh VM
```

### Native ESM (Node, Deno, `<script type="module">`)

No bundler: the sibling `.wasm` is located automatically via `import.meta.url`.

```js
import { createLamassu } from "@mdy-docs/lamassu-js";

const engine = await createLamassu();
console.log(engine.eval("[1,2,3].map(n => n*n).join(',');")); // "⇒ 1,4,9"
```

## API

### `createLamassu(options?) → Promise<Lamassu>`

| option    | type                       | notes                                                            |
| --------- | -------------------------- | ---------------------------------------------------------------- |
| `wasmUrl` | `string`                   | Explicit `lamassu.wasm` URL. Required under a bundler.            |
| `print`   | `(text: string) => void`   | Sink for the engine's internal stdout (script output is returned by `eval`). |

### `Lamassu`

- **`eval(source: string): string`** — evaluate source in the persistent REPL
  context. Top-level `let`/`const`/`function` declarations carry across calls.
  Returns the combined `print()` output followed by the completion value
  (prefixed with `⇒ `) or an error line. Never throws.
- **`reset(): void`** — discard all REPL state; start from a fresh VM + context.
- **`module`** — the underlying Emscripten module, for advanced use.

## Safety

Each engine instance is an isolated VM: no filesystem, network, `eval`, or
`Function` constructor, and no access to the host beyond what you expose.
Regular-expression evaluation is guarded by a step budget (catastrophic
backtracking throws a catchable `RangeError` instead of hanging). For hard CPU
and memory ceilings, wrap the instance in your own timeout/worker as needed.

## License

MIT © Daniel Walton
