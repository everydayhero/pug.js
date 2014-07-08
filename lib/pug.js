var Repository = require('./repository'),
    Resource = require('./resource'),
    Schema = require('./schema');

function Pug(options) {
  options || (options = {});
  this.repository = options.repository || (new Repository());
}

Pug.prototype.resource = function(name, options) {
  options || (options = {});

  if (!options.repository) {
    options.repository = this.repository;
  }

  return new Resource(name, options);
};

Pug.prototype.schema = function(name, options) {
  options || (options = {});

  if (!options.repository) {
    options.repository = this.repository;
  }

  return new Schema(name, options);
};

module.exports = Pug;
