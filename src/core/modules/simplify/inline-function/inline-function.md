# Inline Function

Inline calls to the `Function` constructor.

## Example

```js
Function("foo(); return bar;");
```

becomes

```js

(function () {
  foo();
  return bar;
});

```

## About

### Motivation

Make the code more legible and allow for constant folding and other operations;

### Limitations

If you are reading this, you should Probably, should check the relevant [ECMAScript docs](https://262.ecma-international.org/#sec-createdynamicfunction):

```js
(function anonymous(){
  console.log(`function name: ${arguments.callee.name}`);
  console.log(anonymous.toString());
})();
// -> function name: anonymous      function anonymous(){...}


Function(
    "console.log(`function name: ${arguments.callee.name}`);" +
    "console.log(anonymous.toString());"
)();
// -> function name: anonymous      ReferenceError: anonymous is not defined
```

### Targeted Nodes

- `CallExpression`
