const { validationResult } = require('express-validator');
const models = require('../../app/models');

exports.create = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.array() });

  return models.users
    .create(request.body)
    .then(model => {
      response.status(200).json(model);
    })
    .catch(error => {
      response.status(400).json(error);
    });
};
