# Remove member access

> This module should not be used as is and needs to be rewritten

This module replaces computed member access with dot notation.

## Example

```js
foo["bar"]; // -> foo.bar;
```

## About

### Motivation

This module _should_ have a very low impact on the code and exists because of personal preference.

### Limitations

This module needs to be carefully rewritten, currently it can cause errors and break the obfuscated code:

```js
var a = {};
a["1"] = "🕐"; // -> a.1 = "🕐";
console.log(a["1"]); // -> console.log(a.1);
```

### Targeted Nodes

- `MemberExpression`
