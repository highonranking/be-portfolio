import { Router } from 'express';
import { getPortfolio, upsertPortfolio } from '../controllers/portfolioController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getPortfolio);
router.put('/', authenticateToken, authorize(['admin']), upsertPortfolio);

export default router;
