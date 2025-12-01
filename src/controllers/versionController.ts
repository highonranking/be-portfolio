import axios from 'axios';
import { Request, Response } from 'express';

export const getLatestRelease = async (req: Request, res: Response) => {
  try {
    const owner = process.env.GITHUB_OWNER || 'highonranking';
    const defaultRepo = process.env.FRONTEND_REPO || 'be-portfolio';
    const repo = (req.query.repo as string) || defaultRepo;
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = { 'Accept': 'application/vnd.github+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    const { data } = await axios.get(url, { headers });

    return res.json({
      tag: data.tag_name,
      name: data.name,
      publishedAt: data.published_at,
      url: data.html_url,
    });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'Failed to fetch latest release';
    return res.status(status).json({ error: message });
  }
};
