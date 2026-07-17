import ChatRoom from '../models/chatroom.model.js';
import Message from '../models/message.model.js';
// POST /api/messages/room
export const findOrCreateRoom = async (req, res) => {
  try {
    const myId = req.user._id; // Logged-in user from your auth cookie
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: 'Target user ID is required' });
    }

    // 1. Check if a room already exists with these exact two participants
    // $all ensures BOTH IDs are present in the participants array
    let room = await ChatRoom.findOne({
      participants: { $all: [myId, targetUserId] },
    });

    // 2. If no room exists, create a brand-new one
    if (!room) {
      room = await ChatRoom.create({
        participants: [myId, targetUserId],
      });
    }

    // 3. Return the room ID so the frontend can redirect to /messages/:chatId
    return res.status(200).json({
      success: true,
      chatId: room._id, // Frontend will read this value
    });
  } catch (error) {
    console.error('Error in findOrCreateRoom:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// In chat.controller.js
export const getRoomDetailsAndLogs = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    if (!chatId) {
      return res.status(400).json({
        success: false,
        error: 'Chat ID is required',
      });
    }

    // Find the chat room
    const chatRoom = await ChatRoom.findById(chatId).populate(
      'participants',
      'fullname avatar status',
    );

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found',
      });
    }

    // Get the other participant
    const partner = chatRoom.participants.find(
      (p) => p._id.toString() !== userId.toString(),
    );

    // Get messages
    const messages = await Message.find({ chatRoomId: chatId })
      .populate('sender', 'fullname avatar')
      .sort({ createdAt: 1 });

    // ─── FORMAT MESSAGES FOR FRONTEND ───
    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(), // MongoDB _id → id
      senderId: msg.sender._id.toString(),
      senderName: msg.sender.fullname,
      timestamp: msg.createdAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }), // Format time as "2:30 PM"
      text: msg.text,
      type: 'text', // You can add logic for other types
      // Include avatar if needed
      senderAvatar: msg.sender.avatar || '',
    }));

    res.status(200).json({
      success: true,
      messages: formattedMessages, // ← Send formatted messages
      partner: partner || null,
    });
  } catch (error) {
    console.error('Error in getRoomDetailsAndLogs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load chat details',
    });
  }
};

// ─── 3. SEND A NEW MESSAGE ───
// POST /api/chat/messages/send
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const sender = req.user?.id;

    if (!chatId || !text || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Create message
    const message = new Message({
      chatRoomId: chatId,
      sender: sender,
      text: text.trim(),
    });

    await message.save();

    // Populate sender details
    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'fullname avatar',
    );

    // ─── FORMAT THE RESPONSE ───
    const formattedMessage = {
      id: populatedMessage._id.toString(),
      senderId: populatedMessage.sender._id.toString(),
      senderName: populatedMessage.sender.fullname,
      timestamp: populatedMessage.createdAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: populatedMessage.text,
      type: 'text',
      senderAvatar: populatedMessage.sender.avatar || '',
    };

    // Update lastMessage
    await ChatRoom.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    res.status(201).json({
      success: true,
      data: formattedMessage, // ← Send formatted message
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};