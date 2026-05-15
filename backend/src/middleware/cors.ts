import cors from 'cors';
import type { RequestHandler } from 'express';

import { corsAllowList } from '../config/env.js';

export function corsMiddleware(): RequestHandler {
  const allowList = corsAllowList();
  return cors({
    origin: (origin, cb) => {
      if (!origin || allowList.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error(`CORS: origin ${origin} not in allow list`));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
