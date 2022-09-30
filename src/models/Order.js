import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    company: String,
    vatNo: String,
    firstName: String,
    lastName: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    country: String,
    region: String,
    city: String,
    postalCode: String,
  },
  frames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Frame' }],
  failedFrames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Frame' }],
  quantity: Number,
  framePriceETH: Number,
  framePriceEUR: Number,
  netPriceETH: Number,
  netPriceEUR: Number,
  totalPriceETH: Number,
  totalPriceEUR: Number,
  vat: Number,
  paymentMethod: String,
  transactionHash: String,
  noSecurityQuestion: Boolean,
  question: String,
  answer: String,
  transactionStatus: String,
  confirmationKey: String,
  toBeClaimed: Boolean,
  claimed: Boolean,
  orderCreatedTimestamp: Number,
  transactionSuccessfulTimestamp: Number,
  claimedTimestamp: Number,
  orderNumber: Number,
  invoiceNumber: String,
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
