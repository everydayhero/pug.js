var EventEmitter = require('events').EventEmitter,
    Repository = require('./repository'),
    Promise = require('./promise');

var Resource = function(name, options) {
  options || (options = {});

  this.name = name;
  this.repository = options.repository || (new Repository());
};

Resource.prototype = new EventEmitter();

Resource.prototype.find = function(key) {
  return this.repository.find(this.name, key);
};

Resource.prototype.findAll = function(query) {
  return this.repository.findAll(this.name, query);
};

Resource.prototype.create = function(object) {
  var resource = this;
  return this.repository.create(this.name, object).then(function(createdObject) {
    resource.fire('created', createdObject);
  });
};

Resource.prototype.update = function(key, object) {
  var resource = this;
  return this.repository.update(this.name, key, object).then(function(updatedObject) {
    resource.fire('updated', updatedObject);
  });
};

Resource.prototype.destroy = function(key) {
  var resource = this;
  return this.repository.destroy(this.name, key).then(function(object) {
    resource.fire('destroyed', object);
  });
};

module.exports = Resource;
