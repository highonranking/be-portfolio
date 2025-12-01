import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import externalContentRoutes from './routes/externalContentRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import versionRoutes from './routes/versionRoutes';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.FRONTEND_URL || '',
  'https://be-frontend.vercel.app',
  'https://www.abhinavdixit.com',
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or curl (no origin)
    if (!origin) return callback(null, true);
    // Allow exact matches
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel preview deployments for this project
    const vercelPreview = /^https:\/\/.*\.vercel\.app$/i;
    if (vercelPreview.test(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Explicitly handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/external', externalContentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/version', versionRoutes);

// Fallback inline version endpoint (in case routing file isn't picked up in some builds)
app.get('/api/version', async (req, res) => {
  try {
    // Try reading package version
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const appVersion = pkg.version ? `v${pkg.version}` : 'v1.0.0';
    res.json({ tag: appVersion, name: appVersion, source: 'package.json' });
  } catch (e) {
    res.status(200).json({ tag: 'v1.0.0', name: 'v1.0.0', source: 'fallback' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
