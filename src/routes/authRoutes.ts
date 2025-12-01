import { Router } from 'express';
import { register, login, getProfile, updateProfile, updateResume } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/resume', authenticateToken, updateResume);

export default router;
