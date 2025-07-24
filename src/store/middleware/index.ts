import logger from './logger';
import authMiddleware from './authMiddleware';

export { logger, authMiddleware };

export const allMiddleware = [
  logger,
  authMiddleware,
];
