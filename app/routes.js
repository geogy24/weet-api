const usersController = require('./controllers/users');
const usersMiddleware = require('./middlewares/users');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users/session', usersMiddleware.session, usersController.session);
  app.post('/users', usersMiddleware.create, usersController.create);
  app.get('/users', [usersMiddleware.verifySession, usersMiddleware.list], usersController.list);
};
