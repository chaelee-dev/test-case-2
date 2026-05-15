import { Router, type Request, type Response, type NextFunction } from 'express';

import * as tagRepo from '../repos/tagRepo.js';

export const tagsRouter = Router();

tagsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await tagRepo.listAll();
    res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
});
