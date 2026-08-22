import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`Handled error [${err.errorCode}]: ${err.message}`, {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
      details: err.details,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || null,
      },
    });
  }

  // Unhandled / Internal Server Errors
  logger.error(`Unhandled internal server error: ${err.message}`, err.stack);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal server error occurred',
      details: err.message,
    },
  });
};
