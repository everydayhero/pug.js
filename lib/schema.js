var Resource = require('./resource'),
    Promise = require('./promise'),
    Validator = require('./schema/validator'),
    Model = require('./schema/model');

function Schema(name, options) {
  options || (options = {});

  this.__records = {};
  this.primaryKey = options.primaryKey || 'id';
  this.resource = new Resource(name, options);
  this.validator = new Validator(options.validations || {});
}

Schema.prototype.new = function(attributes) {
  attributes || (attributes = {});
  return findModel(this, attributes) || (new Model(this, attributes));
};

Schema.prototype.find = function(id) {
  return this.resource.find(id).then(constructModel(this));
};

Schema.prototype.findAll = function(query) {
  return this.resource.findAll(query).then(constructModels(this));
};

function findModel(schema, attributes) {
  var id = attributes[schema.primaryKey];
  return schema.__records[id];
}

function constructModel(schema) {
  return function(object) {
    return Promise.resolve(schema.new(object));
  };
}

function constructModels(schema) {
  return function(collection) {
    var models = collection.map(function(object) {
      return schema.new(object);
    });
    return Promise.resolve(models);
  };
}

Schema.validations = Validator.validations;

module.exports = Schema;
