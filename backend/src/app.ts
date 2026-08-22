import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes';

export const createApp = (): Application => {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows inline style rendering for payslip printing
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === config.clientUrl || origin.startsWith('http://localhost')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body & Cookie Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 4. Global Rate Limiter for API routes
  app.use('/api', globalRateLimiter);

  // 5. API v1 Routing (supports both /api/v1 and direct /v1)
  app.use('/api/v1', apiRoutes);
  app.use('/v1', apiRoutes);

  // 6. Serve Frontend Static Build (for 100% Free Monolith Hosting on Render / Railway / VPS)
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  const publicDist = path.resolve(__dirname, '../public');

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  } else if (fs.existsSync(publicDist)) {
    app.use(express.static(publicDist));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(publicDist, 'index.html'));
    });
  }

  // 7. API 404 Route Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      },
    });
  });

  // 8. Centralized Error Handler
  app.use(errorHandler);

  return app;
};
