var through = require('through2')
var Queue = require('./lib/queue')

function head(n) {
  return through(function(chunk, e, cb) {
    if (n-- <= 0) chunk = null

    cb(null, chunk)
  })
}

function some(set) {
  //var set = new SetLike(n)

  return through(function(chunk, e, cb) {
    set.push(chunk)
    cb(null)
  }, function(cb) {
    set.forEach(this.push.bind(this))
    cb()
  })
}

function tail(n) {
  return some(new Queue(n))
}

function filter(fn) {
  return through(function(chunk, e, cb) {
    if (fn && typeof fn === 'function' && !fn(chunk, e, cb)) chunk = null

    cb(null, chunk)
  })
}


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

