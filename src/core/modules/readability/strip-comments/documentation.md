# Strip comments

A simple module to remove all comment from a script

## Example

<!-- An example including code showing your module in action -->

```js
/**
 * A Useless comment
 */
console.log("Hello, World!");
```

becomes

```js
console.log("Hello, World!");
```
## About

### Motivation

Comments in malware are often not useful.

### Targeted Nodes

- `enter` (all nodes)
