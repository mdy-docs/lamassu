/*
 * CI smoke test: load the freshly built package artifact and confirm the
 * engine actually instantiates and evaluates before we publish it. Run from
 * the repo root after `make pkg` (Node ESM locates the sibling .wasm via
 * import.meta.url — no bundler needed).
 */
import { createLamassu } from "../../packages/lamassu-js/index.js";

const engine = await createLamassu();

function check(label, actual, expected) {
  if (actual !== expected) {
    console.error(`FAIL ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
    process.exitCode = 1;
  } else {
    console.log(`ok  ${label}`);
  }
}

check("arithmetic", engine.eval("const x = 40; x + 2;"), "⇒ 42");
check("persistent state", engine.eval("print('hi'); x * 10;"), "hi\n⇒ 400");
check("regex", engine.eval("'a1b2'.match(/\\d/g).join(',');"), "⇒ 1,2");
check("closures", engine.eval("const f = (() => { let n = 0; return () => ++n; })(); f(); f(); f();"), "⇒ 3");
check(
  "ReDoS step budget",
  engine.eval("/(a+)+$/.test('a'.repeat(200) + 'b');"),
  "Uncaught RangeError: regular expression step budget exhausted",
);
engine.reset();
check("reset clears state", engine.eval("typeof x;"), "⇒ undefined");

if (process.exitCode) {
  console.error("\nsmoke test FAILED");
} else {
  console.log("\nall smoke checks passed");
}
