import { authService } from '../services/authService.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await authService.signup(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid email or password ') {
      return res.status(401).json({ error : error.message });
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};