const acos = Math.acos,
    asin = Math.asin,
    atan2 = Math.atan2,
    cos = Math.cos,
    hypot = Math.hypot,
    max = Math.max,
    min = Math.min,
    PI = Math.PI,
    sin = Math.sin,
    radians = PI / 180,
    degrees = 180 / PI;

class Versor {
  static fromCartesian([x, y, z]) {
    return [0, z, -y, x];
  }
  static fromAngles([l, p, g]) {
    l *= radians / 2;
    p *= radians / 2;
    g = (g||0) * radians / 2;
    const sl = sin(l), cl = cos(l);
    const sp = sin(p), cp = cos(p);
    const sg = sin(g), cg = cos(g);
    return [
      cl * cp * cg + sl * sp * sg,
      sl * cp * cg - cl * sp * sg,
      cl * sp * cg + sl * cp * sg,
      cl * cp * sg - sl * sp * cg
    ];
  }
  static toAngles([a, b, c, d]) {
    return [
      atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * degrees,
      asin(max(-1, min(1, 2 * (a * c - d * b)))) * degrees,
      atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * degrees
    ];
  }
  static interpolateAngles(a, b) {
    const i = Versor.interpolate(Versor.fromAngles(a), Versor.fromAngles(b));
    return t => Versor.toAngles(i(t));
  }
  static interpolateLinear([a1, b1, c1, d1], [a2, b2, c2, d2]) {
    a2 -= a1, b2 -= b1, c2 -= c1, d2 -= d1;
    const x = new Array(4);
    return t => {
      const l = hypot(x[0] = a1 + a2 * t, x[1] = b1 + b2 * t, x[2] = c1 + c2 * t, x[3] = d1 + d2 * t);
      x[0] /= l, x[1] /= l, x[2] /= l, x[3] /= l;
      return x;
    };
  }
  static interpolate([a1, b1, c1, d1], [a2, b2, c2, d2]) {
    let dot = Versor.dot([a1, b1, c1, d1], [a2, b2, c2, d2]);
    if (dot < 0) a2 = -a2, b2 = -b2, c2 = -c2, d2 = -d2, dot = -dot;
    if (dot > 0.9995) return Versor.interpolateLinear([a1, b1, c1, d1], [a2, b2, c2, d2]); 
    const theta0 = acos(max(-1, min(1, dot)));
    const x = new Array(4);
    const l = hypot(a2 -= a1 * dot, b2 -= b1 * dot, c2 -= c1 * dot, d2 -= d1 * dot);
    a2 /= l, b2 /= l, c2 /= l, d2 /= l;
    return t => {
      const theta = theta0 * t;
      const s = sin(theta);
      const c = cos(theta);
      x[0] = a1 * c + a2 * s;
      x[1] = b1 * c + b2 * s;
      x[2] = c1 * c + c2 * s;
      x[3] = d1 * c + d2 * s;
      return x;
    };
  }
  static dot([a1, b1, c1, d1], [a2, b2, c2, d2]) {
    return a1 * a2 + b1 * b2 + c1 * c2 + d1 * d2;
  }
  static multiply([a1, b1, c1, d1], [a2, b2, c2, d2]) {
    return [
      a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
      a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
      a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
      a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2
    ];
  }
}

/*
 * Old API
 */

// Returns the unit quaternion for the given Euler rotation angles [λ, φ, γ].
const versor = Versor.fromAngles;

// Returns the quaternion that represents q0 * q1.
versor.multiply = Versor.multiply;

// Returns the Euler rotation angles [λ, φ, γ] for the given quaternion.
versor.rotation = Versor.toAngles;

// interpolate angles
versor.interpolate = Versor.interpolateAngles;

// Returns Cartesian coordinates [x, y, z] given spherical coordinates [λ, φ].
versor.cartesian = function(e) {
  const l = e[0] * radians, p = e[1] * radians, cp = cos(p);
  return [cp * cos(l), cp * sin(l), sin(p)];
};

// Returns the quaternion to rotate between two cartesian points on the sphere.
// alpha for tweening [0,1]
// see https://github.com/Fil/versor/issues/8
versor.delta = function(v0, v1, alpha) {
  if (arguments.length == 2) alpha = 1;

  const sqrt = Math.sqrt;
  function cross(v0, v1) {
    return  [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
  }
  function dot(v0, v1) {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  }

  const w = cross(v0, v1), l = sqrt(dot(w, w));
  if (!l) return [1, 0, 0, 0];
  const t = alpha * acos(max(-1, min(1, dot(v0, v1)))) / 2, s = sin(t); // t = θ / 2
  return [cos(t), w[2] / l * s, -w[1] / l * s, w[0] / l * s];
};

export default versor;