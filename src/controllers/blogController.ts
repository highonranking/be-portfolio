import { Response } from 'express';
import BlogPost from '../models/BlogPost';
import { AuthRequest } from '../middleware/auth';
import { slugify } from '../utils/helpers';

export const createBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, excerpt, content, thumbnail, category, tags } = req.body;

    const slug = slugify(title);
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Blog post with this title already exists' });
    }

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      category,
      tags,
    });

    await blogPost.save();
    res.status(201).json({ message: 'Blog post created successfully', data: blogPost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { published, featured, category, limit = 10, skip = 0 } = req.query;
    const filter: any = {};

    if (published) filter.published = published === 'true';
    if (featured) filter.featured = featured === 'true';
    if (category) filter.category = category;

    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await BlogPost.countDocuments(filter);

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

export const getBlogPostBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    post.views = (post.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, thumbnail, category, tags, published, featured } = req.body;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        excerpt,
        content,
        thumbnail,
        category,
        tags,
        published,
        featured,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({ message: 'Blog post updated successfully', data: post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const likeBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json({ message: 'Blog post liked', data: post });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
