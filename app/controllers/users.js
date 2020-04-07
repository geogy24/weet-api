const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');
const axios = require('axios');
const qs = require('querystring');

const service = require('../services/users');

exports.session = (request, response) => {
  axios
    .post(
      'https://dev-nul2up7d.auth0.com/oauth/token',
      qs.stringify({
        grant_type: process.env.AUTH0_GRANT_TYPE,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_SECRET,
        code: request.body.code,
        redirect_uri: process.env.AUTH0_REDIRECT_URI
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }
    )
    .then(res => {
      response.status(200).send(res.data);
    })
    .catch(error => {
      response.status(400).send(error);
    });
};

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
