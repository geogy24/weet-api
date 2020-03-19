const models = require('../../app/models');

exports.create = params => models.users.create(params);
