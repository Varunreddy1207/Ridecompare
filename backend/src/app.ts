import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { isDatabaseConnected } from './config/database';
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

// Enable trust proxy for reverse proxies and tunnels (e.g., localtunnel, ngrok, Cloudflare)
app.set('trust proxy', 1);

// Security middleware - permit external CDNs and cross-origin resource requests
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or any client
      return callback(null, true);
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

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const dbStatus = isDatabaseConnected ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    status: 'healthy',
    database: dbStatus,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: dbStatus,
      orm: 'Prisma',
      databaseProvider: 'Supabase PostgreSQL',
      port: env.PORT,
      uptime: Math.floor(process.uptime())
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notifications', notificationRoutes);

// Frontend static assets & SPA catch-all (serves index.html, css/, js/, assets/ on port 5000)
const frontendPath = path.resolve(__dirname, '../../');
app.use(express.static(frontendPath));

app.get('*', (req: Request, res: Response, next) => {
  // Let unrecognized /api routes proceed to notFoundHandler
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 handler for API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
