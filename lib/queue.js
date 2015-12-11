module.exports = Queue;

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

Queue.prototype.forEach = function(fn) {
  for (var i = 0; i < this.length; i++) {
    var index = this.index
    this.index += i
    var tmp = this.index

    this.index = index

    fn(this.content[tmp], i)
  }
}

Object.defineProperty(Queue.prototype, 'index', {
  get: function() { return this._index },
  set: function(k) {
    if (this.length === 0) return (this._index = 0)
      
    if (k >= this.length) return (this._index = k % this.length)
    if (k < 0) {
      var times = Math.ceil((-k) / this.length)

      return (this._index = (k + times * this.length) % this.length)
    }

    return (this._index = k)
  }
})
