# Constant folding

> Constant folding is the beating heart of this deobfuscator for more information feel free to check out [this great resource](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.130.3532)

Performs operations on literal values.

## Options

- `allowedEval` (string array, default `[]`): A list of function names who's evaluation is allowed.

- `forcedConstant` (string, default `#CONSTANT#`): A comment that can be added to a  variable declaration. This module will treat this variable as a constant regardless if it actually is.

## Example

```js
1 + 1;
```

becomes

```js
2;
```

## About

### Motivation

`eval` is an easy and common way to conceal code.

### Limitations

Without any allowed eval, this module should be safe. Be careful when allowing functions to be run that they are not redefined: Constant folding will not take that new definition into account.

### Targeted Nodes

- `VariableDeclarator`
- `LogicalExpression`
- `enter` (targets certain expressions)