const models = require('../../app/models');

exports.create = params => models.users.create(params);
exports.findByEmail = email => models.users.findByEmail(email);
