import { Router } from 'express';
import {
  getMediumBlogs,
  getGithubRepos,
  getLinkedInPosts,
  syncExternalContent,
} from '../controllers/externalContentController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/medium', getMediumBlogs);
router.get('/github', getGithubRepos);
router.get('/linkedin', getLinkedInPosts);
router.post('/sync', authenticateToken, authorize(['admin']), syncExternalContent);

export default router;
