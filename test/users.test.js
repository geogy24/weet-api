const request = require('supertest');
const { factory } = require('factory-girl');
const Chance = require('chance');
const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');

const chance = new Chance();
let user = null;
let response = null;
factoryByModel('users');

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
