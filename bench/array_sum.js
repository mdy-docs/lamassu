// Dense array indexed access — the one property-storage case that's already
// a flat vector, not the hash table (see "Property storage": arr[i] is
// spec-wise a named property but is deliberately split out). A stable
// baseline that shapes/ICs work shouldn't move much; useful for noticing an
// unrelated regression in the same benchmark run.
import { run } from "./_util.js";

const N = 10000;
const arr = [];
for (let i = 0; i < N; i++) arr.push(i);

run("array_sum", 500, (iters) => {
  let sum = 0;
  for (let pass = 0; pass < iters; pass++) {
    for (let i = 0; i < N; i++) {
      sum += arr[i];
    }
  }
  return sum;
});
