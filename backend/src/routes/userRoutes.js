import express from 'express';
import { getAllUsers, searchUsers, getUserById } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/search', authenticate, searchUsers);
router.get('/:userId', authenticate, getUserById);

export default router;