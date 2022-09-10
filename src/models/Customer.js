import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  country: String,
  region: String,
  city: String,
  postalCode: String,
});

export default mongoose.models.Customer ||
  mongoose.model('Customer', CustomerSchema);
