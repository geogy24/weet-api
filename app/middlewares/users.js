const { checkSchema, validationResult } = require('express-validator');

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
    }
  });

  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) response.status(422).json({ errors: errors.array() });
    next();
  });
};
