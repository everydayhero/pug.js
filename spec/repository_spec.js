var Promise = require('es6-promise').Promise;

var Repository = require('../lib/repository');

describe("finding an item", function() {
  var repository;

  beforeEach(function() {
    repository = new Repository();
  });

  it("should return a promise", function() {
    var promise = repository.find('abc123');

    expect(promise).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the object when found", function(done) {
    var object = {};

    repository.objects['test'] = {key1: object};
    repository.find('test', 'key1').then(function(foundObject) {
      expect(foundObject).toBe(object);
      done();
    });
  });

  it("should reject with an error when not found", function(done) {
    repository.find('test', 'nope').then(null, function(error) {
      expect(error).toEqual(new Repository.NotFoundError('test', 'nope'));
      done();
    });
  });
});

describe("finding many items", function() {
  var repository;

  beforeEach(function() {
    repository = new Repository();
  });

  it("should return a promise", function() {
    var promise = repository.findAll('test');

    expect(promise).toEqual(jasmine.any(Promise));
  });

  it("should resolve with all objects when empty query given", function() {
    var object1 = {},
        object2 = {};

    repository.objects['test'] = {
      key1: object1,
      key2: object2
    };
    repository.findAll('test').then(function(foundObjects) {
      expect(foundObjects).toEqual([object1, object2]);
      done();
    });
  });

  it("should resolve with objects that match query", function() {
    var object1 = {foo: 'bar'},
        object2 = {foo: 'baz'};

    repository.objects['test'] = {
      key1: object1,
      key2: object2
    };
    repository.findAll('test', {foo: 'bar'}).then(function(foundObjects) {
      expect(foundObjects).toEqual([object1]);
      done();
    });
  });
});

describe("creating item", function() {
  var repository;

  beforeEach(function() {
    repository = new Repository();
  });

  it("should return a promise", function() {
    var promise = repository.create('test');

    expect(promise).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the created object", function(done) {
    repository.create('test', {foo: 'bar'}).then(function(createdObject) {
      expect(createdObject).toEqual({id: 1, foo: 'bar'});
      done();
    });
  });

  it("should reject when key has already been taken", function(done) {
    repository.objects.test = {'1': {}};
    repository.create('test', {foo: 'bar'}).then(null, function(error) {
      expect(error).toEqual(new Error("A `test` record with key `1` already exists."));
      done();
    });
  });
});

describe("updating an item", function() {
  var repository, object;

  beforeEach(function() {
    object = {foo: 'bar'};
    repository = new Repository();
    repository.create('test', object);
  });

  it("should return a promise", function() {
    var promise = repository.update('test', object.id);

    expect(promise).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the updated object", function(done) {
    repository.update('test', object.id, {bar: 'baz'}).then(function(updatedObject) {
      expect(updatedObject).toEqual({id: object.id, bar: 'baz'});
      done();
    });
  });

  it("should reject when cannot find object by id", function(done) {
    repository.update('test', 0, {foo: 'bar'}).then(null, function(error) {
      expect(error).toEqual(new Error("No `test` record with id `0` was found."));
      done();
    });
  });
});

describe("destroying an item", function() {
  var repository, object;

  beforeEach(function() {
    object = {foo: 'bar'};
    repository = new Repository();
    repository.create('test', object);
  });

  it("should return a promise", function() {
    var promise = repository.destroy('test', object.id);

    expect(promise).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the destroyed object", function(done) {
    repository.destroy('test', object.id).then(function(destroyedObject) {
      expect(destroyedObject).toEqual(object);
      done();
    });
  });

  it("should reject when cannot find object by id", function(done) {
    repository.destroy('test', 0).then(null, function(error) {
      expect(error).toEqual(new Error("No `test` record with id `0` was found."));
      done();
    });
  });
});
