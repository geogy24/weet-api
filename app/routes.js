const usersController = require('./controllers/users');
const adminsController = require('./controllers/admins');
const usersMiddleware = require('./middlewares/users');
const adminsMiddleware = require('./middlewares/admins');
const paginationsMiddleware = require('./middlewares/paginations');
const weetsController = require('./controllers/weets');

const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post(
    '/admin/users',
    [adminsMiddleware.verifySession, adminsMiddleware.create],
    adminsController.create
  );

  app.post('/users/session', usersMiddleware.session, usersController.session);
  app.post('/users', usersMiddleware.create, usersController.create);
  app.get('/users', [usersMiddleware.verifySession, paginationsMiddleware.pagination], usersController.list);

  app.post('/weets', usersMiddleware.verifySession, weetsController.create);
  app.get('/weets', [usersMiddleware.verifySession, paginationsMiddleware.pagination], weetsController.list);
};
