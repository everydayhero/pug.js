var Resource = require('./resource'),
    Promise = require('./promise'),
    Model = require('./model');

function Schema(name, options) {
  options || (options = {});

  this.primaryKey = options.primaryKey || 'id';
  this.resource = new Resource(name, options);
}

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
  return this.resource.create(model.object).then(handleResolution(model, 'created'), handleRejection(model));
};

Schema.prototype.update = function(model) {
  return this.resource.update(model.id(), model.object).then(handleResolution(model, 'updated'), handleRejection(model));
};

Schema.prototype.destroy = function(model) {
  return this.resource.destroy(model.id()).then(function() {
    model.state = 'destroyed';
    model.emit('destroyed');
    return Promise.resolve(model);
  }, handleRejection(this));
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

function handleResolution(model, event) {
  return function(attributes) {
    model.state = 'persisted';
    model.set(attributes);
    model.emit(event);
    return Promise.resolve(model);
  };
}

function handleRejection(model) {
  return function(error) {
    model.emit('error', error);
  }
}

module.exports = Schema;
