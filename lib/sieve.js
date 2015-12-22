module.exports = Sieve

function Sieve(fn) {
  this.content = []
  if (fn && typeof fn === 'function') this.filter = fn
}

Sieve.prototype.push = function(el) {
  if (el === null
  || !this.filter
  || this.filter(el)
     ) this.content.push(el)
}

Sieve.prototype.forEach = function(fn, ctx) {
  return this.content.forEach(fn, ctx)
}
