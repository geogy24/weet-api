const request = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const Chance = require('chance');
const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');

const chance = new Chance();
let user = null;
let response = null;
factoryByModel('users');

describe('#session', () => {
  describe('when send valid email and password', () => {
    beforeEach(async done => {
      const password = chance.string({ length: 8, numeric: true });
      user = await factory.create('users', { password: bcrypt.hashSync(password, 2) });

      response = await request(app)
        .post('/api/v1/users/session')
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
      user = await factory.create('users', { password: bcrypt.hashSync(password, 2) });

      response = await request(app)
        .post('/api/v1/users/session')
        .send({
          email: user.dataValues.email,
          password: `${chance.word(5)}${chance.integer({ min: 2000 })}`
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
        .post('/api/v1/users/session')
        .send({
          email: 'test@wolox.co',
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

describe('#create', () => {
  describe('when send user data', () => {
    beforeEach(async done => {
      user = await factory.build('users');
      user.dataValues.password = `${chance.word(5)}${chance.integer({ min: 2000 })}`;

      response = await request(app)
        .post('/api/v1/users')
        .send(user.dataValues);
      done();
    });

    it('responses 201 created', () => {
      expect(response.statusCode).toEqual(201);
    });

    it('creates correctly the user', () => {
      expect(parseInt(response.body.id)).toBeGreaterThan(0);
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
      user = await factory.build('users');
      user.dataValues.password = 'i1';

      response = await request(app)
        .post('/api/v1/users')
        .send(user.dataValues);
      done();
    });

    it('responses 422 error', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('shows correct error', () => {
      const error = { errors: [{ location: 'body', msg: 'Invalid value', param: 'password' }] };
      delete response.body.errors[0].value;
      expect(response.body).toEqual(error);
    });
  });

  describe('when saves a duplicate email', () => {
    beforeEach(async done => {
      const userCreated = await factory.create('users');
      user = await factory.build('users');
      user.dataValues.email = userCreated.email;
      user.dataValues.password = `${chance.word(5)}${chance.integer({ min: 2000 })}`;

      response = await request(app)
        .post('/api/v1/users')
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
        .post('/api/v1/users')
        .send({});
      done();
    });

    it('responses 500 error', () => {
      expect(response.statusCode).toEqual(500);
    });
  });
});
