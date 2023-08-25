# Separate declarators

This module separates variable declarators contained in blocks.

## Example

```js
var foo = 1, // -> var foo = 1;
  bar = 2; // -> var bar = 2;
```

## About

### Motivation

This module has a very low impact on the code and exists because of personal preference.

### Limitations

Even though this module is low impact, it does not guarantee it will not break the obfuscated code.

Example, an [self defense]() tool that checks for commas in a function body.

### Targeted Nodes

- `VariableDeclaration`
