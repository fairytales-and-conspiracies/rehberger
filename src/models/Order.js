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
  paymentMethod: String,
  noSecurityQuestion: Boolean,
  question: String,
  answer: String,
  transactionStatus: String,
  confirmationNumber: String,
  claimed: Boolean,
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

/* 
  TODO
  In our order, we need to have a customer, the order parameters, and the frames - the actual nft info
  We need to add this stuff to the order
*/
