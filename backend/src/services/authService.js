import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  async signup(username, email, password) {
    console.log('Signup called with:', { username, email });
    return { message: 'Signup endpoint - to be implemented' };
  },

  async login(email, password) {
    console.log('Login called with:', { email });
    return { message: 'Login endpoint - to be implemented' };
  },

  async getUserById(userId) {
    console.log('GetUser called with:', userId);
    return { message: 'GetUser endpoint - to be implemented' };
  },
};