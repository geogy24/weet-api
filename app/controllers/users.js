const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const service = require('../services/users');

exports.session = (request, response) =>
  service
    .findByEmail(request.body.email)
    .then(model => {
      if (bcrypt.compareSync(request.body.password, model.dataValues.password)) {
        response.status(200).json({ token: jwt.encode(model.dataValues, process.env.SECRET) });
      } else {
        response.status(422).json({ errors: [{ msg: 'password invalid' }] });
      }
    })
    .catch(() => {
      response.status(400).json({ errors: [{ msg: 'user not found' }] });
    });

exports.create = (request, response) => {
  bcrypt
    .hash(request.body.password, 2)
    .then(result => {
      request.body.password = result;
      return service.create(request.body);
    })
    .then(model => {
      const modelJSON = JSON.parse(JSON.stringify(model));
      delete modelJSON.password;

      response.status(201).send(modelJSON);
    })
    .catch(error => {
      const errors = JSON.stringify(error) === '{}' ? { error: error.message } : error;
      response.status(400).send(errors);
    });
};

exports.list = (request, response) => {
  service
    .paginate(request.query.page, request.query.limit)
    .then(records => {
      response.status(200).json(records);
    })
    .catch(error => {
      response.status(400).json(error);
    });
};
