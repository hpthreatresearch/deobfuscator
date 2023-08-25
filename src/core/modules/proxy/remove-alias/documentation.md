# Remove alias

Removes alias

## Options

- TODO:

## Example

```js
var a = foo();

var b = a;

bar(b); // <- replace with bar(a)
```

## About

### Motivation

Remove aliases for proxies.

### Limitations

This module could replace variables that are not aliases. It can also remove variables that get called in evals.

### Targeted Nodes

<!-- What nodes does your visitor target ? -->

- _TODO_
- _TODO_
