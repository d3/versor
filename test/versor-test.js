var tape = require("tape");
var versor = require("../");

function distance2 (a,b) {
  return a
    .map(function(x,i) { return (x - b[i]) * (x - b[i]); })
    .reduce(function(a,b) { return a + b; }, 0);
}

tape("versor offers functions", function(test) {
  test.equal(typeof versor, 'function');
  test.equal(typeof versor.cartesian, 'function');
  test.equal(typeof versor.rotation, 'function');
  test.equal(typeof versor.delta, 'function');
  test.end();
});

tape("90° versors", function(test) {
  test.ok(distance2(versor([ 90, 0, 0 ]), [ Math.sqrt(2)/2, Math.sqrt(2)/2, 0, 0 ]) < 1e-8);
  test.ok(distance2(versor([ -90, 0, 0 ]), [ Math.sqrt(2)/2, -Math.sqrt(2)/2, 0, 0 ]) < 1e-8);
  test.ok(distance2(versor([ 0, 90, 0 ]), [ Math.sqrt(2)/2, 0, Math.sqrt(2)/2, 0 ]) < 1e-8);
  test.ok(distance2(versor([ 0, -90, 0 ]), [ Math.sqrt(2)/2, 0, -Math.sqrt(2)/2, 0 ]) < 1e-8);
  test.ok(distance2(versor([ 0, 0, 90 ]), [ Math.sqrt(2)/2, 0, 0, Math.sqrt(2)/2 ]) < 1e-8);
  test.ok(distance2(versor([ 0, 0, -90 ]), [ Math.sqrt(2)/2, 0, 0, -Math.sqrt(2)/2 ]) < 1e-8);
  test.end();
});

tape("delta", function(test) {
  var v0 = versor([ 0, 0, 0 ]), v1 = versor([ 90, 0, 0 ]);
  test.ok(distance2(versor.delta(v0,v1), [ 0.92388, 0.38268, 0, 0 ]) < 1e-8);
  test.end();
});

tape("delta tweening", function(test) {
  var v0 = versor([ 0, 0, 0 ]), v1 = versor([ 90, 0, 0 ]);
  test.ok(distance2(versor.delta(v0,v1,0.5), [ 0.98078, 0.19509, 0, 0 ]) < 1e-8);
  test.end();
});
