import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  addressLine1: String,
  addressLine2: String,
  country: String,
  region: String,
  city: String,
  postalCode: String,
});

module.exports =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
