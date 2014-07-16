var Promise = require('es6-promise').Promise;

function Repository() {
  this.objects = {};
  this.sequences = {};
}

Repository.prototype.find = function(type, key) {
  var repository = this;
  return new Promise(function(resolve, reject) {
    var repo = repository.objects[type] || {},
        object = repo[key];

    if (object) {
      resolve(object);
    } else {
      reject(new NotFoundError(type, key));
    }
  });
};

Repository.prototype.findAll = function(type, query) {
  var repository = this;
  return new Promise(function(resolve, reject) {
    var repo = repository.objects[type] || {},
        isEmpty = Object.keys(query || {}).length === 0,
        results = [];

    Object.keys(repo).forEach(function(id) {
      var object = repo[id];
      if (isEmpty || equalsProperties(object, query)) {
        results.push(object);
      }
    });

    resolve(results);
  });
};

Repository.prototype.create = function(type, object) {
  var repository = this;
  return new Promise(function(resolve, reject) {
    var repo = repository.objects[type] || {},
        sequences = repository.sequences,
        keyValue;

    repository.objects[type] = repo;
    sequences[type] = sequences[type] || 1;

    keyValue = sequences[type]++;

    if (repo[keyValue]) {
      reject(new Error("A `" + type + "` record with key `" + keyValue + "` already exists."));
    } else {
      object.id = keyValue;
      repo[keyValue] = object;
      resolve(object);
    }
  });
};

Repository.prototype.update = function(type, key, object) {
  var repository = this;
  return new Promise(function(resolve, reject) {
    var repo = repository.objects[type] || {};

    if (repo[key]) {
      object.id = key;
      repo[key] = object;
      resolve(object);
    } else {
      reject(new NotFoundError(type, key));
    }
  });
};

Repository.prototype.destroy = function(type, key) {
  var repository = this;
  return new Promise(function(resolve, reject) {
    var repo = repository.objects[type] || {},
        object = repo[key];

    if (object) {
      delete repo[key];
      resolve(object);
    } else {
      reject(new NotFoundError(type, key));
    }
  });
};

function equalsProperties(object, properties) {
  var key;

  for (key in properties) {
    if (properties[key] !== object[key]) {
      return false;
    }
  }

  return true;
}

function NotFoundError(type, key) {
  this.name = 'NotFoundError';
  this.message = "No `" + type + "` record with id `" + key + "` was found.";
}

NotFoundError.prototype = new Error();

Repository.NotFoundError = NotFoundError;

module.exports = Repository;
