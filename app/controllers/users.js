const bcrypt = require('bcrypt');

const service = require('../services/users');

exports.create = (request, response, next) =>
  bcrypt
    .hash(request.body.password, 2)
    .then(result => {
      request.body.password = result;
      return service.create(request.body);
    })
    .then(model => {
      const user = { ...model.dataValues };
      delete user.password;

      response.status(201).send(user);
    })
    .catch(error => {
      const errors = JSON.stringify(error) === '{}' ? { error: error.message } : error;
      response.status(400).send(errors);
      next();
    });
