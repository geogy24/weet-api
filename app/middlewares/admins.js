const jwt = require('jwt-simple');
const { checkSchema } = require('express-validator');

const checkValidations = require('../helpers/checkValidation');

exports.verifySession = (request, response, next) => {
  try {
    const token = request.headers.authorization;
    const jwtDecoded = jwt.decode(token, process.env.SECRET);

    if (jwtDecoded && jwtDecoded.administrator) {
      next();
    } else {
      throw new Error('unauthorized');
    }
  } catch (error) {
    response.status(401).json({ errors: [{ msg: 'unauthorized' }] });
  }
};

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
      optional: true
    }
  });

  checkValidations(request, response, next, validations);
};
