# Inline eval

Replaces `eval` calls with code. Only works when `eval` is called as a statement.

## Example

```js
eval('console.log(foo())');
1 + eval("3"); // Will not be replaced
```

becomes

```js
console.log(foo());
1 + eval("3"); // Will not be replaced
```

## About

### Motivation

`eval` is an easy and common way to conceal code.

### Limitations

This only works on expression statements, and it is not guaranteed that the generated code will have the same behavior.

Eval has a very complicated evaluation; this module oversimplifies a lot.

For example:

- no return value
- no custom variable environment

Feel free to check out the [ECMA docs](https://262.ecma-international.org/#sec-eval-x)

### Targeted Nodes

- `ExpressionStatement`
