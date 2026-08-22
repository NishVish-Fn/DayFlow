import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './config/db';

const app = createApp();

const server = app.listen(config.port, async () => {
  try {
    await prisma.$connect();
    logger.info(`🚀 Dayflow HRMS Backend Engine running on http://localhost:${config.port}`);
    logger.info(`📊 Environment: ${config.env}`);
    logger.info(`🔒 Security: Helmet, Rate Limiter, Bcrypt (Cost 12), Rotating JWT Tokens Active`);
  } catch (error) {
    logger.error('Failed to connect to database on startup:', error);
  }
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Database disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
