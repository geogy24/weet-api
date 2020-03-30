const axios = require('axios');

const models = require('../models');
const paginate = require('../helpers/pagination');

const baseUrl = 'http://numbersapi.com/random/year';

exports.create = params => models.weets.create(params);
exports.weet = () => axios.get(baseUrl);
exports.paginate = (page, limit) => paginate(models.weets, ['id', 'content'], page, limit);
