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
  excerpt?: string;
  content: IContent[] | string;
  thumbnail?: string;
  category?: string;
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
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: false },
  content: { type: Schema.Types.Mixed, required: true },
  thumbnail: String,
  category: { type: String, index: true },
  tags: [String],
  published: { type: Boolean, default: false, index: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to auto-generate excerpt if not provided
blogPostSchema.pre('save', function(next) {
  if (!this.excerpt) {
    // Helper to recursively extract text from TipTap-like JSON
    function extractText(node: any): string {
      if (!node) return '';
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(extractText).join(' ');
      if (typeof node === 'object' && node.text) return node.text;
      if (typeof node === 'object' && node.content) return extractText(node.content);
      return '';
    }

    let text = '';
    if (typeof this.content === 'string') {
      text = this.content;
    } else if (Array.isArray(this.content)) {
      text = this.content.map(extractText).join(' ');
    } else if (this.content && typeof this.content === 'object') {
      text = extractText(this.content);
    }
    if (text) {
      this.excerpt = text.substring(0, 150).trim() + '...';
    }
  }
  next();
});

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
