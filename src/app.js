import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import httpStatus from 'http-status';

import { config } from './shared/config/index.js';
import { errorHandler } from './shared/middleware/error.js';
import { router as v1Router } from './routes/v1/index.js';

export const createApp = () => {
  const app = express();

  // Trust proxy (if behind reverse proxy)
  app.set('trust proxy', 1);

  // Security & common middleware
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());

  if (config.isDev) {
    app.use(morgan('dev'));
  }

  // Rate limiting
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  app.use('/v1', limiter);

  // Routes
  app.use('/v1', v1Router);

  // Health check
  app.get('/health', (_req, res) => res.status(httpStatus.OK).json({ status: 'ok' }));

  // 404 handler
  app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Route not found' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};
