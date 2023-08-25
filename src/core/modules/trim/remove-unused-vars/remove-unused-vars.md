# Remove unused variables

This function attempts to remove unused variables and functions

## Options

- `Ignore` (string, default `[#NOT UNUSED#]`): Variables and functions containing this string as a leading comment in their declaration will not be treated as unused variables

## Example

```js
var foo = '🍎';
var bar = '🍌';
console.log(bar);
```

becomes

```js
var bar = '🍌';
console.log(bar);
```

## About

### Motivation

This module can be useful to help make code more readable.

### Limitations

`eval`, and strings in general. A variable might be called later in the code, but this module does not notice it.

```js
var foo = "🍎";
eval("console.log(foo)");
```

### Targeted Nodes

- `VariableDeclarator`

- `FunctionDeclaration`
