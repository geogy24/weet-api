/*  eslint max-lines: ["error", 500]  */

const request = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const Chance = require('chance');
const jwt = require('jwt-simple');

const app = require('../../app');
const { factoryByModel } = require('../factory/factory_by_models');

const chance = new Chance();
let user = null;
let userLogged = null;
let response = null;
factoryByModel('users');

describe('/admin/users#create', () => {
  describe('when have not session', () => {
    beforeEach(async done => {
      response = await request(app).post('/admin/users');
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
    describe('when you are not an administrator', () => {
      beforeEach(async done => {
        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: false
        });

        response = await request(app)
          .post('/admin/users')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
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

    describe('when send valid user data', () => {
      beforeEach(async done => {
        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: true
        });

        user = await factory.build('users', {
          email: `${chance.word()}@wolox.co`,
          password: chance.string({ length: 8, alpha: true, numeric: true })
        });

        response = await request(app)
          .post('/admin/users')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET))
          .send(user.dataValues);
        done();
      });

      it('responses 201 created', () => {
        expect(response.statusCode).toEqual(201);
      });

      it('creates correctly the user', () => {
        expect(parseInt(response.body.id)).toEqual(2);
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
        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: true
        });

        user = await factory.build('users', {
          email: `${chance.word()}@wolox.co`,
          password: chance.string({ length: 3, alpha: true, numeric: true })
        });

        response = await request(app)
          .post('/admin/users')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET))
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

    describe('when user email exists', () => {
      beforeEach(async done => {
        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: true
        });

        const userCreated = await factory.create('users', {
          email: `${chance.word()}@wolox.co`,
          password: chance.string({ length: 8, alpha: true, numeric: true }),
          administrator: false
        });

        user = await factory.build('users', {
          email: userCreated.email,
          password: chance.string({ length: 8, alpha: true, numeric: true }),
          administrator: true
        });

        response = await request(app)
          .post('/admin/users')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET))
          .send(user.dataValues);
        done();
      });

      it('responses 204 no content', () => {
        expect(response.statusCode).toEqual(204);
      });
    });

    describe('when does not send user data', () => {
      beforeEach(async done => {
        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: true
        });

        response = await request(app)
          .post('/admin/users')
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET))
          .send({});
        done();
      });

      it('responses 422 error', () => {
        expect(response.statusCode).toEqual(422);
      });
    });
  });
});
