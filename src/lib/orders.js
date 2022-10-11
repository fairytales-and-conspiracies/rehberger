import sendMail from '@/lib/sendMail';
import uploadFile from '@/lib/s3';
import Order from '@/models/Order';
import emailTypes from '@/static-data/email-types';
import niceInvoice from '@/templates/niceInvoice';
import { formatDateForInvoiceNameFromTimestamp } from '@/utils/date';

const { INVOICE_UPLOAD_RETRY_LIMIT, SERVER_URL } = process.env;

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

export const getNextOrderNumber = async () => {
  const orderArr = await Order.find().sort('-orderNumber').limit(1);
  const order = orderArr[0];
  if (!order || !order.orderNumber) {
    return 1;
  }

  return order.orderNumber + 1;
};
export const uploadInvoice = async (order, frames, retryCount) => {
  const invoice = niceInvoice(order, frames);
  const retryCountActual = retryCount || 0;
  try {
    const invoiceFilename = `Invoice_${
      order.invoiceNumber
    }_${formatDateForInvoiceNameFromTimestamp(
      order.transactionSuccessfulTimestamp || order.orderCreatedTimestamp
    )}.pdf`;
    await uploadFile(invoice, invoiceFilename);
  } catch (err) {
    if (retryCountActual < INVOICE_UPLOAD_RETRY_LIMIT) {
      setTimeout(async () => {
        await uploadInvoice(invoice, retryCountActual + 1);
      }, 20000 * (retryCountActual + 1));
    }
  }
};

export const sendMailForPurchasedOrder = async (order, frames) => {
  const invoice = niceInvoice(order, frames);
  const attachments = [
    { filename: 'Invoice.pdf', content: invoice },
    { filename: 'Terms.pdf', path: `${SERVER_URL}/doc/terms.pdf` },
  ];
  return sendMail(
    emailTypes.NFTsPurchased,
    { order, frames },
    attachments
  ).catch(console.error);
};

export const finishOrder = async (order, frames) => {
  await uploadInvoice(order, frames);
  await sendMailForPurchasedOrder(order, frames);
};
