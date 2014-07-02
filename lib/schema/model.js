var EventEmitter = require('events').EventEmitter,
    Promise = require('../promise');

function Model(schema, attributes) {
  this.schema = schema;
  this.__attributes = {};
  this.state = 'new';

  if (attributes) {
    this.set(attributes);
  }
}

Model.prototype = new EventEmitter();

Model.prototype.id = function() {
  var primaryKey = this.schema.primaryKey;
  return this.__attributes[primaryKey];
};

Model.prototype.get = function() {
  var names = [].slice.call(arguments),
      attributes = {},
      name;

  for (name in names) {
    attributes[name] = this.__attributes[name];
  }

  if (names.length === 1) {
    return attributes[name];
  } else {
    return attributes;
  }
};

Model.prototype.getAll = function() {
  var names = Object.keys(this.__attributes);
  return this.get.apply(this, names);
};

Model.prototype.set = function(attributes, value) {
  var model = this,
      changes = {},
      name;

  if (typeof(attributes) === 'string') {
    name = attributes;
    attributes = {};
    attributes[name] = value;
  }

  Object.keys(attributes).forEach(function(key) {
    var value = attributes[key],
        oldValue = model.__attributes[key];

    if (value !== oldValue) {
      changes[key] = oldValue;

      model.__attributes[key] = value;
      model.fire('change:' + key, value, oldValue);
    }
  });

  if (Object.keys(changes).length > 0) {
    model.fire('change', changes);
  }

  return this;
};

Model.prototype.has = function(name) {
  return !!this.__attributes[name];
};

Model.prototype.validate = function() {
  var validator = this.schema.validator,
      model = this;

  return validator.validate(model.getAll()).then(function() {
    return Promise.resolve(model);
  });
};

Model.prototype.save = function(validate) {
  var promise;

  if (this.state === 'destroyed') {
    return Promise.reject(new Error("Cannot save a model that has been destroyed."));
  }

  if (validate === undefined || validate) {
    promise = this.validate();
  } else {
    promise = Promise.resolve(this);
  }

  return promise.then(function(model) {
    if (model.state === 'new') {
      return create(model);
    } else {
      return update(model);
    }
  });
};

Model.prototype.destroy = function() {
  var resource = this.schema.resource,
      model = this;

  return resource.destroy(model.id()).then(function() {
    model.state = 'destroyed';
    model.fire('destroyed');
  });
};

Model.prototype.toJSON = function() {
  return this.getAll();
};

function create(model) {
  var resource = this.schema.resource,
      model = this;

  return resource.create(model.getAll()).then(function(attributes) {
    model.state = 'persisted';
    model.set(attributes);
    model.fire('created');
  });
}

function update(model) {
  var resource = this.schema.resource,
      model = this;

  return resource.update(model.id(), model.getAll()).then(function(attributes) {
    model.state = 'persisted';
    model.set(attributes);
    model.fire('updated');
  });
}

module.exports = Model;
