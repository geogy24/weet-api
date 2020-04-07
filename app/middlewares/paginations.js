const { checkSchema } = require('express-validator');

const checkValidations = require('../helpers/checkValidation');

exports.pagination = (request, response, next) => {
  const validations = checkSchema({
    page: {
      in: 'query',
      optional: true,
      isInt: {
        options: {
          gt: 0
        }
      },
      errorMessage: 'page must be a number greater than zero (0)'
    },
    limit: {
      in: 'query',
      optional: true,
      isInt: {
        options: {
          gt: 0
        }
      },
      errorMessage: 'limit must be a number greater than zero (0)'
    }
  });

  checkValidations(request, response, next, validations);
};
