const { validationResult } = require('express-validator');

module.exports = (request, response, next, validations) =>
  Promise.all(validations.map(validation => validation.run(request))).then(() => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      response.status(422).send({ errors: errors.array() });
    }
  });
