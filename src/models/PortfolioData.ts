import mongoose, { Schema, Document } from 'mongoose';

interface IPortfolioData extends Document {
  adminId: mongoose.Types.ObjectId;
  stats: {
    totalProjects: number;
    totalBlogs: number;
    yearsOfExperience: number;
  };
  experience: Array<{
    company: string;
    position: string;
    location?: string;
    duration: string;
    responsibilities?: string[];
  }>;
  education?: {
    degree: string;
    institution: string;
    university?: string;
    graduationDate?: string;
    gpaCgpa?: string;
  };
  projects: Array<{
    name: string;
    technologies: string[];
    description: string;
    link?: string;
  }>;
  achievements: string[];
  volunteerExperience: Array<{
    role: string;
    organization: string;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    medium?: string;
    website?: string;
    codeforces?: string;
    leetcode?: string;
    geeksforgeeks?: string;
    codechef?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const portfolioDataSchema = new Schema<IPortfolioData>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stats: {
    totalProjects: { type: Number, default: 0 },
    totalBlogs: { type: Number, default: 0 },
    yearsOfExperience: { type: Number, default: 0 },
  },
  experience: [
    {
      company: String,
      position: String,
      location: String,
      duration: String,
      responsibilities: [String],
    },
  ],
  education: {
    degree: String,
    institution: String,
    university: String,
    graduationDate: String,
    gpaCgpa: String,
  },
  projects: [
    {
      name: String,
      technologies: [String],
      description: String,
      link: String,
    },
  ],
  achievements: [String],
  volunteerExperience: [
    {
      role: String,
      organization: String,
      description: String,
    },
  ],
  skills: [
    {
      category: String,
      items: [String],
    },
  ],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    medium: String,
    website: String,
    codeforces: String,
    leetcode: String,
    geeksforgeeks: String,
    codechef: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPortfolioData>('PortfolioData', portfolioDataSchema);
