const models = require('../../app/models');
const paginate = require('../helpers/pagination');
const sendEmail = require('../helpers/sendEmail');

exports.create = params => models.users.create(params);
exports.update = (where, params) => models.users.update(params, { where });
exports.findByEmail = email => models.users.findByEmail(email);
exports.count = () => models.users.count();
exports.paginate = (page, limit) => {
  const options = {
    attributes: {
      exclude: ['password']
    },
    include: [
      {
        model: models.ratings,
        attributes: []
      }
    ],
    order: [['id', 'ASC']],
    group: ['users.id'],
    subQuery: false
  };

  return paginate(models.users, options, page, limit);
};
exports.sendEmail = receiver =>
  sendEmail({
    receiver: receiver.email,
    subject: `Bienvenido ${receiver.name}`,
    text: 'El equipo de relaciones te da la bienvenida a nuestro servicio',
    html: '<b>El equipo de relaciones te da la bienvenida a nuestro servicio</b>'
  });
