const user = require('./user');
const administrator = require('./administrator');
const weet = require('./weet');

module.exports = {
  ...user,
  ...administrator,
  ...weet
};
