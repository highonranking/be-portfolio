import mongoose, { Schema, Document } from 'mongoose';

interface IExternalContent extends Document {
  type: 'medium' | 'github' | 'linkedin';
  sourceId: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  likes?: number;
  shares?: number;
  publishedAt: Date;
  metadata: Record<string, any>;
  lastSyncedAt: Date;
  createdAt: Date;
}

const externalContentSchema = new Schema<IExternalContent>({
  type: { type: String, enum: ['medium', 'github', 'linkedin'] },
  sourceId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  imageUrl: String,
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  publishedAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
  lastSyncedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IExternalContent>('ExternalContent', externalContentSchema);
