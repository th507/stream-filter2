var through = require('through2')
// include Matteo Collina's amazing split2 library
var split = require('split2')
var Queue = require('./lib/queue')
// var Sieve = require('./lib/sieve')

/**
 * Pushes chunk of stream into custom set and 
 * calls forEach on the set when upstream drains
 *
 * @param set a custom Set instance with a set::push and set::forEach
 * @return a through2 function 
 **/
function some(set) {
  return through(function(chunk, e, cb) {
    set.push(chunk)
    cb(null)
  }, function(cb) {
    set.forEach(this.push.bind(this))
    cb()
  })
}

/**
 * passthrough only the first n chunks of a stream
 **/
function head(n) {
  return through(function(chunk, e, cb) {
    // countdown to zero
    if (n-- <= 0) chunk = null

    cb(null, chunk)
  })
}

/**
 * passthrough only the last n chunks of a stream
 **/
function tail(n) {
  return some(new Queue(n))
}

/**
 * passthrough only when filter function returns true
 **/
function filter(fn) {
  // save comparison with each chunk push
  if (!(fn && typeof fn === 'function')) {
    return passthrough()
  }

  return through(function(chunk, e, cb) {
    if (!fn(chunk, e, cb)) chunk = null

    cb(null, chunk)
  })
}

/**
 * passthrough the stream / do nothing
 **/
function passthrough() {
  return through(function(chunk, e, cb) {
    cb(null, chunk)
  })
}

exports = module.exports = filter
exports.filter = filter
exports.head = head
exports.tail = tail
exports.some = some
exports.through = through
exports.split = split

