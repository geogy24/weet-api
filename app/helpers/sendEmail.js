const nodemailer = require('nodemailer');

module.exports = message => {
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
      to: message.receiver,
      subject: message.subject,
      text: message.text,
      html: message.html
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
