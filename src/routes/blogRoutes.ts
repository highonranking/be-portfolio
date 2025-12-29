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
// Add cache headers for blog list endpoint
router.get('/', (req, res, next) => {
  // Cache for 60 seconds (adjust as needed)
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=60');
  next();
}, getBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.put('/:id', authenticateToken, authorize(['admin']), updateBlogPost);
router.delete('/:id', authenticateToken, authorize(['admin']), deleteBlogPost);
router.post('/:id/like', likeBlogPost);

export default router;
