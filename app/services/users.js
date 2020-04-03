const nodemailer = require('nodemailer');
const models = require('../../app/models');
const paginate = require('../helpers/pagination');

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
exports.sendEmail = receiver => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  transporter.sendMail(
    {
      from: process.env.MAIL_USERNAME,
      to: receiver.email,
      subject: `Bienvenido ${receiver.name}`,
      text: 'El equipo de relaciones te da la bienvenida a nuestro servicio',
      html: '<b>El equipo de relaciones te da la bienvenida a nuestro servicio</b>'
    },
    (error, information) => {
      if (error) {
        console.log(error); // eslint-disable-line no-console
      } else {
        console.log('Message sent: %s', information.messageId); // eslint-disable-line no-console
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(information)); // eslint-disable-line no-console
      }
    }
  );
};
