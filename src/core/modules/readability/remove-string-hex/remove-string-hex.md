# Remove comma operator

This module removes hexadecimal and unicode escape sequences from string.

It does so using `JSON.stringify`;

## Example

```js
console.log("\x48\x65\x6c\x6c\x6f\x2c\x20\x57\x6f\x72\x6c\x64\x21");
// -> console.log("Hello, World!")
```

## About

### Motivation

This module has a very low impact on the code and exists because of personal preference.

### Limitations

Even though this module is low impact, it does not guarantee it will not break the obfuscated code.

### Targeted Nodes

- `StringLiteral`
- `DirectiveLiteral`
