// Shared timing helper for bench/*.js. Each benchmark calls run(name, iters,
// fn), which calls fn(iters) once to warm up (JIT-free here, but this also
// pays one-time allocation costs up front) and once timed, then prints a
// single result line the runner (`make bench`) greps for.
export function run(name, iters, fn) {
  fn(iters);
  const t0 = Date.now();
  fn(iters);
  const ms = Date.now() - t0;
  const opsPerSec = ms > 0 ? Math.round((iters / ms) * 1000) : Infinity;
  print(`${name}: ${iters} iters in ${ms}ms (${opsPerSec} ops/sec)`);
}
