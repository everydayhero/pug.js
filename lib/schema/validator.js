var validate = require('validate'),
    Promise = require('../promise');

validate.Promise = Promise;

function Validator(validations) {
  this.validations = validations;
}

Validator.prototype.validate = function(object) {
  return validate.async(object, this.validations).then(function() {
    return Promise.resolve(object);
  });
};

Validator.validations = validate.validations;

module.exports = Validator;
