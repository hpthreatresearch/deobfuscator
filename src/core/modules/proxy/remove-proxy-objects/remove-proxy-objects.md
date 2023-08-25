# Remove proxy object

This module considers a proxy function to be any constant object (known limitation). It will attempt to replace member accesses to such objects with the property's value. By default, it will also remove the object if it is no longer referenced after these changes.

It will also attempt to incorporate any changes that happen just after an object's declaration into its declaration :

```js
const obj = {
  apple: "🍎",
};
obj.banana = "🍌";
```

becomes:

```js
const obj = {
  apple: "🍎",
  banana: "🍌",
};
```

## Options

- `Keep` (boolean, default `false`): Keeps the proxy object after the transformation even if it is no longer referenced.

- `Ignore` (string, default `[#NOT PROXY#]`): Objects containing this string as a leading comment in their declaration will not be treated as proxies

## Example

```js
// This is considered a proxy function
function add(x, y) {
  return x + foo(y);
}

// This is not
function subtract(x, y) {
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

#### Alias

Aliases are not currently handled:

```js
const clearly_a_proxy = {
  // -> recognized as a proxy object
  one: 1,
};

const alias = clearly_a_proxy; // -> Not recognized as a proxy

console.log(alias.one + 1); // -> cannot be replaced
```

The proper way of handling this would be to use [SSA](https://en.wikipedia.org/wiki/Static_single-assignment_form).

#### Mutations

Objects are mutable objects, even if the object is constant, it's properties might not be.

This can lead to the module changing the outcome of the code.

```js
const not_a_proxy = {
  // -> recognized as a proxy object
  one: 2,
};

console.log(not_a_proxy.one);

not_a_proxy.one = 3; // not_a_proxy is still constant !

console.log(not_a_proxy.one); // -> would be replaced with console.log(2) !

function foo(obj) {
  obj.one = 1;
}

foo(not_a_proxy);

console.log(not_a_proxy.one); // -> would be replaced with console.log(2) !
```

### Targeted Nodes

- `VariableDeclarator`
