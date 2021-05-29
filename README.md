# Versor

Rotate the globe with the mouse.

The naïve method uses `mouse.x` and `mouse.y` as proxies for longitude and latitude. It works when the rotation is small, but try to put the globe "upside-down" and suddenly moving the mouse to the left rotates the globe to the right, and vice versa.

The correct solution is to track the spherical coordinates of the point that is under the mouse, and apply a rotation to the globe that will move the initial point to the current mouse position. Computing that rotation involves quaternions.

This method, introduced by [Jason Davies](https://www.jasondavies.com/maps/rotate/) and Mike Bostock, is called [versor dragging](https://gist.github.com/mbostock/7ea1dde508cec6d2d95306f92642bc42).

This module contains the quaternion & versor functions. For a directly usable package, see [d3-inertia](https://github.com/Fil/d3-inertia).


In Node:

```js
const versor = require("versor");

// interpolate angles (slerp), see https://observablehq.com/@d3/world-tour
versor.interpolate(rotation0, rotation1); // function of (t)

// quaternion to rotate between p0 and p1, see d3-inertia
const p0 = [0, 0],
    p1 = [90, 0],
    c0 = versor.cartesian(p0),
    c1 = versor.cartesian(p1);
versor.delta(c0, c1); // [0.7071, 0.7071, 0, 0]

// tweening: quaternion to rotate halfway between p0 and p1
versor.delta(c0, c1, 0.5); // [0.9239, 0.3827, 0, 0]


// utilities

// get cartesian coordinates [x, y, z] given spherical coordinates [λ, φ].
versor.cartesian = function(e) {
  var l = e[0] * radians, p = e[1] * radians, cp = cos(p);
  return [cp * cos(l), cp * sin(l), sin(p)];
};

// create a quaternion from Euler angles
const q0 = versor([90,0,0]); // [0.7071068, 0.7071068, 0, 0]
const q1 = versor([0,90,0]); // [0.7071068, 0, 0.7071068, 0]

// the quaternion that represents q0 * q1.
q01 = versor.multiply(q0, q1); // [0.5, 0.5, 0.5, 0.5]

// Euler rotation angles [λ, φ, γ] for the given quaternion.
versor.rotation(q01); // [90, 0, 90]



```

If you use npm, `npm install versor`. You can also download the [latest release on GitHub](https://github.com/d3/versor/releases/latest). For vanilla HTML in modern browsers, import versor from Skypack:

```html
<script type="module">
  import versor from "https://cdn.skypack.dev/versor@0.2";
  const t = versor([90,0,0]);
</script>
```

For legacy environments, you can load versor’s UMD bundle from an npm-based CDN such as jsDelivr; a `versor` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/versor@0.2"></script>
<script>
  
versor([90,0,0]);

</script>
```
