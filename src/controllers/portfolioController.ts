import { Response } from 'express';
import PortfolioData from '../models/PortfolioData';
import { AuthRequest } from '../middleware/auth';

export const getPortfolio = async (_req: AuthRequest, res: Response) => {
  try {
    const data = await PortfolioData.findOne().sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ message: 'Portfolio data not found' });
    res.json({ message: 'OK', data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const upsertPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await PortfolioData.findOne({ adminId: req.userId });
    if (existing) {
      Object.assign(existing, req.body, { updatedAt: new Date() });
      await existing.save();
      return res.json({ message: 'Portfolio updated', data: existing });
    }
    const created = await PortfolioData.create({ ...req.body, adminId: req.userId });
    res.status(201).json({ message: 'Portfolio created', data: created });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
