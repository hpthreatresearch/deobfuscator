# Remove comma operator

> The **comma (`,`)** operator evaluates each of its operands (from left to right) and returns the value of the last operand.
> [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator)

This module separates `SequenceExpression`s contained in `ExpressionStatement`s.

## Example

```js
foo(), bar(); // -> foo(); bar();
```

## About

### Motivation

This module has a very low impact on the code and exists because of personal preference.

### Limitations

Even though this module is low impact, it does not guarantee it will not break the obfuscated code.

Example, an [self defense]() tool that checks for commas in a function body.

### Targeted Nodes

- `SequenceExpression`
