const axios = require('axios');
const models = require('../models');

const baseUrl = 'http://numbersapi.com/random/year';

exports.create = params => models.weets.create(params);
exports.weet = () => axios.get(baseUrl);
