/*  eslint max-lines: ["error", 500]  */

const request = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const Chance = require('chance');
const jwt = require('jwt-simple');
const nock = require('nock');

const app = require('../app');
const { factoryByModel } = require('./factory/factory_by_models');
const models = require('../app/models');

const chance = new Chance();
let userLogged = null;
let response = null;
let weets = null;
let weet = null;
let score = null;
let rating = null;

factoryByModel('users');
factoryByModel('weets');
factoryByModel('ratings');

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

describe('/weets#list', () => {
  describe('when have not session', () => {
    beforeEach(async done => {
      response = await request(app)
        .get('/weets')
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
      userLogged = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
        administrator: false
      });

      weets = await factory.createMany('weets', 5, {
        userId: userLogged.dataValues.id
      });

      response = await request(app)
        .get('/weets')
        .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
      done();
    });

    it('responses 200 ok', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('returns correct quantity of records', () => {
      expect(response.body.records.length).toEqual(5);
    });

    it('returns correct records', () => {
      const createdWeetIds = weets.map(createdWeet => createdWeet.dataValues.id).sort();
      const responseWeetIds = response.body.records.map(responseWeet => responseWeet.id).sort();
      expect(responseWeetIds).toEqual(createdWeetIds);
    });
  });

  describe('when send page or limit', () => {
    beforeEach(async done => {
      userLogged = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
        administrator: false
      });

      weets = await factory.createMany('weets', 5, {
        userId: userLogged.dataValues.id
      });

      response = await request(app)
        .get('/weets')
        .query({
          page: 1,
          limit: 10
        })
        .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
      done();
    });

    it('responses 200 ok', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('returns correct quanitity of records', () => {
      expect(response.body.records.length).toEqual(5);
    });

    it('returns correct records', () => {
      const createdWeetIds = weets.map(createdWeet => createdWeet.dataValues.id).sort();
      const responseWeetIds = response.body.records.map(responseWeet => responseWeet.id).sort();
      expect(responseWeetIds).toEqual(createdWeetIds);
    });
  });

  describe('when send invalid page', () => {
    beforeEach(async done => {
      userLogged = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
        administrator: false
      });

      weets = await factory.createMany('weets', 5, {
        userId: userLogged.dataValues.id
      });

      response = await request(app)
        .get('/weets')
        .query({
          page: '@!#$',
          limit: 10
        })
        .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
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
      userLogged = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
        administrator: false
      });

      weets = await factory.createMany('weets', 5, {
        userId: userLogged.dataValues.id
      });

      response = await request(app)
        .get('/weets')
        .query({
          page: 1,
          limit: '@!#$'
        })
        .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
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

describe('/weets/:id/rating#rating', () => {
  describe('when have not session', () => {
    beforeEach(async done => {
      response = await request(app).post(`/weets/${chance.string({ length: 8, numeric: true })}/rating`);
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

  describe('when not send correct score', () => {
    beforeEach(async done => {
      userLogged = await factory.create('users', {
        password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
        administrator: false
      });

      weet = await factory.create('weets', { userId: userLogged.dataValues.id });

      response = await request(app)
        .post(`/weets/${weet.dataValues.id}/rating`)
        .send({ score: 0 })
        .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
      done();
    });

    it('responses 422 unprocessable entity', () => {
      expect(response.statusCode).toEqual(422);
    });

    it('shows correct error', () => {
      const error = {
        errors: [{ location: 'body', msg: 'score must be different to zero', param: 'score', value: 0 }]
      };
      expect(response.body).toEqual(error);
    });
  });

  describe('when send correct score', () => {
    describe('when not exists a record', () => {
      beforeEach(async done => {
        score = chance.integer({ min: 1, max: 10 });

        userLogged = await factory.create('users', {
          password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
          administrator: false
        });

        weet = await factory.create('weets', { userId: userLogged.dataValues.id });

        response = await request(app)
          .post(`/weets/${weet.dataValues.id}/rating`)
          .send({ score })
          .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
        done();
      });

      it('responses 200 ok', () => {
        expect(response.statusCode).toEqual(200);
      });

      it('creates record with score value', async () => {
        const ratingRecord = await models.ratings.findOne({
          where: { userId: userLogged.dataValues.id, weetId: weet.dataValues.id }
        });
        expect(score).toEqual(ratingRecord.dataValues.score);
      });
    });

    describe('when exists a record', () => {
      describe('when not change score', () => {
        beforeEach(async done => {
          score = chance.integer({ min: 1, max: 10 });

          userLogged = await factory.create('users', {
            password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
            administrator: false
          });

          weet = await factory.create('weets', { userId: userLogged.dataValues.id });

          rating = await factory.create('ratings', {
            userId: userLogged.dataValues.id,
            weetId: weet.dataValues.id,
            score
          });

          response = await request(app)
            .post(`/weets/${weet.dataValues.id}/rating`)
            .send({ score })
            .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
          done();
        });

        it('responses 200 ok', () => {
          expect(response.statusCode).toEqual(200);
        });

        it('find existing record', async () => {
          const ratingRecord = await models.ratings.findOne({
            where: { userId: userLogged.dataValues.id, weetId: weet.dataValues.id }
          });
          expect(rating.dataValues.id).toEqual(ratingRecord.dataValues.id);
        });

        it('does not change score', async () => {
          const ratingRecord = await models.ratings.findOne({
            where: { userId: userLogged.dataValues.id, weetId: weet.dataValues.id }
          });
          expect(score).toEqual(ratingRecord.dataValues.score);
        });
      });

      describe('when change score', () => {
        beforeEach(async done => {
          score = chance.integer({ min: 1, max: 10 });

          userLogged = await factory.create('users', {
            password: bcrypt.hashSync(chance.string({ length: 8, numeric: true }), 2),
            administrator: false
          });

          weet = await factory.create('weets', { userId: userLogged.dataValues.id });

          rating = await factory.create('ratings', {
            userId: userLogged.dataValues.id,
            weetId: weet.dataValues.id,
            score: score + 1
          });

          response = await request(app)
            .post(`/weets/${weet.dataValues.id}/rating`)
            .send({ score })
            .set('authorization', jwt.encode(userLogged.dataValues, process.env.SECRET));
          done();
        });

        it('responses 200 ok', () => {
          expect(response.statusCode).toEqual(200);
        });

        it('find existing record', async () => {
          const ratingRecord = await models.ratings.findOne({
            where: { userId: userLogged.dataValues.id, weetId: weet.dataValues.id }
          });
          expect(rating.dataValues.id).toEqual(ratingRecord.dataValues.id);
        });

        it('change score', async () => {
          const ratingRecord = await models.ratings.findOne({
            where: { userId: userLogged.dataValues.id, weetId: weet.dataValues.id }
          });
          expect(score).toEqual(ratingRecord.dataValues.score);
        });
      });
    });
  });
});
