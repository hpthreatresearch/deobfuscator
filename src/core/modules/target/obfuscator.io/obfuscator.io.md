# Obfuscator.io RC4

> A free and efficient obfuscator for JavaScript (including support of ES2022). Make your code harder to copy and prevent people from stealing your work.
> [obfuscator.io](https://www.obfuscator.io/)

This module separates attempts to extract the RC4 encoded from a program obfuscated using [obfuscator.io](https://www.obfuscator.io/).

## Recognizing obfuscator.io

You can attempt to look for long encoded string tables:

```js
const _0x2f77ff = [
  "fq7dMCoEmG",
  "iSkiW6m",
  "W4PbW4SpW6m",
  "dgJdGmkKWQi",
  "kmkhW6JdPa",
  ...,
];
```

An other distinctive feature is the rotation function, it has a long condition check with many `parseInt` calls:

```js
parseInt(_0x160b12(0x6f, "2D5v", 0x31, 0x18f, 0x1ad)) /
  (-0x172d + 0x1 * 0x1a8d + -0x1 * 0x35f) +
  -parseInt(_0x160b12(0x105, "KJnV", 0x15c, 0xa1, 0x117)) /
    (-0x3 * 0x2ab + 0x10b2 + -0x8af) +
  parseInt(_0x2dbb75(-0x4b, "kc4g", -0x7f, -0x54, 0x82)) /
    (0x4 * -0x5e + -0x2f9 * -0x2 + -0x477) +
  (parseInt(_0x3175f5(-0x15a, "z9@h", -0x1ad, -0x1e6, -0xa8)) /
    (0x4a4 + -0x19ba + -0x2 * -0xa8d)) *
    (parseInt(_0x160b12(-0x24, "0I(U", 0x11, -0x132, 0x1a)) /
      (-0x2310 + 0x15f8 + 0xd1d));
```

Finally, you can spot an `atob` function (notice the alphabet and call to `decodeURIComponent`):

```js
var _0x2e32c3=function(_0x4a90ab){const _0x503c71='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1e02e5='',_0x321c5d='',_0x104680=_0x1e02e5+_0x2e32c3;for(let _0x1baa1d=0xcd3+0x2669+-0x6*0x88a,_0x260741,_0x517378,_0x101cf7=-0x208+-0x681+0x889;_0x517378=_0x4a90ab['charAt'](_0x101cf7++);~_0x517378&&(_0x260741=_0x1baa1d%(-0x1b72+0x1fd9+-0x463)?_0x260741*(-0x3*0x728+-0xb84+0x213c)+_0x517378:_0x517378,_0x1baa1d++%(0x1cf3+-0x1d63+-0x4*-0x1d))?_0x1e02e5+=_0x104680['charCodeAt'](_0x101cf7+(0x1521*0x1+-0x4f*0x14+0x43*-0x39))-(-0x1*0x22b5+-0xbe1+0x2ea0)!==-0x1*-0x1bb7+0x2023+-0x3bda?String['fromCharCode'](-0x213b+-0xdd+0x2317*0x1&_0x260741>>(-(0x97*-0x17+-0x35*-0x5b+-0x544)*_0x1baa1d&0x16a+0x1*0x10a3+0xd*-0x163)):_0x1baa1d:-0x2516+0x137*-0x1f+0x4abf){_0x517378=_0x503c71['indexOf'](_0x517378);}for(let _0x3bf47c=0x635+0x18a0+-0x1ed5,_0x1ae1c2=_0x1e02e5['length'];_0x3bf47c<_0x1ae1c2;_0x3bf47c++){_0x321c5d+='%'+('00'+_0x1e02e5['charCodeAt'](_0x3bf47c)['toString'](0x1c07+-0x16aa+0x17*-0x3b))['slice'](-(-0x34a*-0x1+0x10a4+0x64*-0x33));}return decodeURIComponent(_0x321c5d);}
```

## Example

_Would both not fit and not be pertinent_

## About

### Motivation

This module is built for specific deobfuscation tasks, it might be quickly deprecated but should give you a good idea of how to write a similar module.

### Limitations

Nothing is guaranteed, at best this works. It is also quite slow

### Targeted Nodes

- `FunctionDeclaration`