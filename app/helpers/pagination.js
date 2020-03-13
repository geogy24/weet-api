module.exports = (model, fields, page, limit) =>
  new Promise((resolve, reject) => {
    model
      .findAll({
        attributes: fields,
        limit: limit || process.env.PAGINATION_LIMIT,
        offset: ((page || process.env.PAGINATION_PAGE) - 1) * (limit || process.env.PAGINATION_LIMIT),
        order: [['id', 'ASC']]
      })
      .then(async records => {
        const total = await model.count();
        resolve({
          records,
          page: parseInt(page || process.env.PAGINATION_PAGE),
          total: Math.ceil(total / (limit || process.env.PAGINATION_LIMIT))
        });
      })
      .catch(error => {
        reject(error);
      });
  });
