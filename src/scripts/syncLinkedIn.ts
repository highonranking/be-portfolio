import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { ExternalContentService } from '../services/externalContent';

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const linkedinProfileUrl = process.env.LINKEDIN_PROFILE_URL;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!linkedinProfileUrl || !rapidApiKey) {
      console.error('LinkedIn profile URL or RapidAPI key not configured in .env');
      process.exit(1);
    }

    console.log(`Syncing LinkedIn posts for: ${linkedinProfileUrl}`);
    await ExternalContentService.syncLinkedInPosts(linkedinProfileUrl, rapidApiKey);
    console.log('✅ LinkedIn sync completed successfully!');

    process.exit(0);
  } catch (err) {
    console.error('LinkedIn sync failed:', err);
    process.exit(1);
  }
};

run();
