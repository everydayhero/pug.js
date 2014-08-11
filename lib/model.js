var EventEmitter = require('events').EventEmitter,
    Promise = require('es6-promise').Promise,
    util = require('util');

function Model(schema, attributes) {
  EventEmitter.call(this);

  // Don't raise an error when no event is bound.
  this.on('error', function() {});

  this.schema = schema;
  this.object = {};
  this.state = 'new';

  if (attributes) {
    this.set(attributes);
  }
}

util.inherits(Model, EventEmitter);

Model.prototype.id = function() {
  var primaryKey = this.schema.primaryKey;
  return this.object[primaryKey];
};

Model.prototype.get = function(name) {
  return this.object[name];
};

Model.prototype.getAll = function() {
  var names = [].slice.call(arguments),
      attributes = {},
      model = this;

  if (names.length === 0) {
    names = Object.keys(this.object);
  }

  names.forEach(function(name) {
    attributes[name] = model.object[name];
  });

  return attributes;
};

Model.prototype.has = function(name) {
  return !!this.object[name];
};

Model.prototype.set = function(attributes, value) {
  var model = this,
      values = {},
      oldValues = {},
      name;

  if (typeof(attributes) === 'string') {
    name = attributes;
    attributes = {};
    attributes[name] = value;
  }

  Object.keys(attributes).forEach(function(key) {
    var value = attributes[key],
        oldValue = model.object[key];

    if (value !== oldValue) {
      values[key] = value;
      oldValues[key] = oldValue;

      model.object[key] = value;
      model.emit('change:' + key, value, oldValue);
    }
  });

  if (Object.keys(values).length > 0) {
    model.emit('change', values, oldValues);
  }

  return this;
};

Model.prototype.save = function() {
  var error;

  switch (this.state) {
    case 'destroyed':
      return cannotPersistDestroyed(this);
    case 'new':
      return this.schema.create(this);
    default:
      return this.schema.update(this);
  }
};

Model.prototype.destroy = function() {
  return this.schema.destroy(this);
};

Model.prototype.valueOf = function() {
  return this.object;
};

function cannotPersistDestroyed(model) {
  var error = new Error("Cannot save a model that has been destroyed.");

  model.emit('error', error);
  return Promise.reject(error);
}

module.exports = Model;
