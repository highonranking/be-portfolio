import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';

dotenv.config();

const publishBlog = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const blogId = '692df1fb8f1c5056a91443ee';
    const result = await BlogPost.findByIdAndUpdate(
      blogId,
      { published: true },
      { new: true }
    );

    console.log('✅ Blog post published:', result?.title);
    console.log('Published:', result?.published);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

publishBlog();
