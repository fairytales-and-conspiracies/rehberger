import mongoose from 'mongoose';

const IdentityVerificationSchema = new mongoose.Schema({
  file1Url: String,
  file2Url: String,
  orderNumber: String,
  walletAddress: String,
});

module.exports =
  mongoose.models.IdentityVerification ||
  mongoose.model('IdentityVerification', IdentityVerificationSchema);
