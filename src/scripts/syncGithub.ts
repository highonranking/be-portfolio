import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { ExternalContentService } from '../services/externalContent';

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME;

    if (!githubToken || !githubUsername) {
      console.error('GitHub token or username not configured in .env');
      process.exit(1);
    }

    console.log(`Syncing GitHub repos for: ${githubUsername}`);
    await ExternalContentService.syncGithubRepos(githubToken, githubUsername);
    console.log('✅ GitHub sync completed successfully!');

    process.exit(0);
  } catch (err) {
    console.error('GitHub sync failed:', err);
    process.exit(1);
  }
};

run();
