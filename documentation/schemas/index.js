const user = require('./user');
const administrator = require('./administrator');
const weet = require('./weet');

module.exports = {
  ...administrator,
  ...user,
  ...weet,
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
