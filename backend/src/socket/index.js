import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/database.js';

const userSockets = new Map(); 

export const setupSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.userId);

    userSockets.set(socket.userId, socket.id);

    await updateUserStatus(socket.userId, true);

    socket.join(socket.userId);

    socket.broadcast.emit('user_status_changed', {
      userId: socket.userId,
      isOnline: true,
    });

    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content } = data;

        const message = await prisma.message.create({
          data: {
            content,
            senderId: socket.userId,
            recipientId,
          },
        });

        io.to(recipientId).emit('receive_message', message);

        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: error.message });
      }
    });

    socket.on('typing', (data) => {
      io.to(data.recipientId).emit('user_typing', {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.userId);
      userSockets.delete(socket.userId);
      await updateUserStatus(socket.userId, false);

      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        isOnline: false,
      });
    });
  });
};

async function updateUserStatus(userId, isOnline) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}