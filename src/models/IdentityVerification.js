import mongoose from 'mongoose';

const IdentityVerificationSchema = new mongoose.Schema({
  file1Url: String,
  file2Url: String,
  confirmationKey: String,
  walletAddress: String,
});

export default mongoose.models.IdentityVerification ||
  mongoose.model('IdentityVerification', IdentityVerificationSchema);
