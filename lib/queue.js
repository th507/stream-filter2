module.exports = Queue

function Queue(n) {
  if (n < 0) throw new Error('Length is a non-negative number!')
  this.content = Array(n)
  this._index = 0
  this.length = n
}

Queue.prototype.push = function(el) {
  this.content[this.index] = el
  this.index++
};

Queue.prototype.forEach = function(fn, ctx) {
  for (var i = 0; i < this.length; i++) {

    var next = this.calcuateIndex(this.index + i)

    fn.call(ctx, this.content[next], i, this.content)
  }
}

Queue.prototype.calcuateIndex = function(k) {
  if (this.length === 0) return 0

  if (k >= this.length) return k % this.length
  if (k < 0) {
    var times = Math.ceil((-k) / this.length)

    return (k + times * this.length) % this.length
  }

  return k
}

Object.defineProperty(Queue.prototype, 'index', {
  get: function() { return this._index },
  set: function(k) {
    return ( this._index = this.calcuateIndex(k) )
  }
})
