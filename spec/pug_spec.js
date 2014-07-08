var Pug = require('../lib/pug'),
    Repository = require('../lib/repository'),
    Resource = require('../lib/resource'),
    Schema = require('../lib/schema');

describe("instantiating a new Pug", function() {
  var pug;

  it("should set repository to the given repository", function() {
    var repository = new Repository();

    pug = new Pug({repository: repository});

    expect(pug.repository).toBe(repository);
  });


  it("should instantiate a new repository when none given", function() {
    pug = new Pug();

    expect(pug.repository).toEqual(jasmine.any(Repository));
  });

});

describe("Creating a new resource", function() {
  var pug;

  beforeEach(function() {
    pug = new Pug();
  });

  it("should return a new resource", function() {
    var resource = pug.resource('test');

    expect(resource).toEqual(jasmine.any(Resource));
  });

  it("should set the repository to the pug's repository when none given", function() {
    var resource = pug.resource('test');

    expect(resource.repository).toBe(pug.repository);
  });

});

describe("Creating a new schema", function() {
  var pug;

  beforeEach(function() {
    pug = new Pug();
  });

  it("should return a new schema", function() {
    var schema = pug.schema('test');

    expect(schema).toEqual(jasmine.any(Schema));
  });

  it("should set the repository to the pug's repository when none given", function() {
    var schema = pug.schema('test');

    expect(schema.resource.repository).toBe(pug.repository);
  });

});
