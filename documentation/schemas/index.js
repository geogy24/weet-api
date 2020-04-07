const user = require('./user');
const admin = require('./admin');

module.exports = {
  ...admin,
  ...user,
  Error: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      },
      internal_code: {
        type: 'string'
      }
    }
  }
};
