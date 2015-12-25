var fs = require('fs')
var path = require('path')
var through = require('through2')
var test = require('tap').test

var filter = require('../')
var Queue = require('../lib/queue')

var lorem = path.join(__dirname, 'lorem-ipsum.txt')
var foo = path.join(__dirname, 'foo.txt')

test('filter.filter (passthrough)', function(t) {
  t.plan(1)

  var str = ''

  fs.createReadStream(lorem)
    .pipe(filter())
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')

      cb()
    }, function (cb) {
      var tmp = fs.readFileSync(lorem, 'utf8')

      t.equal(tmp, str)
      cb()
    }))
})


test('filter.filter', function(t) {
  t.plan(2)

  var str = ''

  var highWaterMark = 20

  var count = 0

  fs.createReadStream(lorem, {highWaterMark: highWaterMark})
    .pipe(filter(function(ch) {
      return /elementum/.test(ch.toString('utf8'))
    }))
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')
      count++
      cb()
    }, function (cb) {
      t.equal(count, 1)
      t.equal(str, 'us elit elementum se')
      cb()
    }))
})


test('filter.head', function(t) {
  t.plan(1)

  var str = ''

  var highWaterMark = 20

  var head_count = 2

  fs.createReadStream(lorem, {highWaterMark: highWaterMark})
    .pipe(filter.head(head_count))
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')

      cb()
    }, function (cb) {
      var tmp = fs.readFileSync(lorem, 'utf8').slice(0, 40)

      t.equal(tmp, str)
      cb()
    }))
})

test('filter.head with fewer chunks', function(t) {
  t.plan(1)

  var str = ''

  var highWaterMark = 20

  var head_count = 2

  fs.createReadStream(foo, {highWaterMark: highWaterMark})
    .pipe(filter.head(head_count))
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')

      cb()
    }, function (cb) {
      var tmp = fs.readFileSync(foo, 'utf8')

      t.equal(tmp, str)
      cb()
    }))
})


test('filter.tail', function(t) {
  t.plan(1)

  var str = ''

  var tail_count = 2
  var highWaterMark = 20

  fs.createReadStream(lorem, {highWaterMark: highWaterMark})
    .pipe(filter.tail(tail_count))
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')

      cb()
    }, function (cb) {
      var tmp = fs.readFileSync(lorem, 'utf8')
      var len = tmp.length

      var residual = len % highWaterMark

      var num = residual + highWaterMark * (tail_count - 1)

      t.equal(tmp.slice(0 - num), str)
      cb()
    }))
})

test('filter.tail with fewer chunks', function(t) {
  t.plan(1)

  var str = ''

  var highWaterMark = 20

  var head_count = 2

  fs.createReadStream(foo, {highWaterMark: highWaterMark})
    .pipe(filter.tail(head_count))
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')

      cb()
    }, function (cb) {
      var tmp = fs.readFileSync(foo, 'utf8')

      t.equal(tmp, str)
      cb()
    }))
})

test('filter.some', function(t) {
  t.plan(2)

  var str = ''

  var highWaterMark = 20

  var count = 0

  function CustomSet(n) {
    this._array = Array(n)
  }

  CustomSet.prototype.push = function(el) {
    var str = el.toString()
    if (/pulvinar/.test(str)) this._array.push(el)
  }

  CustomSet.prototype.forEach = function(fn) {
    this._array.forEach(fn)
  }

  var customFilter = filter.some(new CustomSet(2))

  fs.createReadStream(lorem, {highWaterMark: highWaterMark})
    .pipe(customFilter)
    .pipe(through(function(ch, e, cb) {
      str += ch.toString('utf8')
      count++
      cb()
    }, function (cb) {
      t.equal(count, 1)
      t.equal(str, 'mod pulvinar urna, n')
      cb()
    }))
})

test('data structure: Queue', function(t) {
  t.plan(2)
  var three = new Queue(3)

  three.push(1)
  three.push(2)
  three.push(3)
  three.push(4)

  t.equal(three.length, 3)

  var arr = []
  three.forEach(function(x) {
    arr.push(x)
  })

  t.deepEqual(arr, [2, 3, 4])
})

