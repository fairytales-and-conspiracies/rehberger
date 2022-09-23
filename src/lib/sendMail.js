import emailTypes from '@/static-data/email-types';
import {
  nftsClaimedTemplate,
  nftsPurchasedTemplate,
} from '@/templates/nftsEmailTemplates';

const nodemailer = require('nodemailer');

const createMailBody = (data) => {
  const { claimed, customer, paymentMethod } = data;
  const isWalletPayment = paymentMethod === 'WALLET';
  const key = isWalletPayment ? data.transactionHash : data.confirmationKey;
  return `
    <p>${
      !claimed
        ? 'Here are the details of the purchase:'
        : 'Your NFT has been claimed:'
    }</p>

    <ul>
      <li>First name: ${customer.firstName}</li>
      <li>Last name: ${customer.lastName}</li>
      <li>Email: ${customer.email}</li>
      <li>Address line 1: ${customer.addressLine1}</li>
      <li>Address line 2: ${customer.addressLine2}</li>
      <li>Country: ${customer.country}</li>
      <li>Region: ${customer.region}</li>
      <li>City: ${customer.city}</li>
      <li>Postal code: ${customer.postalCode}</li>
    </ul>

    ${
      !claimed
        ? `<p>${
            isWalletPayment
              ? `<a href="https://rinkeby.etherscan.io/tx/${key}" target="_blank">Take a look at your transaction.</a>`
              : `<a href="http://localhost:3000/claim-nfts?confirmation-key=${key}" target="_blank">Click here to claim your NFTs</a>`
          }</p>`
        : ''
    }
  `;
};

const createMailObject = (emailType, data, attachments) => {
  const { order } = data;
  const { customer } = order;

  if (emailType === emailTypes.NFTsPurchased) {
    return {
      from: 'bulatovic_nikola@yahoo.com', // sender address
      to: customer.email, // list of receivers
      subject: 'NFTs purchased!', // Subject line
      html: nftsPurchasedTemplate(data),
      attachments,
    };
  }

  if (emailType === emailTypes.NFTsClaimed) {
    return {
      from: 'bulatovic_nikola@yahoo.com', // sender address
      to: customer.email, // list of receivers
      subject: 'NFTs claimed!', // Subject line
      html: nftsClaimedTemplate(data),
    };
  }

  return {
    from: 'bulatovic_nikola@yahoo.com', // sender address
    to: 'bulatovic_nikola@yahoo.com', // list of receivers
    subject: 'TEST', // Subject line
    html: createMailBody(data),
  };
};

async function main(emailType, data, attachments) {
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

  let info;
  if (
    emailType === emailTypes.NFTsPurchased ||
    emailType === emailTypes.NFTsClaimed
  ) {
    info = await transporter.sendMail(
      createMailObject(emailType, data, attachments)
    );
  } else {
    info = await transporter.sendMail({
      from: 'Rehberger app',
      to: 'bulatovicnikola1990@gmail.com',
      subject: 'Error with purchase',
      text: `
        For some reason, there was an error with the purchase:

        ${data}
      `,
    });
  }

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default main;
