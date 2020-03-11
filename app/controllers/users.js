const models = require('../../app/models');

exports.create = (request, response) =>
  models.users
    .create(request.body)
    .then(model => {
      const modelJSON = JSON.parse(JSON.stringify(model));
      delete modelJSON.password;

      response.status(201).json(modelJSON);
    })
    .catch(error => {
      response.status(400).json(error);
    });
