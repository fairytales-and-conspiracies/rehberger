import mongoose from 'mongoose';

const EmailSignupSchema = new mongoose.Schema({
  email: String,
  timestamp: Number,
});

export default mongoose.models.EmailSignup ||
  mongoose.model('EmailSignup', EmailSignupSchema);
