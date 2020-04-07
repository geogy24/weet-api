/*  eslint max-lines: ["error", 500]  */

const request = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const Chance = require('chance');
const jwt = require('jwt-simple');
const nock = require('nock');

const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');

const chance = new Chance();
let userLogged = null;
let response = null;
factoryByModel('users');

describe('/weets#create', () => {
  describe('when have not session', () => {
    beforeEach(async done => {
      response = await request(app).post('/weets');
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

  describe('when have a valid session', () => {
    describe('when send valid user data', () => {
      beforeEach(async done => {
        nock('http://numbersapi.com')
          .get('/random/year')
          .reply(200, chance.string({ length: 140 }));

        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: false
        });

        response = await request(app)
          .post('/weets')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
        done();
      });

      it('responses 201 created', () => {
        expect(response.statusCode).toEqual(201);
      });

      it('creates correctly the weet', () => {
        expect(parseInt(response.body.id)).toEqual(1);
      });

      it('relates the user with weet data', () => {
        expect(response.body.userId).toEqual(userLogged.id);
      });
    });

    describe('when API respons is not valid', () => {
      beforeEach(async done => {
        nock('http://numbersapi.com')
          .get('/random/year')
          .reply(200, chance.string({ length: 150 }));

        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: false
        });

        response = await request(app)
          .post('/weets')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));

        done();
      });

      it('responses 400 bad request', () => {
        expect(response.statusCode).toEqual(400);
      });

      it('shows correct error ', () => {
        const error = { error: 'Weet must have 140 characters maximum' };
        expect(response.body).toEqual(error);
      });
    });
  });
});
