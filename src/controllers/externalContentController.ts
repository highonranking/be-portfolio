import { Response } from 'express';
import ExternalContent from '../models/ExternalContent';
import { AuthRequest } from '../middleware/auth';
import { ExternalContentService } from '../services/externalContent';

export const getMediumBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const blogs = await ExternalContent.find({ type: 'medium' })
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await ExternalContent.countDocuments({ type: 'medium' });

    res.json({
      data: blogs,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGithubRepos = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const repos = await ExternalContent.find({ type: 'github' })
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await ExternalContent.countDocuments({ type: 'github' });

    res.json({
      data: repos,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLinkedInPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const posts = await ExternalContent.find({ type: 'linkedin' })
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await ExternalContent.countDocuments({ type: 'linkedin' });

    res.json({
      data: posts,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const syncExternalContent = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body;

    const mediumUsername = process.env.MEDIUM_USERNAME;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME;
    const linkedinProfileUrl = process.env.LINKEDIN_PROFILE_URL;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (type === 'medium' || type === 'all') {
      if (mediumUsername) {
        await ExternalContentService.syncMediumBlogs(mediumUsername);
      }
    }

    if (type === 'github' || type === 'all') {
      if (githubToken && githubUsername) {
        await ExternalContentService.syncGithubRepos(githubToken, githubUsername);
      }
    }

    if (type === 'linkedin' || type === 'all') {
      if (linkedinProfileUrl) {
        await ExternalContentService.syncLinkedInPosts(linkedinProfileUrl, rapidApiKey);
      }
    }

    res.json({ message: 'External content synced successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
