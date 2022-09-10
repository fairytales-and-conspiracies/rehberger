import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
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
  quantity: Number,
  framePriceETH: Number,
  framePriceUSD: Number,
  netPriceETH: Number,
  netPriceUSD: Number,
  totalPriceETH: Number,
  totalPriceUSD: Number,
  paymentMethod: String,
  transactionHash: String,
  noSecurityQuestion: Boolean,
  question: String,
  answer: String,
  transactionStatus: String,
  confirmationKey: String,
  toBeClaimed: Boolean,
  claimed: Boolean,
  orderCreatedTimestamp: String,
  transactionSuccessfulTimestamp: String,
  claimedTimestamp: String,
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
