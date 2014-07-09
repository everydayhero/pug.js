var EventEmitter = require('events').EventEmitter,
    Promise = require('es6-promise').Promise,
    util = require('util');

var Repository = require('./repository');

var Resource = function(name, options) {
  EventEmitter.call(this);

  options || (options = {});

  if (!name) {
    throw new Error("Resource must have a name");
  }

  this.name = name;
  this.repository = options.repository || (new Repository());
};

util.inherits(Resource, EventEmitter);

Resource.prototype.find = function(key) {
  return this.repository.find(this.name, key);
};

Resource.prototype.findAll = function(query) {
  return this.repository.findAll(this.name, query);
};

Resource.prototype.create = function(object) {
  var resource = this,
      promise = this.repository.create(this.name, object);

  promise.then(function(createdObject) {
    resource.emit('created', createdObject);
  });

  return promise;
};

Resource.prototype.update = function(key, object) {
  var resource = this,
      promise = this.repository.update(this.name, key, object);

  promise.then(function(updatedObject) {
    resource.emit('updated', updatedObject);
    return Promise.resolve(updatedObject);
  });

  return promise;
};

Resource.prototype.destroy = function(key) {
  var resource = this,
      promise = this.repository.destroy(this.name, key);

  promise.then(function(object) {
    resource.emit('destroyed', object);
  });

  return promise;
};

module.exports = Resource;
