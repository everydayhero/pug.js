var EventEmitter = require('events').EventEmitter,
    Promise = require('es6-promise').Promise,
    util = require('util');

var Resource = require('./resource'),
    Model = require('./model');

function Schema(name, options) {
  EventEmitter.call(this);

  // Don't raise an error when no event is bound.
  this.on('error', function() {});

  options || (options = {});

  this.name = name;
  this.primaryKey = options.primaryKey || 'id';
  this.resource = new Resource(name, options);

  reEmitEvent(this, 'created');
  reEmitEvent(this, 'updated');
  reEmitEvent(this, 'destroyed');
  reEmitEvent(this, 'error');
}

util.inherits(Schema, EventEmitter);

Schema.prototype.new = function(attributes) {
  return new Model(this, attributes);
};

Schema.prototype.find = function(id) {
  return this.resource.find(id).then(resolveModel(this));
};

Schema.prototype.findAll = function(query) {
  return this.resource.findAll(query).then(resolveModels(this));
};

Schema.prototype.create = function(model) {
  return this.resource.create(model.object)
    .then(setAttributes(model))
    .then(setState(model, 'persisted'))
    .then(emitEvent(this, 'created', model))
    .then(returnModel(model))
    .catch(emitError(this, model));
};

Schema.prototype.update = function(model) {
  return this.resource.update(model.id(), model.object)
    .then(setAttributes(model))
    .then(setState(model, 'persisted'))
    .then(emitEvent(this, 'updated', model))
    .then(returnModel(model))
    .catch(emitError(this, model));
};

Schema.prototype.destroy = function(model) {
  return this.resource.destroy(model.id())
    .then(setState(model, 'destroyed'))
    .then(emitEvent(this, 'destroyed', model))
    .then(returnModel(model))
    .catch(emitError(this, model));
};

function resolveModel(schema) {
  return function(object) {
    return Promise.resolve(schema.new(object));
  };
}

function resolveModels(schema) {
  return function(collection) {
    var models = collection.map(function(object) {
      return schema.new(object);
    });
    return Promise.resolve(models);
  };
}

function setAttributes(model) {
  return function(attributes) {
    model.set(attributes);
  }
}

function setState(model, state) {
  return function() {
    model.state = state;
  }
}

function emitEvent(schema) {
  var baseArgs = [].slice.call(arguments, 1);

  return function() {
    var args = [].slice.call(arguments);

    args.unshift.apply(args, baseArgs);
    schema.emit.apply(schema, args);
  }
}

function emitError(schema, model) {
  return function(error) {
    schema.emit('error', model, error);
    return Promise.reject(error);
  };
}

function returnModel(model) {
  return function() {
    return Promise.resolve(model);
  }
}

function reEmitEvent(schema, event) {
  schema.on(event, function(model) {
    var args = [].slice.call(arguments, 1);

    args.unshift(event);
    model.emit.apply(model, args);
  });
}

module.exports = Schema;
