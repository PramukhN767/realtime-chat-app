import express from 'express';
import { 
  sendRequest, 
  getPendingRequests, 
  acceptRequest, 
  rejectRequest, 
  getContacts,
  checkContactStatus 
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', authenticate, sendRequest);
router.get('/requests', authenticate, getPendingRequests);
router.post('/accept/:requestId', authenticate, acceptRequest);
router.post('/reject/:requestId', authenticate, rejectRequest);
router.get('/', authenticate, getContacts);
router.get('/status/:otherUserId', authenticate, checkContactStatus);

export default router;