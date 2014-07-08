var asap;
var isNode = typeof process !== "undefined" &&
             {}.toString.call(process) === "[object process]";

if (isNode) {
  if (process.env.NODE_ENV === 'test') {
    asap = function(fn) { fn() };
  } else {
    asap = process.nextTick;
  }
} else if (typeof setImmediate !== "undefined") {
  asap = setImmediate;
} else {
  asap = setTimeout;
}

module.exports = asap;
