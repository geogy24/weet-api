const { checkSchema } = require('express-validator');

const checkValidations = require('../helpers/checkValidation');

exports.rating = (request, response, next) => {
  const validations = checkSchema({
    score: {
      isInt: true,
      exists: true,
      custom: {
        options: value => value !== 0
      },
      errorMessage: 'score must be different to zero'
    }
  });

  checkValidations(request, response, next, validations);
};
