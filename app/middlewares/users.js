const jwt = require('jwt-simple');
const moment = require('moment');
const { checkSchema } = require('express-validator');

const checkValidations = require('../helpers/checkValidation');

exports.session = (request, response, next) => {
  const validations = checkSchema({
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
      exists: true,
      isLength: {
        options: { min: 8 }
      },
      custom: {
        options: value => new RegExp(/^[a-zA-Z0-9]*$/).test(value)
      },
      errorMessage: 'password is required, must have at least 8 characters and must be alphanumeric'
    }
  });

  checkValidations(request, response, next, validations);
};

exports.verifySession = (request, response, next) => {
  try {
    const token = request.headers.authorization;
    const payload = jwt.decode(token, process.env.SECRET, false);

    if (payload) {
      payload.exp = moment()
        .add(10, 'minutes')
        .unix();
      response.append('x-token', jwt.encode(payload, process.env.SECRET));
      next();
    }
  } catch (error) {
    response.status(401).json({ errors: [{ msg: 'unauthorized' }] });
  }
};

exports.verifySession = (request, response, next) => {
  try {
    const token = request.headers.authorization;
    if (jwt.decode(token, process.env.SECRET)) {
      next();
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
      optional: true,
      customSanitizer: {
        // always return false
        options: () => false
      }
    }
  });

  checkValidations(request, response, next, validations);
};
