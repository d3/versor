# Versor

Rotate the globe with the mouse.

The naïve method uses `mouse.x` and `mouse.y` as proxies for longitude and latitude. It works when the rotation is small, but try to put the globe "upside-down" and suddenly moving the mouse to the left rotates the globe to the right, and vice versa.

The correct solution is to track the spherical coordinates of the point that is under the mouse, and apply a rotation to the globe that will move the initial point to the current mouse position. Computing that rotation involves quaternions.

This method, introduced by [Jason Davies](https://www.jasondavies.com/maps/rotate/) and Mike Bostock, is called [versor dragging](https://gist.github.com/mbostock/7ea1dde508cec6d2d95306f92642bc42).

This module contains the quaternion & versor functions. For a directly usable package, see [d3-inertia](https://github.com/Fil/d3-inertia).


In Node:

```js
var versor = require("versor");

versor([90,0,0]); // [0.7071068, 0.7071068, 0, 0]

var v0 = versor([ 0, 0, 0 ]), v1 = versor([ 90, 0, 0 ]);

// quaternion to rotate between v0 and v1
versor.delta(v0, v1); // [0.923879, 0.3826834, 0, 0]

// tweening: quaternion to rotate halfway between v0 and v1
versor.delta(v0, v1, 0.5); // [0.980785, 0.19509, 0, 0]


```

In a browser:

```html
<!DOCTYPE html>
<script src="https://unpkg.com/versor"></script>
<script>

versor([90,0,0]);

</script>
```
