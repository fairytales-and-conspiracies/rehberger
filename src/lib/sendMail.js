import emailTypes from '@/static-data/email-types';
import {
  nftsClaimedTemplate,
  nftsPurchasedTemplate,
  securityQuestionForgottenTemplate,
} from '@/templates/nftsEmailTemplates';

const nodemailer = require('nodemailer');

const createMailObject = (to, subject, template, attachments) => ({
  from: process.env.SEND_EMAIL_FROM,
  to,
  bcc: process.env.SEND_EMAIL_BCC,
  subject,
  html: template,
  attachments,
});

async function main(emailType, data, attachments) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_EMAIL_SERVER,
    port: process.env.SEND_EMAIL_PORT,
    secure: process.env.SEND_EMAIL_SECURE,
    auth: {
      user: process.env.SEND_EMAIL_USER,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  });

  let info;
  if (emailType === emailTypes.NFTsPurchased) {
    const {
      order: { customer },
    } = data;

    try {
      info = await transporter.sendMail(
        createMailObject(
          customer.email,
          'NFTs purchased!',
          nftsPurchasedTemplate(data),
          attachments
        )
      );
    } catch (e) {
      return e;
    }
  } else if (emailType === emailTypes.NFTsClaimed) {
    const {
      order: { customer },
    } = data;

    info = await transporter.sendMail(
      createMailObject(
        customer.email,
        'NFTs claimed!',
        nftsClaimedTemplate(data),
        attachments
      )
    );
  } else if (emailType === emailTypes.SecurityQuestionForgotten) {
    info = await transporter.sendMail(
      createMailObject(
        process.env.SEND_EMAIL_RECEIVER,
        'Security question forgotten!',
        securityQuestionForgottenTemplate(data),
        attachments
      )
    );
  } else if (emailType === emailTypes.Test) {
    info = await transporter.sendMail({
      from: process.env.SEND_EMAIL_FROM, // sender address
      to: process.env.SEND_EMAIL_TEST_RECEIVER, // list of receivers
      subject: 'TEST', // Subject line
      text: 'hi',
    });
  } else {
    info = await transporter.sendMail({
      from: process.env.SEND_EMAIL_FROM,
      to: process.env.SEND_EMAIL_FROM,
      subject: 'Generic email',
      text: `This is a generic email`,
    });
  }

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return 'SUCCESS';
}

export default main;
