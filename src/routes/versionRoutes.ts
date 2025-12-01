import { Router } from 'express';
import { getLatestRelease } from '../controllers/versionController';

const router = Router();

// GET /api/version?repo=<repoName>
router.get('/', getLatestRelease);

export default router;
