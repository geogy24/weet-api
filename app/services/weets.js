const axios = require('axios');

const models = require('../models');
const paginate = require('../helpers/pagination');

const baseUrl = 'http://numbersapi.com/random/year';

exports.create = params => models.weets.create(params);
exports.weet = () => axios.get(baseUrl);
exports.paginate = (page, limit) => paginate(models.weets, { attributes: ['id', 'content'] }, page, limit);
exports.rating = (userId, weetId, score) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const transaction = await models.sequelize.transaction();

    try {
      const rating = await models.ratings.findOne({ where: { userId, weetId: parseInt(weetId) } });

      if (rating) {
        // eslint-disable-next-line no-negated-condition
        if (rating.dataValues.score !== score) {
          rating.score = score;
          await rating.save({ fields: ['score'], transaction });
        }
      } else {
        await models.ratings.create({ userId, weetId: parseInt(weetId), score });
      }

      await transaction.commit();
      resolve();
    } catch (error) {
      if (transaction.rollback) await transaction.rollback();
      reject(error);
    }
  });
