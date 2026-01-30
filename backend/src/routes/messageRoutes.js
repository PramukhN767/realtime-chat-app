import express from 'express';
import { sendMessage, getConversation, getUserConversations } from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', authenticate, sendMessage);
router.get('/conversation/:otherUserId', authenticate, getConversation);
router.get('/conversations', authenticate, getUserConversations);

export default router;