# filter2

[![Build Status][travis-badge]][travis-url]
[![NPM version][npm-badge]][npm-package]
[![License][license-badge]][license]


A versatile stream filter for Node.js.

This package is not affliated with [Tim-Smart](https://www.npmjs.com/~Tim-Smart)’s [filter](https://www.npmjs.com/package/filter).

## Install

```bash
$ npm install filter2
```

## Usage
```js
var filter = require('filter2')
```

### Passthrough (do nothing)

```js
fs.createReadStream('./foo.txt')
  .pipe(filter())
```

### Get the first 5 chunks

```js
fs.createReadStream('./foo.txt')
  .pipe(filter.head(5))
```

### Get the last 5 chunks

```js
fs.createReadStream('./foo.txt')
  .pipe(filter.tail(5))
```


### Get the filtered chunks

```js
fs.createReadStream('./foo.txt')
  .pipe(filter(function(chunk, encoding, next) {
    // returns true to make chunks flow downstream
    return /bar/.test(chunk, encoding, next)
  }))
```

Filter function get the same arguments as [through2](https://www.npmjs.com/package/through2).

Usually `filter` only makes sense when using after `filter.split()`.


### Get a custom set in chunks

```js
function MySet(n) {
	this._array = Array(n)
}
MySet.prototype.push = function(thing) {
	// filter input as you wish 
	this._array.push(thing)
}
MySet.prototype.forEach = function() {
	Array.prototype.forEach.apply(this._array, arguments)
}


var mySet = new MySet(4)
fs.createReadStream('./foo.txt')
  .pipe(filter.some(mySet))
  // each chunk is pushed into mySet
  // and when upstream drains, it
  // returns a set of chunks that mySet.forEach returns
```


### Break up a stream and reassemble it

This is just an alias of [Matteo Collina](mailto:hello@matteocollina.com)'s [split2](https://github.com/mcollina/split2). Please refers to [split2 README](https://github.com/mcollina/split2) for more details.

```js
fs.createReadStream('./foo.txt')
  .pipe(filter.split())
  // split and rearrange chunks by line break
```

### Wrap around stream.Transform

This is just an alias of [Rod Vagg](https://r.va.gg/)'s [through2](https://github.com/rvagg/through2). Please refers to [through2 README](https://github.com/rvagg/through2) for more details.

```js
fs.createReadStream('./foo.txt')
  .pipe(filter.through(function(chunk, encoding, next) {
    // write your transform function here
  })
```

## License
Copyright (c) 2015 Jingwei "John" Liu

Licensed under the MIT license.

[travis-badge]: https://img.shields.io/travis/th507/stream-filter2.svg?style=flat-square
[npm-badge]: https://img.shields.io/npm/v/filter2.svg?style=flat-square
[license-badge]: http://img.shields.io/npm/l/filter2.svg?style=flat-square
[travis-url]: https://travis-ci.org/th507/stream-filter2
[npm-package]: https://www.npmjs.com/package/filter2
[license]: LICENSE
