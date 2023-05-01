const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const pug = require('pug');
const path = require('path');
const { convert } = require('html-to-text');

module.exports.sendEmail = (email, tokenVerify) => {
  const url = `http://localhost:3000/api/users/verify/${tokenVerify}`;
  const html = pug.renderFile(
    path.join(__dirname, '..', 'views', `verify.pug`),
    {
      url,
    }
  );

  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  };

  const transporter = nodemailer.createTransport(mg(auth));

  const mailOptions = {
    from: 'smagrovich58@meta.ua',
    to: `${email}`,
    subject: `Verification email`,
    html,
    text: convert(html),
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log('Email sent');
    }
  });
};
