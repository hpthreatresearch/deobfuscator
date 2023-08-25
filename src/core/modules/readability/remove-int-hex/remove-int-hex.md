# Remove hex in ints

This module remove hexadecimal integers and replace hem with their base10 equivalent.

## Example

```js
0xdeadbeef; // -> 3735928559;
```

## About

### Motivation

This module has a very low impact on the code and exists because of personal preference.

### Limitations

Even though this module is low impact, it does not guarantee it will not break the obfuscated code.

Example, an [self defense]() tool that checks for `0x` in a function body.

### Targeted Nodes

- `SequenceExpression`
