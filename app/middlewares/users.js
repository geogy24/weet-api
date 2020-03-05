const { checkSchema } = require('express-validator');

exports.create = checkSchema({
  name: {
    exists: true
  },
  surname: {
    exists: true
  },
  email: {
    exists: true,
    isEmail: true,
    custom: {
      options: value => new RegExp(/\S+@wolox.\S+/).test(value),
      errorMessage: 'email must belong to wolox.co domain'
    }
  },
  password: {
    exists: true,
    isLength: {
      options: { min: 8 }
    },
    custom: {
      options: value => new RegExp(/^[a-zA-Z0-9]*$/).test(value),
      errorMessage: 'password must contain alphanumeric characters'
    }
  }
});
