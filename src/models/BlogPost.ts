import mongoose, { Schema, Document } from 'mongoose';

interface IContent {
  type: 'text' | 'heading' | 'code' | 'image' | 'list';
  level?: number;
  text?: string;
  language?: string;
  code?: string;
  imageUrl?: string;
  imageCaption?: string;
  listItems?: string[];
  listType?: 'bullet' | 'ordered';
}

interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: IContent[];
  thumbnail: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>({
  type: { type: String, enum: ['text', 'heading', 'code', 'image', 'list'] },
  level: Number,
  text: String,
  language: String,
  code: String,
  imageUrl: String,
  imageCaption: String,
  listItems: [String],
  listType: { type: String, enum: ['bullet', 'ordered'] },
});

const blogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: [contentSchema],
  thumbnail: String,
  category: String,
  tags: [String],
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
