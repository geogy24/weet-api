const { checkSchema, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.create = (request, response, next) => {
  const validations = checkSchema({
    name: {
      type: 'string',
      exists: {
        errorMessage: 'name is required'
      }
    },
    surname: {
      type: 'string',
      exists: {
        errorMessage: 'surname is required'
      }
    },
    email: {
      type: 'string',
      exists: {
        errorMessage: 'email is required'
      },
      isEmail: {
        errorMessage: 'the value is not an email'
      },
      custom: {
        options: value => new RegExp(/\S+@wolox.\S+/).test(value),
        errorMessage: 'email must belong to wolox.co domain'
      }
    },
    password: {
      type: 'string',
      exists: {
        errorMessage: 'password is required'
      },
      isLength: {
        options: { min: 8 },
        errorMessage: 'password must have 8 characters'
      },
      isAlphanumeric: {
        errorMessage: 'password must contain alphanumeric characters'
      },
      customSanitizer: {
        options: value => bcrypt.hashSync(value, 10)
      }
    }
  });

  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) response.status(422).json({ errors: errors.array() });
    next();
  });
};
