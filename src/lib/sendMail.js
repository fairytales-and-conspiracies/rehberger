'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main(success, data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'bulatovic_nikola@yahoo.com', // generated ethereal user
      pass: 'bgkjzuvodayxrqkb', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info;
  if (success) {
    info = await transporter.sendMail({
      from: 'bulatovic_nikola@yahoo.com', // sender address
      to: 'bulatovicnikola1990@gmail.com', // list of receivers
      subject: 'NFT purchased!', // Subject line
      text: `
        Here are the details of the purchase:
  
        First name: ${data.firstName}
        Last name: ${data.lastName}
        Address line 1: ${data.addressLine1}
        Address line 2: ${data.addressLine2}
        Country: ${data.country}
        Region: ${data.region}
        City: ${data.city}
        Postal code: ${data.postalCode}
      `, // plain text body
      // html: '<b>Hello world?</b>', // html body
    });
  } else {
    info = await transporter.sendMail({
      from: 'Rehberger app', // sender address
      to: 'bulatovicnikola1990@gmail.com', // list of receivers
      subject: 'Error with purchase', // Subject line
      text: `
        For some reason, there was an error with the purchase:

        ${data}
      `, // plain text body
      // html: '<b>Hello world?</b>', // html body
    });
  }

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default main;
