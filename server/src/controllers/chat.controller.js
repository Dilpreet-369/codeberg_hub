import ChatRoom from "../models/chatroom.model.js";
import Message from "../models/message.model.js";
// POST /api/messages/room
export const findOrCreateRoom = async (req, res) => {
  try {
    const myId = req.user._id; // Logged-in user from your auth cookie
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: "Target user ID is required" });
    }

    // 1. Check if a room already exists with these exact two participants
    // $all ensures BOTH IDs are present in the participants array
    let room = await ChatRoom.findOne({
      participants: { $all: [myId, targetUserId] }
    });

    // 2. If no room exists, create a brand-new one
    if (!room) {
      room = await ChatRoom.create({
        participants: [myId, targetUserId]
      });
    }

    // 3. Return the room ID so the frontend can redirect to /messages/:chatId
    return res.status(200).json({
      success: true,
      chatId: room._id // Frontend will read this value
    });
  } catch (error) {
    console.error("Error in findOrCreateRoom:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// In chat.controller.js
export const getRoomDetailsAndLogs = async (req, res) => {
  try {
    console.log("=== getRoomDetailsAndLogs called ===");
    console.log("Request params:", req.params);
    console.log("User object:", req.user);
    console.log("User ID:", req.user?.id);
    
    const { chatId } = req.params;
    const userId = req.user?.id; // Use optional chaining to avoid errors

    // ─── ADD THIS CHECK ───
    if (!userId) {
      console.error("User ID is missing from request!");
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    if (!chatId) {
      console.error("Chat ID is missing from params!");
      return res.status(400).json({
        success: false,
        error: "Chat ID is required",
      });
    }

    console.log("Looking for chat room:", chatId);
    console.log("For user:", userId);

    // Find the chat room
    const chatRoom = await ChatRoom.findById(chatId)
      .populate('participants', 'fullname avatar status');

    console.log("Found chat room:", chatRoom);

    if (!chatRoom) {
      console.log("Chat room not found");
      return res.status(404).json({
        success: false,
        error: "Chat room not found",
      });
    }

    // Get the other participant
    const partner = chatRoom.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );

    console.log("Found partner:", partner);

    // Get messages
    const messages = await Message.find({ chatRoomId: chatId })
      .populate('sender', 'fullname avatar')
      .sort({ createdAt: 1 });

    console.log("Found messages:", messages.length);

    res.status(200).json({
      success: true,
      messages: messages,
      partner: partner || null,
    });
  } catch (error) {
    console.error("Error in getRoomDetailsAndLogs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load chat details",
    });
  }
};

// ─── 3. SEND A NEW MESSAGE ───
// POST /api/chat/messages/send
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const myId = req.user._id;

    if (!chatId || !text?.trim()) {
      return res.status(400).json({ success: false, message: "Missing chatId or text" });
    }

    // Check if room exists and user is part of it
    const room = await ChatRoom.findById(chatId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const isMember = room.participants.some((p) => p.toString() === myId.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to post here" });
    }

    // Create the message document
    let newMessage = await Message.create({
      chatRoomId: chatId,
      sender: myId,
      text: text.trim(),
    });

    newMessage = await newMessage.populate("sender", "fullname profilePic");

    // Keep chatroom track updated with last message link
    room.lastMessage = newMessage._id;
    await room.save();

    // Return the formatted object that the UI expects to append
    const formattedMessage = {
      id: newMessage._id,
      senderId: "me",
      senderName: newMessage.sender.fullname,
      senderAvatar: newMessage.sender.profilePic || "",
      timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: newMessage.text,
      type: "text",
    };

    return res.status(201).json({ success: true, data: formattedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
};