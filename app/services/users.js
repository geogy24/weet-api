const models = require('../../app/models');
const paginate = require('../helpers/pagination');

exports.create = params => models.users.create(params);
exports.update = (where, params) => models.users.update(params, { where });
exports.findByEmail = email => models.users.findByEmail(email);
exports.paginate = (page, limit) => paginate(models.users, ['id', 'name', 'surname', 'email'], page, limit);
