// Prototype-chain method lookup + call: a property read that misses the
// instance's own table and falls through to Ctor.prototype (see "Property
// storage" — array/object instances carry a real proto field), then a call.
// Constructor functions + prototypes, not classes (classes are a non-goal).
import { run } from "./_util.js";

function Vec(x, y) {
  this.x = x;
  this.y = y;
}
Vec.prototype.lengthSq = function () {
  return this.x * this.x + this.y * this.y;
};

const v = new Vec(3, 4);

run("method_calls", 2000000, (iters) => {
  let sum = 0;
  for (let i = 0; i < iters; i++) {
    sum += v.lengthSq();
  }
  return sum;
});
