# Remove proxy functions

This module considers a proxy function to be any function only containing a return statement. It will attempt to replace calls to such function with the return expression. By default, it will also remove the function if it is no longer referenced after these changes.

## Options

- `Keep` (boolean, default `false`): Keeps all the proxy functions after the transformation even if a function is no longer referenced.

- `Ignore` (string, default `[#NOT PROXY#]`): Functions containing this string as as a leading comment in their declaration will not be treated as proxies

## Example

```js
// This is considered a proxy function
function add(x, y) {
  return x + foo(y);
}

/*[#NOT PROXY#]*/ function proxy(x, y) {
  // This is not
  return x + y;
}

function subtract(x, y) {
  // Nor is this
  z = x - y;
  return z;
}

add(1, 2); // -> 1 + foo(2);
add(bar(), z); // -> bar() + foo(z);
subtract(1, 2); // -> subtract(1, 2);
```

## About

### Motivation

Removing proxy functions can help advance [Constant Folding]().

### Limitations

TODO:
Currently does not handle recursion properly.

### Targeted Nodes

- `FunctionDeclaration`
