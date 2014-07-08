var Schema = require('../lib/schema'),
    Model = require('../lib/model'),
    Promise = require('../lib/promise');

describe("instantiating a new schema", function() {
  var schema;

  it("should default primaryKey to `id`", function() {
    schema = new Schema('test');

    expect(schema.primaryKey).toEqual('id');
  });

  it("should set primaryKey to the specified key", function() {
    schema = new Schema('test', {primaryKey: 'key'});

    expect(schema.primaryKey).toEqual('key');
  });
});

describe("instantiating a new model", function() {
  var schema;

  beforeEach(function() {
    schema = new Schema('test');
  });

  it("should return a model when no attributes are given", function() {
    expect(schema.new()).toEqual(jasmine.any(Model));
  });

  it("should return a model initialised with the given attributes", function() {
    var model = schema.new({foo: 'bar'});

    expect(model).toEqual(jasmine.any(Model));
    expect(model.get('foo')).toEqual('bar');
  });
});

describe("finding a model", function() {
  var schema;

  beforeEach(function() {
    schema = new Schema('test');
  });

  it("should return a promise", function() {
    expect(schema.find(1)).toEqual(jasmine.any(Promise));
  });

  it("should resolve with a model when found", function(done) {
    var model = schema.new();

    model.save().then(function() {
      schema.find(model.id()).then(function(foundModel) {
        expect(foundModel.object).toEqual(model.object);
        done();
      });
    });
  });
});

describe("finding models", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = schema.new({foo: 'bar'});
  });

  it("should return a promise", function() {
    expect(schema.findAll()).toEqual(jasmine.any(Promise));
  });

  it("should resolve with a collection of models when found", function(done) {
    model.save().then(function() {
      schema.findAll().then(function(foundModels) {
        var objects = foundModels.map(function(m) { return m.object });

        expect(objects).toEqual([model.object]);
        done();
      });
    });
  });
});

describe("creating a model", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = schema.new({foo: 'bar'});
  });

  it("should return a promise", function() {
    expect(schema.create(model)).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the model", function(done) {
    schema.create(model).then(function(createdModel) {
      expect(createdModel).toBe(model);
      done();
    });
  });

  it("should set the model's state to persisted", function(done) {
    schema.create(model).then(function() {
      expect(model.state).toEqual('persisted');
      done();
    });
  });

  it("should emit a created event", function(done) {
    model.on('created', function() {
      done();
    });
    schema.create(model);
  });
});

describe("updating a model", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = schema.new({foo: 'bar'});
    model.save();
  });

  it("should return a promise", function() {
    expect(schema.update(model)).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the model", function(done) {
    schema.update(model).then(function(updatedModel) {
      expect(updatedModel).toBe(model);
      done();
    });
  });

  it("should set the model's state to persisted", function(done) {
    schema.update(model).then(function() {
      expect(model.state).toEqual('persisted');
      done();
    });
  });

  it("should emit a updated event", function(done) {
    model.on('updated', function() {
      done();
    });
    schema.update(model);
  });
});

describe("destroying a model", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = schema.new({foo: 'bar'});
    model.save();
  });

  it("should return a promise", function() {
    expect(schema.destroy(model)).toEqual(jasmine.any(Promise));
  });

  it("should resolve with the model", function(done) {
    schema.destroy(model).then(function(destroyedModel) {
      expect(destroyedModel).toBe(model);
      done();
    });
  });

  it("should set the model's state to destroyed", function(done) {
    schema.destroy(model).then(function() {
      expect(model.state).toEqual('destroyed');
      done();
    });
  });

  it("should emit a destroyed event", function(done) {
    model.on('destroyed', function() {
      done();
    });
    schema.destroy(model);
  });
});
