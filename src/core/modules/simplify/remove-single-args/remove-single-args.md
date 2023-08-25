# Remove single args

This module affects functions that only get called once. It will attempt to replace the arguments of those functions with the values with which they are called.

The arguments in the function definition are kept.

## Options

- `Replace all` (boolean, default `false`): Replaces all the arguments, including those that aren't literals. This can lead to scope issues.

- `Ignore` (string, default `[#NOT SINGLE USE#]`): Functions containing this string as a leading comment in their declaration will not be treated as functions with called only once

## Example

```js
function foo(bar) {
  console.log(bar);
}
foo("🍎");
```

becomes 

```js
function foo(bar) {
  console.log("🍎");
}
foo("🍎");
```

## About

### Motivation

This module can be useful to help improve [Constant folding]()

### Limitations

The function can always access it's arguments through `arguments` leading to unhandled behaviors

### Targeted Nodes

- `Function`
