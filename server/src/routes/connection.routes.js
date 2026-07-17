import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
  sendConnectionRequest,
  getPendingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionStatus,
  getPendingCount,
  getConnectionsList, // ◄ Make sure this controller function is imported!
   // ◄ Make sure this controller function is imported!
} from '../controllers/connection.controller.js';

const router = express.Router();

// All these paths will be clean relative sub-paths
router.post('/connect/:id', protectRoute, sendConnectionRequest);
router.get('/pending', protectRoute, getPendingRequests);
router.get('/status/:targetId', protectRoute, getConnectionStatus); // ◄ Frontend calls this!
router.put('/accept/:id', protectRoute, acceptConnectionRequest);
router.put('/reject/:id', protectRoute, rejectConnectionRequest);
router.get('/pending-count', protectRoute, getPendingCount); // ◄ New route for pending request count
router.get('/list', protectRoute, getConnectionsList); // ◄ New route for getting connections list
export default router;