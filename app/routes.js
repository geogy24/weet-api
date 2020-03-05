require('express-group-routes');
const usersController = require('./controllers/users');
const usersMiddleware = require('./middlewares/users');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);

  app.group('/api/v1', router => {
    router.post('/users', usersMiddleware.create, usersController.create);
  });
};
