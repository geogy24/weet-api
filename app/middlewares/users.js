const jwt = require('jwt-simple');
const { checkSchema, validationResult } = require('express-validator');

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

  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      response.status(422).send({ errors: errors.array() });
    }
  });
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
    }
  });

  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      response.status(422).send({ errors: errors.array() });
    }
  });
};

exports.list = (request, response, next) => {
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

  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      response.status(422).send({ errors: errors.array() });
    }
  });
};
