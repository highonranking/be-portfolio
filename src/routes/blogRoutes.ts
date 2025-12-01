import { Router } from 'express';
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
} from '../controllers/blogController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, authorize(['admin']), createBlogPost);
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.put('/:id', authenticateToken, authorize(['admin']), updateBlogPost);
router.delete('/:id', authenticateToken, authorize(['admin']), deleteBlogPost);
router.post('/:id/like', likeBlogPost);

export default router;
