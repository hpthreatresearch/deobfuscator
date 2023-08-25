# Remove dead branches

This function attempts to remove dead branches. This module will attempt to keep the structure of the code: the `if`, `while` statements are not removed the blocks are simply emptied. 

## Example

```js
if (false) {
  foo();
} else {
  bar();
}
```

becomes

```js
if (false) {} else {
  bar();
}
```

## About

This module only works with boolean literals, it often needs to be paired with constant folding.

This module handles

- `if(true)` and `if(false)` statements 

- `while(false)` statements

- `true?...:...` and `false?...:...` conditional expressions

### Motivation

This module can be useful to help make code more readable.

### Limitations

On its own, this module should be safe. However, when paired with other modules it can remove code that is relevant if the other modules committed a mistake.

### Targeted Nodes

- `IfStatement`

- `ConditionalExpression`

- `WhileStatement`
