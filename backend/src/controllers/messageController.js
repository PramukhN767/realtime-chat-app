import { messageService } from '../services/messageService.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id; // From auth middleware

    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const message = await messageService.sendMessage(senderId, recipientId, content);
    res.status(201).json(message);
  } catch (error) {
    if (error.message === 'Recipient not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID is required' });
    }

    const messages = await messageService.getConversation(userId, otherUserId);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};