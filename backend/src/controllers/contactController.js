import { contactService } from '../services/contactService.js';

export const sendRequest = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }

    const request = await contactService.sendRequest(senderId, recipientId);
    res.status(201).json(request);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already') || error.message.includes('Cannot send')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requests = await contactService.getPendingRequests(userId);
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    const request = await contactService.acceptRequest(requestId, userId);
    res.json(request);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Not authorized') || error.message.includes('already processed')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    const request = await contactService.rejectRequest(requestId, userId);
    res.json(request);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Not authorized') || error.message.includes('already processed')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await contactService.getContacts(userId);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const checkContactStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const status = await contactService.checkContactStatus(userId, otherUserId);
    res.json(status);
  } catch (error) {
    next(error);
  }
};