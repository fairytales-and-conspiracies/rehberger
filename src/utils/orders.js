import sendMail from '@/lib/sendMail';
import emailTypes from '@/static-data/email-types';
import niceInvoice from '@/templates/niceInvoice';

const { SERVER_URL } = process.env;

export const orderFramesMongoFilter = (frames) => {
  const filter = { _id: { $in: [] } };
  frames.forEach(async (frame) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = frame._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    filter._id.$in.push(id);
  });
  return filter;
};


export const sendMailForPurchasedOrder = (order, frames) => {
  const invoice = niceInvoice(order, frames);
  const attachments = [
    { filename: 'Invoice.pdf', content: invoice },
    { filename: 'Terms.pdf', path: `${SERVER_URL}/doc/terms.pdf` },
  ];
  sendMail(emailTypes.NFTsPurchased, { order, frames }, attachments).catch(
    console.error
  );
};