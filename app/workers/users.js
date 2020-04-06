const { CronJob } = require('cron');

const models = require('../../app/models');
const sendEmail = require('../helpers/sendEmail');

module.exports = new CronJob(
  '00 00 * * * *',
  () => {
    console.info('Get user with max weets on this day');
    models.weets
      .userHaveMaxQuantityWeets()
      .then(records => {
        console.info('Send email');
        sendEmail({
          receiver: records[0].dataValues.user.dataValues.email,
          subject: `${records[0].dataValues.user.dataValues.name} Felicitaciones!`,
          text: 'Hoy has sido la persona que mas a weeteado!',
          html: '<b>Hoy has sido la persona que mas a weeteado!</b>'
        });
        console.info('Email send it');
      })
      .catch(error => {
        console.log(error);
      });
  },
  null,
  true,
  'America/Los_Angeles'
);
