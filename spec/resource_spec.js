var Promise = require('es6-promise').Promise;

var Resource = require('../lib/resource'),
    Repository = require('../lib/repository');

describe("instantiating a new resource", function() {
  var resource;

  it("should set the name to the given name", function() {
    resource = new Resource('test');

    expect(resource.name).toEqual('test');
  });

  it("should throw an error when no name is given", function() {
    expect(function() {
      new Resource();
    }).toThrow(new Error("Resource must have a name"));
  });

  it("should set repository to the given repository", function() {
    var repository = new Repository();

    resource = new Resource('test', {repository: repository});

    expect(resource.repository).toBe(repository);
  });


  it("should instantiate a new repository when none given", function() {
    resource = new Resource('test');

    expect(resource.repository).toEqual(jasmine.any(Repository));
  });

});

describe("finding an item", function() {
  var object = {key: 'abc123'},
      resource, repository;

  beforeEach(function() {
    resource = new Resource('test');
    repository = resource.repository;

    spyOn(repository, 'find').andReturn(Promise.resolve(object));
  });

  it("should call the repository with the resource name and given key", function() {
    resource.find(object.key);

    expect(repository.find).toHaveBeenCalledWith('test', object.key);
  });

  it("should return a promise which contains the object when resolved", function(done) {
    resource.find(object.key).then(function(foundObject) {
      expect(foundObject).toEqual(object);
      done();
    });
  });
});

describe("finding items", function() {
  var query = {},
      collection = [{}],
      resource, repository;

  beforeEach(function() {
    resource = new Resource('test');
    repository = resource.repository;

    spyOn(repository, 'findAll').andReturn(Promise.resolve(collection));
  });

  it("should call the repository with the resource name and given query", function() {
    resource.findAll(query);

    expect(repository.findAll).toHaveBeenCalledWith('test', query);
  });

  it("should return a promise which contains a collection of results when resolved", function(done) {
    resource.findAll(query).then(function(results) {
      expect(results).toEqual(collection);
      done();
    });
  });
});

describe("creating an item", function() {
  var object = {},
      resource, repository;

  beforeEach(function() {
    resource = new Resource('test');
    repository = resource.repository;

    spyOn(repository, 'create').andReturn(Promise.resolve(object));
  });

  it("should call the repository with the resource name and given query", function() {
    resource.create(object);

    expect(repository.create).toHaveBeenCalledWith('test', object);
  });

  it("should return a promise which contains the created object when resolved", function(done) {
    resource.create(object).then(function(createdObject) {
      expect(createdObject).toEqual(object);
      done();
    });
  });

  it("should emit the `created` event", function(done) {
    resource.on('created', function(createdObject) {
      expect(createdObject).toEqual(object);
      done();
    });
    resource.create(object);
  });
});

describe("updating an item", function() {
  var object = {key: 'abc123'},
      resource, repository;

  beforeEach(function() {
    resource = new Resource('test');
    repository = resource.repository;

    spyOn(repository, 'update').andReturn(Promise.resolve(object));
  });

  it("should call the repository with the resource name, key and given query", function() {
    resource.update(object.key, object);

    expect(repository.update).toHaveBeenCalledWith('test', object.key, object);
  });

  it("should return a promise which contains the updated object when resolved", function(done) {
    resource.update(object).then(function(updatedObject) {
      expect(updatedObject).toEqual(object);
      done();
    });
  });

  it("should emit the `updated` event", function(done) {
    resource.on('updated', function(updatedObject) {
      expect(updatedObject).toEqual(object);
      done();
    });
    resource.update(object);
  });
});

describe("destroying an item", function() {
  var object = {key: 'abc123'},
      resource, repository;

  beforeEach(function() {
    resource = new Resource('test');
    repository = resource.repository;

    spyOn(repository, 'destroy').andReturn(Promise.resolve(object));
  });

  it("should call the repository with the resource name and key", function() {
    resource.destroy(object.key);

    expect(repository.destroy).toHaveBeenCalledWith('test', object.key);
  });

  it("should return a promise which contains the destroyed object when resolved", function(done) {
    resource.destroy(object).then(function(destroyed) {
      expect(destroyed).toEqual(object);
      done();
    });
  });

  it("should emit the `destroyed` event", function(done) {
    resource.on('destroyed', function(destroyedObject) {
      expect(destroyedObject).toEqual(object);
      done();
    });
    resource.destroy(object);
  });
});
