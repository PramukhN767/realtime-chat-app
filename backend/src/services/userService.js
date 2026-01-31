import { prisma } from '../config/database.js';

export const userService = {
  async getAllUsers(currentUserId) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
      orderBy: {
        username: 'asc',
      },
    });

    return users;
  },

  async searchUsers(currentUserId, searchQuery) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        OR: [
          {
            username: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: {
        username: 'asc',
      },
    });

    return users;
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};