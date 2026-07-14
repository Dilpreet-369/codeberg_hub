import Connection from '../models/connection.model.js';
import User from '../models/user.model.js';

/**
 * @desc    Send a connection request to another user
 * @route   POST /api/users/connect/:id
 */
export const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id; // Populated by your protectRoute middleware
    const receiverId = req.params.id;

    // 1. Prevent self-connection attempts
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a connection request to yourself.",
      });
    }

    // 2. Check if the target user actually exists
    const targetUser = await User.findById(receiverId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "The user you are trying to connect with does not exist.",
      });
    }

    // 3. Check for any pre-existing connection history between these two users
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: "You are already connected with this user.",
        });
      }
      if (existingConnection.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: "A connection request is already pending between you two.",
        });
      }
      
      // If it was previously rejected, let's reset it to pending and swap sender if needed
      if (existingConnection.status === 'rejected') {
        existingConnection.sender = senderId;
        existingConnection.receiver = receiverId;
        existingConnection.status = 'pending';
        await existingConnection.save();

        return res.status(200).json({
          success: true,
          message: "Connection request resent successfully.",
          data: existingConnection,
        });
      }
    }

    // 4. Create fresh pending connection record
    const newConnection = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully.",
      data: newConnection,
    });
  } catch (error) {
    console.error("Error in sendConnectionRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending connection request.",
    });
  }
};

/**
 * @desc    Fetch pending incoming requests for the logged-in user (Network Tab)
 * @route   GET /api/users/connections/pending
 */
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find requests where the current user is the receiver and status is pending
    // We populate the sender field with all their core identity fields
    const pendingRequests = await Connection.find({
      receiver: userId,
      status: 'pending',
    }).populate('sender', 'fullname username email workOrStudy bio');

    return res.status(200).json({
      success: true,
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Error in getPendingRequests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching pending requests.",
    });
  }
};


export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const connectionId = req.params.id; // The ID of the connection document

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found.",
      });
    }

    // Ensure the current user is authorized to accept this request (they must be the receiver)
    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this connection request.",
      });
    }

    if (connection.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: "This connection has already been accepted.",
      });
    }

    // Update connection state to accepted
    connection.status = 'accepted';
    await connection.save();

    // OPTIONAL: Add each other to your User document connections list for fast lookup
    await User.findByIdAndUpdate(connection.sender, { $addToSet: { connections: connection.receiver } });
    await User.findByIdAndUpdate(connection.receiver, { $addToSet: { connections: connection.sender } });

    return res.status(200).json({
      success: true,
      message: "Connection request accepted successfully.",
      data: connection,
    });
  } catch (error) {
    console.error("Error in acceptConnectionRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while accepting connection.",
    });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const connectionId = req.params.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found.",
      });
    }

    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this connection request.",
      });
    }

    connection.status = 'rejected';
    await connection.save();

    return res.status(200).json({
      success: true,
      message: "Connection request declined successfully.",
    });
  } catch (error) {
    console.error("Error in rejectConnectionRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while rejecting connection.",
    });
  }
};

// Add this controller inside backend controller/connection.controller.js
export const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.targetId;

    const connection = await Connection.findOne({
      $or: [
        { sender: userId, receiver: targetId },
        { sender: targetId, receiver: userId }
      ]
    });

    return res.status(200).json({
      success: true,
      data: connection || null // Returns null if they have never initiated a request
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
