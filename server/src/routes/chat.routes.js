import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
  findOrCreateRoom,
  getRoomDetailsAndLogs,
  sendMessage,
} from '../controllers/chat.controller.js';

const router = express.Router();

// Route that runs when you click a connection block
router.post('/room', protectRoute, findOrCreateRoom);
router.get('/room/:chatId', protectRoute, getRoomDetailsAndLogs);

// 3. Send a message to a room (POST /chat/messages/send)
router.post('/send', protectRoute, sendMessage);

export default router;