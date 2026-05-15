import type { ErrorRequestHandler } from 'express';

import { AppError, InternalError } from '../errors/index.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toBody());
    return;
  }
  const internal = new InternalError(err instanceof Error ? err.message : String(err));
  res.status(internal.statusCode).json(internal.toBody());
};
