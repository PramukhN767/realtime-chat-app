import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  async signup(username, email, password) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where : { email }
    });

    if (!user) {
      throw new error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new error('Invalid email or password');
    }

    const token = generateToken(user.id);

    const { password : _, ...userWithoutPassword } = user;

    return {
      user : userWithoutPassword,
      token,
    };
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
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