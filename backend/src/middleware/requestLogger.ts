import type { RequestHandler } from 'express';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

import { getEnv } from '../config/env.js';

export const logger = pino({ level: getEnv().LOG_LEVEL });

declare module 'express-serve-static-core' {
  interface Request {
    traceId: string;
  }
}

export const requestLogger: RequestHandler = (req, _res, next) => {
  req.traceId = uuidv4();
  logger.info({ traceId: req.traceId, method: req.method, url: req.url }, 'request');
  next();
};
