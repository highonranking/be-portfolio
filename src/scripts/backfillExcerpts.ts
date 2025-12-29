import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';

dotenv.config();

async function backfillExcerpts() {
  await mongoose.connect(process.env.MONGODB_URI || '', {
    dbName: process.env.DB_NAME || undefined,
  });
  const posts = await BlogPost.find({ $or: [ { excerpt: { $exists: false } }, { excerpt: '' }, { excerpt: null } ] });
  let updated = 0;
  for (const post of posts) {
    // Trigger pre-save hook to generate excerpt
    post.markModified('content');
    await post.save();
    updated++;
    console.log(`Updated excerpt for: ${post.title}`);
  }
  console.log(`Done. Updated ${updated} posts.`);
  await mongoose.disconnect();
}

backfillExcerpts().catch(err => {
  console.error('Error during backfill:', err);
  process.exit(1);
});
