import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { prisma, isDatabaseConnected, connectDatabase } from './config/database';
import { sendSuccess } from './utils/response';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import rideRoutes from './routes/ride.routes';
import quoteRoutes from './routes/quote.routes';
import locationRoutes from './routes/location.routes';
import notificationRoutes from './routes/notification.routes';

const app: Application = express();

// Enable trust proxy for reverse proxies (Vercel, Render, Cloudflare, etc.)
app.set('trust proxy', 1);

// Security middleware - permit external CDNs and cross-origin resource requests
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Parse configured allowed origins from FRONTEND_URL (supports comma-separated list or single URL)
const configuredOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean)
  : [];

// Standard development localhost origins
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

// Production-ready CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      // 2. Allow explicitly configured frontend origins (e.g. from FRONTEND_URL env var on Vercel/Render)
      if (configuredOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // 3. Allow Vercel preview & production deployments
      if (
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin.endsWith('.github.io')
      ) {
        return callback(null, true);
      }

      // 4. Always allow localhost, Vite dev port 5173, backend port 5000, and local private network IPs
      if (
        defaultDevOrigins.includes(normalizedOrigin) ||
        /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // Origin not permitted by CORS policy
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'x-requested-with',
      'X-Device-Id',
      'x-device-id',
      'bypass-tunnel-reminder',
      'Bypass-Tunnel-Reminder'
    ],
    optionsSuccessStatus: 200
  })
);

// Logging middleware
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiting
app.use(generalLimiter);

// Lazy database connection initializer for serverless environments (Vercel)
let dbInitPromise: Promise<boolean> | null = null;
app.use((_req: Request, _res: Response, next) => {
  if (!isDatabaseConnected && !dbInitPromise) {
    dbInitPromise = connectDatabase().catch(() => false);
  }
  next();
});

// Health check endpoint (checks live Supabase PostgreSQL connection via Prisma)
// Supports both /api/health and /health
const healthHandler = async (_req: Request, res: Response) => {
  let isDbHealthy = false;
  try {
    if (!isDatabaseConnected && !dbInitPromise) {
      dbInitPromise = connectDatabase().catch(() => false);
    }
    if (dbInitPromise) {
      await dbInitPromise;
    }
    await prisma.$queryRaw`SELECT 1`;
    isDbHealthy = true;
  } catch {
    isDbHealthy = isDatabaseConnected;
  }

  const dbStatus = isDbHealthy ? 'connected' : 'disconnected';
  const statusCode = isDbHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isDbHealthy,
    status: isDbHealthy ? 'healthy' : 'degraded',
    database: dbStatus,
    environment: env.NODE_ENV,
    data: {
      status: isDbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: dbStatus,
      orm: 'Prisma',
      databaseProvider: 'Supabase PostgreSQL',
      port: env.PORT,
      uptime: Math.floor(process.uptime())
    }
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);

// Frontend static assets & SPA catch-all (serves index.html when present, clean JSON otherwise)
const frontendPath = path.resolve(__dirname, '../../');
const indexPath = path.join(frontendPath, 'index.html');
if (fs.existsSync(indexPath)) {
  app.use(express.static(frontendPath));
}

app.get('*', (req: Request, res: Response, next) => {
  // Let unrecognized /api routes proceed to notFoundHandler
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).json({
    name: 'VOZX RideCompare API',
    status: 'online',
    health: '/api/health',
    environment: env.NODE_ENV
  });
});

// 404 handler for API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
