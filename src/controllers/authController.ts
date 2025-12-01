import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { generateToken } from '../utils/helpers';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password, role: 'viewer' });
    await user.save();

    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, profile, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 'profile.resume': resumeUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
