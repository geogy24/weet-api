/*  eslint max-lines: ["error", 500]  */

const request = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const Chance = require('chance');
const jwt = require('jwt-simple');

const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');

const chance = new Chance();
let user = null;
let users = null;
let response = null;
factoryByModel('users');

describe('/users/session#session', () => {
  describe('when send valid email and password', () => {
    beforeEach(async done => {
      const password = chance.string({ length: 8, alpha: true, numeric: true });
      user = await factory.create('users', {
        email: `${chance.word()}@wolox.co`,
        password: bcrypt.hashSync(password, 2)
      });

      response = await request(app)
        .post('/users/session')
        .send({ email: user.dataValues.email, password });
      done();
    });

    it('responses 200 ok', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('returns token', () => {
      expect(response.body.token).not.toBeNull();
    });
  });

  describe('when password value is invalid', () => {
    beforeEach(async done => {
      const password = chance.string({ length: 8, numeric: true });
      user = await factory.create('users', {
        email: `${chance.word()}@wolox.co`,
        password: bcrypt.hashSync(password, 2)
      });

      response = await request(app)
        .post('/users/session')
        .send({
          email: user.dataValues.email,
          password: chance.string({ length: 8, alpha: true, numeric: true })
        });
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('shows correct error', () => {
      const error = { errors: [{ msg: 'password invalid' }] };
      expect(response.body).toEqual(error);
    });
  });

  describe('when user does not exist', () => {
    beforeEach(async done => {
      const password = chance.string({ length: 8, numeric: true });
      user = await factory.create('users', { password: bcrypt.hashSync(password, 2) });

      response = await request(app)
        .post('/users/session')
        .send({
          email: `${chance.word()}@wolox.co`,
          password
        });
      done();
    });

    it('responses 400 error', () => {
      expect(response.statusCode).toEqual(400);
    });

    it('shows correct error', () => {
      const error = { errors: [{ msg: 'user not found' }] };
      expect(response.body).toEqual(error);
    });
  });
});

describe('/users#create', () => {
  describe('when send valid user data', () => {
    beforeEach(async done => {
      user = await factory.build('users', {
        email: `${chance.word()}@wolox.co`,
        password: chance.string({ length: 8, alpha: true, numeric: true })
      });

      response = await request(app)
        .post('/users')
        .send(user.dataValues);
      done();
    });

    it('responses 201 created', () => {
      expect(response.statusCode).toEqual(201);
    });

    it('creates correctly the user', () => {
      expect(parseInt(response.body.id)).toEqual(1);
    });

    it('saves the user data correctly', () => {
      delete user.dataValues.password;
      delete user.dataValues.id;
      delete response.body.id;
      expect(response.body).toEqual(user.dataValues);
    });
  });

  describe('when password value is invalid', () => {
    beforeEach(async done => {
      user = await factory.build('users', {
        email: `${chance.word()}@wolox.co`,
        password: chance.string({ length: 3, alpha: true, numeric: true })
      });

      response = await request(app)
        .post('/users')
        .send(user.dataValues);
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('shows correct error', () => {
      const error = {
        location: 'body',
        msg: 'password is required, must have at least 8 characters and must be alphanumeric',
        param: 'password',
        value: user.password
      };
      expect(response.body.errors[0]).toEqual(error);
    });
  });

  describe('when saves a duplicate email', () => {
    beforeEach(async done => {
      const userCreated = await factory.create('users', {
        email: `${chance.word()}@wolox.co`,
        password: chance.string({ length: 8, alpha: true, numeric: true })
      });
      user = await factory.build('users', {
        email: userCreated.email,
        password: chance.string({ length: 8, alpha: true, numeric: true })
      });

      response = await request(app)
        .post('/users')
        .send(user.dataValues);
      done();
    });

    it('responses 400 error', () => {
      expect(response.statusCode).toEqual(400);
    });

    it('shows correct error', () => {
      expect(response.body.errors[0].message).toEqual('email must be unique');
    });
  });

  describe('when does not send user data', () => {
    beforeEach(async done => {
      response = await request(app)
        .post('/users')
        .send({});
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });
  });
});

describe('/users#list', () => {
  describe('when have not session', () => {
    beforeEach(async done => {
      response = await request(app)
        .get('/users')
        .query({
          page: 1,
          limit: 10
        });
      done();
    });

    it('responses 401 unathorized', () => {
      expect(response.statusCode).toEqual(401);
    });

    it('shows correct error', () => {
      const error = { errors: [{ msg: 'unauthorized' }] };
      expect(response.body).toEqual(error);
    });
  });

  describe('when not send page or limit', () => {
    beforeEach(async done => {
      users = await factory.createMany('users', 5, {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2)
      });

      response = await request(app)
        .get('/users')
        .set('authorization', jwt.encode(users[0].dataValues, process.env.SECRET));
      done();
    });

    it('responses 200 ok', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('returns correct quanitity of records', () => {
      expect(response.body.records.length).toEqual(5);
    });

    it('returns correct records', () => {
      const createdUserIds = users.map(createdUser => createdUser.dataValues.id).sort();
      const responseUserIds = response.body.records.map(responseUser => responseUser.id).sort();
      expect(responseUserIds).toEqual(createdUserIds);
    });
  });

  describe('when send page or limit', () => {
    beforeEach(async done => {
      users = await factory.createMany('users', 5, {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2)
      });

      response = await request(app)
        .get('/users')
        .query({
          page: 1,
          limit: 10
        })
        .set('authorization', jwt.encode(users[0].dataValues, process.env.SECRET));
      done();
    });

    it('responses 200 ok', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('returns correct quanitity of records', () => {
      expect(response.body.records.length).toEqual(5);
    });

    it('returns correct records', () => {
      const createdUserIds = users.map(createdUser => createdUser.dataValues.id).sort();
      const responseUserIds = response.body.records.map(responseUser => responseUser.id).sort();
      expect(responseUserIds).toEqual(createdUserIds);
    });
  });

  describe('when send invalid page', () => {
    beforeEach(async done => {
      user = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2)
      });

      response = await request(app)
        .get('/users')
        .query({
          page: '@!#$',
          limit: 10
        })
        .set('authorization', jwt.encode(user.dataValues, process.env.SECRET));
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('returns correct error', () => {
      const error = {
        errors: [
          {
            value: '@!#$',
            msg: 'page must be a number greater than zero (0)',
            param: 'page',
            location: 'query'
          }
        ]
      };
      expect(response.body).toEqual(error);
    });
  });

  describe('when send invalid limit', () => {
    beforeEach(async done => {
      user = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2)
      });

      response = await request(app)
        .get('/users')
        .query({
          page: 1,
          limit: '@!#$'
        })
        .set('authorization', jwt.encode(user.dataValues, process.env.SECRET));
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('returns correct error', () => {
      const error = {
        errors: [
          {
            value: '@!#$',
            msg: 'limit must be a number greater than zero (0)',
            param: 'limit',
            location: 'query'
          }
        ]
      };
      expect(response.body).toEqual(error);
    });
  });
});
