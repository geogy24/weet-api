const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');

const service = require('../services/users');

exports.session = (request, response) =>
  service
    .findByEmail(request.body.email)
    .then(model => {
      if (bcrypt.compareSync(request.body.password, model.dataValues.password)) {
        const payload = Object.assign(model.dataValues, {
          exp: moment()
            .add(10, 'minutes')
            .unix()
        });
        response.status(200).json({ token: jwt.encode(payload, process.env.SECRET) });
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
      service.sendEmail(model);
      return model;
    })
    .then(model => {
      const user = { ...model.dataValues };
      delete user.password;

      response.status(201).send(user);
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

exports.invalidateAll = (request, response) => {
  const token = request.headers.authorization;
  const payload = jwt.decode(token, process.env.SECRET);

  payload.exp = moment()
    .subtract(1, 'days')
    .unix();

  response.set('x-token', jwt.encode(payload, process.env.SECRET));
  response.status(200).send();
};
