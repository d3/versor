import assert from "node:assert";
import {it} from "vitest";
import versor from "../src/index.js";
import {version} from "../package.json";

function distance2 (a: readonly number[], b: readonly number[]): number {
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

it("versor.version is the package version", () => {
  assert.strictEqual(versor.version, version);
  assert.match(versor.version, /^\d+\.\d+\.\d+/);
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

// q and -q represent the same rotation
function rotationDistance2(a: readonly number[], b: readonly number[]): number {
  return Math.min(distance2(a, b), distance2(a, b.map(x => -x)));
}

it("rotation returns angles for the same rotation, including at the poles https://github.com/d3/versor/issues/11", () => {
  for (const p of [90, 90 - 1e-12, 90 - 1e-9, 90 - 1e-6, 89, 45, 0, -45, -89, -90 + 1e-6, -90 + 1e-9, -90 + 1e-12, -90]) {
    for (let l = -180; l < 180; l += 7.5) {
      for (const g of [-151.3, -28.0005, 0, 1e-9, 28.0005, 90, 179]) {
        const q = versor([l, p, g]);
        assert(rotationDistance2(versor(versor.rotation(q)), q) < 1e-24, `[${l}, ${p}, ${g}]`);
      }
    }
  }
});

it("rotation returns γ = 0 at the poles", () => {
  for (const p of [90, -90]) {
    for (const l of [-180, -135, -28.0005, 0, 28.0005, 90, 179.9]) {
      const r = versor.rotation(versor([l, p]));
      assert(distance2(r, [l, p, 0]) < 1e-20 || distance2(r, [l + 360, p, 0]) < 1e-20, `[${l}, ${p}] → [${r}]`);
    }
  }
  assert(distance2(versor.rotation(versor([28, 90, -28])), [56, 90, 0]) < 1e-20);
  assert(distance2(versor.rotation(versor([-28, -90, 28])), [0, -90, 0]) < 1e-20);
});

it("rotation matches the previous formula away from the poles", () => {
  for (let p = -85; p <= 85; p += 5) {
    for (let l = -175; l < 180; l += 10) {
      for (const g of [-150, -28, 0, 28, 150]) {
        assert(distance2(versor.rotation(versor([l, p, g])), [l, p, g]) < 1e-20, `[${l}, ${p}, ${g}]`);
      }
    }
  }
});

it("spinning around a pole does not drift https://github.com/d3/d3-geo/issues/194", () => {
  const spin = versor([0.5, 0, 0]);
  for (const p of [90, -90]) {
    let r: [number, number, number] = [0, p, 0], q = versor(r);
    for (let i = 0; i < 720; i++) {
      r = versor.rotation(versor.multiply(versor(r), spin));
      q = versor.multiply(q, spin);
      assert(rotationDistance2(versor(r), q) < 1e-24, `step ${i} at ${p}`);
    }
    assert(distance2(r, [0, p, 0]) < 1e-20);
  }
});
