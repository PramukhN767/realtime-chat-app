import { prisma } from '../config/database.js';

export const contactService = {
  async sendRequest(senderId, recipientId) {
    if (senderId === recipientId) {
      throw new Error('Cannot send request to yourself');
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      throw new Error('User not found');
    }

    const existingRequest = await prisma.contactRequest.findFirst({
      where: {
        OR: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        throw new Error('Request already sent');
      }
      if (existingRequest.status === 'accepted') {
        throw new Error('Already contacts');
      }
      if (existingRequest.status === 'rejected') {
        const updated = await prisma.contactRequest.update({
          where: { id: existingRequest.id },
          data: { 
            status: 'pending',
            senderId,
            recipientId
          }
        });
        return updated;
      }
    }

    const request = await prisma.contactRequest.create({
      data: {
        senderId,
        recipientId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });

    return request;
  },

  async getPendingRequests(userId) {
    const requests = await prisma.contactRequest.findMany({
      where: {
        recipientId: userId,
        status: 'pending'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            lastSeen: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return requests;
  },

  async acceptRequest(requestId, userId) {
    const request = await prisma.contactRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.recipientId !== userId) {
      throw new Error('Not authorized to accept this request');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const updated = await prisma.contactRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' }
    });

    return updated;
  },

  async rejectRequest(requestId, userId) {
    const request = await prisma.contactRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.recipientId !== userId) {
      throw new Error('Not authorized to reject this request');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const updated = await prisma.contactRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' }
    });

    return updated;
  },

  async getContacts(userId) {
    const requests = await prisma.contactRequest.findMany({
      where: {
        status: 'accepted',
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            lastSeen: true,
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            lastSeen: true,
          }
        }
      }
    });

    const contacts = requests.map(request => {
      return request.senderId === userId ? request.recipient : request.sender;
    });

    return contacts;
  },

  async checkContactStatus(userId, otherUserId) {
    const request = await prisma.contactRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId }
        ]
      }
    });

    if (!request) {
      return { status: 'none', canSendRequest: true };
    }

    return {
      status: request.status,
      requestId: request.id,
      isSender: request.senderId === userId,
      canSendRequest: false
    };
  }
};