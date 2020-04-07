const nodemailer = require('nodemailer');

const usersService = require('../../app/services/users');

jest.mock('nodemailer', () => {
  const sendMail = jest.fn();
  const createTransport = jest.fn(() => ({ sendMail }));
  const mailer = jest.fn(() => createTransport);
  mailer.createTransport = createTransport;
  createTransport.sendMail = sendMail;
  return mailer;
});

describe('service#sendEmail', () => {
  describe('when send it correctly', () => {
    const receiver = { email: 'test@wolox.co', name: 'test' };

    it('have been call createTransport', () => {
      usersService.sendEmail(receiver);
      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(nodemailer.createTransport.sendMail).toHaveBeenCalled();
    });
  });
});
