const { validationResult } = require('express-validator');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const paginate = require('../helpers/pagination');
const models = require('../../app/models');

exports.session = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.array() });

  return models.users
    .findByEmail(request.body.email)
    .then(model => {
      if (bcrypt.compareSync(request.body.password, model.dataValues.password)) {
        response.status(200).json({ token: jwt.encode(model, process.env.SECRET) });
      } else {
        response.status(422).json({ errors: [{ msg: 'password invalid' }] });
      }
    })
    .catch(() => {
      response.status(400).json({ errors: [{ msg: 'user not found' }] });
    });
};

exports.create = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ errors: errors.array() });

  return models.users
    .create(request.body)
    .then(model => {
      const modelJSON = JSON.parse(JSON.stringify(model));
      delete modelJSON.password;

      response.status(201).json(modelJSON);
    })
    .catch(error => {
      response.status(400).json(error);
    });
};

exports.list = (request, response) => {
  paginate(models.users, ['id', 'name', 'surname', 'email'], request.query.page, request.query.limit)
    .then(records => {
      response.status(200).json(records);
    })
    .catch(error => {
      response.status(400).json(error);
    });
};
