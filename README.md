# Versor

In Node:

```js
var versor = require("versor");

versor([90,0,0]);

var v0 = versor([ 0, 0, 0 ]), v1 = versor([ 90, 0, 0 ]);

// quaternion to rotate between v0 and v1
versor.delta(v0, v1);

// tweening: quaternion to rotate halfway between v0 and v1
versor.delta(v0, v1, 0.5);


```

In a browser:

```html
<!DOCTYPE html>
<script src="https://unpkg.com/versor"></script>
<script>

versor([90,0,0]);

</script>
```
