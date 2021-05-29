import assert from "assert";
import versor from "../src/index.js";

function distance2 (a,b) {
  return a
    .map(function(x,i) { return (x - b[i]) * (x - b[i]); })
    .reduce(function(a,b) { return a + b; }, 0);
}

it("versor offers functions", () => {
  assert.strictEqual(typeof versor, 'function');
  assert.strictEqual(typeof versor.cartesian, 'function');
  assert.strictEqual(typeof versor.rotation, 'function');
  assert.strictEqual(typeof versor.delta, 'function');
});

it("90° versors", () => {
  assert(distance2(versor([ 90, 0, 0 ]), [ Math.sqrt(2)/2, Math.sqrt(2)/2, 0, 0 ]) < 1e-8);
  assert(distance2(versor([ -90, 0, 0 ]), [ Math.sqrt(2)/2, -Math.sqrt(2)/2, 0, 0 ]) < 1e-8);
  assert(distance2(versor([ 0, 90, 0 ]), [ Math.sqrt(2)/2, 0, Math.sqrt(2)/2, 0 ]) < 1e-8);
  assert(distance2(versor([ 0, -90, 0 ]), [ Math.sqrt(2)/2, 0, -Math.sqrt(2)/2, 0 ]) < 1e-8);
  assert(distance2(versor([ 0, 0, 90 ]), [ Math.sqrt(2)/2, 0, 0, Math.sqrt(2)/2 ]) < 1e-8);
  assert(distance2(versor([ 0, 0, -90 ]), [ Math.sqrt(2)/2, 0, 0, -Math.sqrt(2)/2 ]) < 1e-8);
});


it("delta for large angles https://github.com/Fil/versor/issues/8", function(){
  assert(distance2(versor.delta([0.5963903847916048, -0.48599667744373487, -0.6388471949079623], [0.2185627727412969, 0.8848373533648707, -0.4114525154399803]), [ 0.6939654197615048,
  0.45674413520077356,
  -0.07619840032229953,
  0.551353421067883 ]) < 1e-8);
});

it("delta", () => {
  let a = versor.cartesian([ 0, 0 ]), b = versor.cartesian([ 90, 0 ]);
  assert(distance2(versor.delta(a,b), [ 0.7071, 0.7071, 0, 0 ]) < 1e-8);
  b = versor.cartesian([ 0, 90 ]);
  assert(distance2(versor.delta(a,b), [ 0.7071, 0, 0.7071, 0 ]) < 1e-8);
  
  a = versor.cartesian([ 0, 0 ]), b = versor.cartesian([ 180, 0 ]);
  assert(distance2(versor.delta(a,b), [ 0, 1, 0, 0 ]) < 1e-8);
});

it("delta tweening", () => {
  const a = versor.cartesian([ 0, 0 ]), b = versor.cartesian([ 90, 0 ]);
  assert(distance2(versor.delta(a,b,0.5), [ 0.9239, 0.3827, 0, 0 ]) < 1e-8);
});
