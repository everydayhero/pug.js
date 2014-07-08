var Promise = require('../promise');

var transforms = {};

function Transformer(transforms) {
  this.transforms = transforms;
}

Transformer.prototype.serialize = function(object) {
  return this.transformObject('serialize', object);
};

Transformer.prototype.deserialize = function(object) {
  return this.transformObject('deserialize', object);
};

Transformer.prototype.transformObject = function(method, object) {
  var transformedObject = {},
      transformer = this,
      promises;

  promises = Object.keys(object).map(function(key) {
    var value = object[key];
    return transformer.transformValue(method, key, value).then(function(transformedValue) {
      transformedObject[key] = transformedValue;
    });
  });

  return Promise.all(promises).then(function() {
    return Promise.resolve(transformedObject);
  });
}

Transformer.prototype.transformValue = function(method, key, value) {
  var transform = this.transforms[key];

  switch(typeof(transform)) {
    case 'string':
      transform = transforms[transform];
      break;
    case 'function':
      transform = transform();
      break;
  }

  if (transform) {
    value = transform[method](value);
  }

  if (typeof(value) === 'object' && typeof(value.then) === 'function') {
    return value;
  } else {
    return Promise.resolve(value);
  }
};

Transformer.transforms = transforms;

module.exports = Transformer;
