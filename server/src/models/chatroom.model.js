import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    // Array containing exactly two User ObjectIds
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Virtual or structural reference to track the very last text for the inbox view
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

// IMPORTANT: Compound index to enforce rapid querying for existing 2-user rooms
chatRoomSchema.index({ participants: 1 });

export default mongoose.model("ChatRoom", chatRoomSchema);