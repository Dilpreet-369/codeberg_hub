import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Ensure a user cannot send duplicate requests to the same peer
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;
