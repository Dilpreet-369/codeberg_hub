import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Connects this message to its specific room shell
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true, // Speeds up chronological page streaming logs
    },
    // Traces who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The raw message body string
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);