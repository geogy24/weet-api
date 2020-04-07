const { checkSchema } = require('express-validator');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkValidations = require('../helpers/checkValidation');

exports.session = (request, response, next) => {
  const validations = checkSchema({
    code: {
      exists: true,
      isString: true,
      errorMessage: 'code is required and must have alphanumeric characters'
    }
  });

  checkValidations(request, response, next, validations);
};

exports.verifySession = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-nul2up7d.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://localhost:8081.com',
  issuer: 'https://dev-nul2up7d.auth0.com/',
  algorithms: ['RS256']
});

exports.create = (request, response, next) => {
  const validations = checkSchema({
    name: {
      isString: true,
      exists: true,
      errorMessage: 'name is required and must be a string'
    },
    surname: {
      isString: true,
      exists: true,
      errorMessage: 'surname is required and must be a string'
    },
    email: {
      exists: true,
      isEmail: true,
      custom: {
        options: value => new RegExp(/\S+@wolox.\S+/).test(value)
      },
      errorMessage: 'email is required and must have wolox.co domain'
    },
    password: {
      isString: true,
      isAlphanumeric: true,
      isLength: {
        options: { min: 8 }
      },
      errorMessage: 'password is required, must have at least 8 characters and must be alphanumeric'
    },
    administrator: {
      isBoolean: true,
      optional: true,
      customSanitizer: {
        // always return false
        options: () => false
      }
    }
  });

  checkValidations(request, response, next, validations);
};
