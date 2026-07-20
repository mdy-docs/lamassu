# Deviations from real JS

lamassu-js aims to match Node closely enough for differential testing over
the shared subset — not full spec conformance. This page tracks every place
that's known to differ, so you're not surprised by one in production.

## Objects

- **`Object` is not callable.** `Object()` and `new Object()` throw
  `TypeError: value is not a function` / `not a constructor`. Use an object
  literal (`{}`) instead. (Every other built-in constructor — `Array`,
  `String`, `Number`, `Boolean`, `Date`, `Map`, `Set`, `RegExp`, `Promise`
  — is callable.)
- **Key order follows hash order, not insertion order.** Affects
  `Object.keys`/`values`/`entries`, `for...of` over `Object.entries(...)`,
  and `JSON.stringify` of plain objects. (Planned to resolve once the
  engine's property storage moves to hidden-class "shapes," which store
  properties in insertion order — see the roadmap in the project's
  `docs/plan.md`.)
- **`Object.freeze` returns the object but does not enforce immutability.**
  Property writes on a "frozen" object still succeed.

## Arrays

- **No holes.** Array storage is a flat vector, not a sparse structure —
  every index up to `.length` is a real, materialized slot. `Array(n)` and
  `arr.length = n` both throw `RangeError` past a fixed growth cap rather
  than eagerly allocating an attacker-chosen size; see
  [Built-ins → Array](/guide/builtins#array).
- **`Array.prototype.sort` is a stable O(n²) binary insertion sort** —
  fine for templating-sized arrays; revisit if you're sorting something
  large.
- **`Array.from` supports strings and arrays**, not arbitrary array-likes
  or iterators.

## Numbers

- **Transcendental `Math` functions are ~1e-12 accurate**, not correctly
  rounded — a custom freestanding kernel, no libm.
  `sqrt`/`floor`/`ceil`/`trunc`/`round` are exact (native ops).
- **Number-to-string formatting is exact for safe integers and for
  magnitudes within ~1e±22**; extreme magnitudes may differ from Node in
  the last digit (shortest-round-trip via float scaling, not a full
  big-integer `dtoa`).

## Strings

**Case mapping (`toUpperCase`/`toLowerCase`) is ASCII-only** — no full
Unicode case folding.

## Regular expressions

`String.prototype.matchAll` returns a plain array rather than a lazy
iterator (`for...of` over the result behaves the same either way).
`String.prototype.split` ignores its `limit` argument.

## Promises & async

- **`Promise(executor)` is callable without `new`** — a deliberate
  accommodation, alongside real `new`/constructor-function support and
  prototype chains for everything else.
- **Unhandled promise rejections are silent.** The engine tracks a
  `handled` flag internally but doesn't report unhandled rejections; a host
  hook could be added by an embedder that needs one.
- **A pending top-level-await module** returns from the host's run call
  still pending — see [Async & host calls](/guide/async#top-level-await).

## Modules

- **Cross-module cycles degrade to `undefined`** for a binding read before
  the exporting module has initialized it, rather than throwing a
  real-JS-style TDZ error. Hoisted `export function` declarations are
  available throughout, so mutually recursive function modules work fine —
  this only bites a cyclic read of a `let`/`const` binding before its
  module finishes evaluating.
- **Named and `export *` re-exports are snapshots**, taken once the source
  module finishes evaluating (dependency order guarantees this has already
  happened). A later mutation of a re-exported *mutable* binding isn't
  observed through the re-export. `export * as ns from` is live by
  reference instead (it aliases the source's namespace object). For a
  templating workload this is exact in practice, since re-exports are
  almost always functions or constants.
- **Module evaluation drains the whole microtask queue** after each module
  body runs — there's no cross-module async evaluation ordering beyond
  plain dependency order.

## Not a deviation, but easy to trip on

`for...in`, `var`, classes, `eval`, the `Function` constructor, `Reflect`,
`Proxy`, `Symbol`, generators, typed arrays, and `Intl` aren't "different,"
they're **absent** — see [Supported syntax](/guide/language) for the full
list of non-goals.
