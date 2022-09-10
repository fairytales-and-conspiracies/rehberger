import mongoose from 'mongoose';

const FrameSchema = new mongoose.Schema({
  video: String,
  frame: Number,
  time: Number,
  sold: Boolean,
});

export default mongoose.models.Frame || mongoose.model('Frame', FrameSchema);
