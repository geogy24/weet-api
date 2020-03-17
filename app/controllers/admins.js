const bcrypt = require('bcrypt');

const service = require('../services/users');

exports.create = (request, response) => {
  bcrypt
    .hash(request.body.password, 2)
    .then(result => {
      request.body.password = result;

      return service.findByEmail(request.body.email).then(model => {
        if (!model) {
          return service.create(request.body);
        }
        return service.update({ email: request.body.email }, { administrator: true });
      });
    })
    .then(model => {
      if (Array.isArray(model)) {
        response.status(204).send();
      } else {
        const admin = { ...model.dataValues };
        delete admin.password;

        response.status(201).send(admin);
      }
    })
    .catch(error => {
      const errors = JSON.stringify(error) === '{}' ? { error: error.message } : error;
      response.status(400).send(errors);
    });
};
