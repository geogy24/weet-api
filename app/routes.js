const usersController = require('./controllers/users');
const adminsController = require('./controllers/admins');
const usersMiddleware = require('./middlewares/users');
const adminMiddleware = require('./middlewares/admins');
const weetsController = require('./controllers/weets');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/admin/users', [adminMiddleware.verifySession, adminMiddleware.create], adminsController.create);

  app.post('/users/session', usersMiddleware.session, usersController.session);
  app.post('/users', usersMiddleware.create, usersController.create);
  app.get('/users', [usersMiddleware.verifySession, usersMiddleware.list], usersController.list);

  app.post('/weets', usersMiddleware.verifySession, weetsController.create);
};
