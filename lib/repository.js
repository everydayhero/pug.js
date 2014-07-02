var Promise = require('./promise');

function Repository() {
  this.objects = {};
  this.sequences = {};
}

Repository.prototype.find = function(type, key) {
  return new Promise(function(resolve, reject) {
    defer(function() {
      var repo = this.objects[type] || {},
          object = repo[key];

      if (object) {
        resolve(object);
      } else {
        reject(new Error("No `" + type + "` record with key `" + key + "` was found."))
      }
    });
  });
};

Repository.prototype.findAll = function(type, query) {
  return new Promise(function(resolve, reject) {
    defer(function() {
      var repo = this.objects[type] || {},
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
  });
};

Repository.prototype.create = function(type, object) {
  return new Promise(function(resolve, reject) {
    defer(function() {
      var repo = this.objects[type] || {},
          sequences = this.sequences || 1,
          keyValue;

      this.objects[type] = repo;
      sequences[type] = sequences;

      keyValue = sequences[type]++;

      if (repo[keyValue]) {
        reject(new Error("A `" + type + "` record with key `" + keyValue + "` already exists."));
      } else {
        object.id = keyValue;
        repo[keyValue] = object;
        resolve(object);
      }
    });
  });
};

Repository.prototype.update = function(type, key, object) {
  return new Promise(function(resolve, reject) {
    defer(function() {
      var repo = this.objects[type] || {};

      if (repo[key]) {
        object.id = key;
        repo[key] = object;
        resolve(object);
      } else {
        reject(new Error("No `" + type + "` record with key `" + key + "` was found."));
      }
    });
  });
};

Repository.prototype.destroy = function(type, id) {
  return new Promise(function(resolve, reject) {
    defer(function() {
      var repo = this.objects[type] || {},
          object = repo[id];

      if (object) {
        delete repo[id];
        resolve(object);
      } else {
        reject(new Error("No `" + type + "` record with id `" + id + "` was found."));
      }
    });
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

function defer(fn) {
  return setTimeout(fn, 0);
}

module.exports = Repository;
