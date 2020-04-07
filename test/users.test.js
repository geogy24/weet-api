const request = require('supertest');
const { factory } = require('factory-girl');
const Chance = require('chance');
const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');

const chance = new Chance();
let user = null;
let response = null;
factoryByModel('users');

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
