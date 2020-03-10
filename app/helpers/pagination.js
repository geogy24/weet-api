module.exports = (model, fields, page, limit) =>
  new Promise((resolve, reject) => {
    model
      .findAll({
        attributes: fields,
        limit: limit || process.env.PAGINATION_LIMIT,
        offset: (page - 1) * (limit || process.env.PAGINATION_LIMIT),
        order: [['id', 'ASC']]
      })
      .then(async records => {
        const total = await model.count();
        resolve({
          records,
          page: parseInt(page),
          total: Math.ceil(total / limit)
        });
      })
      .catch(error => {
        reject(error);
      });
  });
