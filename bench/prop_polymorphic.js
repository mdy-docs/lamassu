// Same total property reads as prop_monomorphic.js, but spread across
// objects with four distinct shapes (different insertion order / extra
// keys), so no single (shape, slot) inline cache could stay hot at one call
// site — the worst case for tier-3 ICs, and a check that the hash-map
// baseline (tier 1) doesn't regress disproportionately if/when tier 3 lands.
import { run } from "./_util.js";

function makeShapeA(i) { return { x: i, y: i + 1 }; }
function makeShapeB(i) { return { y: i + 1, x: i }; }
function makeShapeC(i) { return { x: i, y: i + 1, z: 0 }; }
function makeShapeD(i) { const o = { w: 0 }; o.x = i; o.y = i + 1; return o; }
const makers = [makeShapeA, makeShapeB, makeShapeC, makeShapeD];

run("prop_polymorphic", 2000000, (iters) => {
  let sum = 0;
  for (let i = 0; i < iters; i++) {
    const obj = makers[i % 4](i);
    sum += obj.x + obj.y;
  }
  return sum;
});
