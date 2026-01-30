import { prisma } from '../config/database.js';

export const messageService = {
  async sendMessage(senderId, recipientId, content) {
    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        recipientId,
      },
    });

    return message;
  },

  async getConversation(userId, otherUserId) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  },

  async getUserConversations(userId) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            lastSeen: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            email: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const usersMap = new Map();
    messages.forEach((message) => {
      const otherUser = message.senderId === userId ? message.recipient : message.sender;
      if (!usersMap.has(otherUser.id)) {
        usersMap.set(otherUser.id, {
          ...otherUser,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
        });
      }
    });

    return Array.from(usersMap.values());
  },
};