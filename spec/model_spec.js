var Model = require('../lib/model'),
    Schema = require('../lib/schema');

describe("instantiating a new model", function() {
  var attributes = {foo: 'bar'},
      schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = new Model(schema, attributes);
  });

  it("should set schema to the given schema", function() {
    expect(model.schema).toBe(schema);
  });

  it("should set the state to `new`", function() {
    expect(model.state).toEqual('new');
  });

  it("should set attributes given", function() {
    expect(model.object).toEqual(attributes);
  });
});

describe("getting attributes", function() {
  var attributes = {foo: 'bar', key: 1, bar: 'baz'},
      schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = new Model(schema, attributes);
  });

  it("should return the primary key defined on the schema", function() {
    schema.primaryKey = 'key';

    expect(model.id()).toEqual(attributes.key);
  });

  it("should return the value for the attribute specified", function() {
    expect(model.get('foo')).toEqual(attributes.foo);
  });

  it("should return an object containing the values for the attributes specified", function() {
    expect(model.getAll('foo', 'key')).toEqual({foo: 'bar', key: 1});
  });

  it("should return an object containing all values", function() {
    expect(model.getAll()).toEqual(attributes);
  });

  it("should return true when has attribute", function() {
    expect(model.has('foo')).toEqual(true);
  });

  it("should return false when has attribute", function() {
    expect(model.has('baz')).toEqual(false);
  });
});

describe("setting attributes", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = new Model(schema);
  });

  it("should sets the attribute given the name and value", function() {
    model.set('foo', 'bar');
    expect(model.get('foo')).toEqual('bar');
  });

  it("should set the attributes given as an object", function() {
    model.set({foo: 'bar', bar: 'baz'});
    expect(model.getAll()).toEqual({foo: 'bar', bar: 'baz'});
  });

  it("should emit change event when attributes have changed", function(done) {
    model.set('foo', 'bar');
    model.on('change', function(values, changes) {
      expect(this).toBe(model);
      expect(values).toEqual({foo: 'baz'});
      expect(changes).toEqual({foo: 'bar'});
      done();
    });
    model.set('foo', 'baz');
  });

  it("should emit change event against the attribute when it has changed", function(done) {
    model.on('change:foo', function(currentValue, previousValue) {
      expect(currentValue).toEqual('bar');
      expect(previousValue).toEqual(undefined);
      done();
    });
    model.set('foo', 'bar');
  });
});

describe("saving a model", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = new Model(schema, {foo: 'bar'});
  });

  it("should create the model when is new", function() {
    spyOn(schema, 'create');

    model.save();

    expect(schema.create).toHaveBeenCalledWith(model);
  });

  it("should update the model when is persisted", function() {
    spyOn(schema, 'update');

    model.state = 'persisted';
    model.save();

    expect(schema.update).toHaveBeenCalledWith(model);
  });

  it("should return a promise with the error when is destroyed", function(done) {
    model.state = 'destroyed';
    model.on('error', function() {});
    model.save().then(null, function(error) {
      expect(error).toEqual(new Error("Cannot save a model that has been destroyed."));
      done();
    });
  });

  it("should emit an error when is destroyed", function(done) {
    model.state = 'destroyed';
    model.on('error', function(error) {
      expect(error).toEqual(new Error("Cannot save a model that has been destroyed."));
      done();
    });
    model.save();
  });
});

describe("destroying a model", function() {
  var schema, model;

  beforeEach(function() {
    schema = new Schema('test');
    model = new Model(schema, {foo: 'bar'});
  });

  it("should destroy the model", function() {
    spyOn(schema, 'destroy');

    model.destroy();

    expect(schema.destroy).toHaveBeenCalledWith(model);
  });
});

describe("comparing models", function() {
  var schema;

  beforeEach(function() {
    schema = new Schema('test');
  });

  it("should return true when two models have the same id", function() {
    var model1 = schema.new({id: 1}),
        model2 = schema.new({id: 1});

    expect(model2).toEqual(model1);
  });

  it("should return false when two models have different ids", function() {
    var model1 = schema.new({id: 1}),
        model2 = schema.new({id: 2});

    expect(model2).not.toEqual(model1);
  });

  it("should return false when two models have the same id but of different type", function() {
    var otherSchema = new Schema('other'),
        model1 = schema.new({id: 1}),
        model2 = otherSchema.new({id: 1});

    expect(model2).not.toEqual(model1);
  });
});
