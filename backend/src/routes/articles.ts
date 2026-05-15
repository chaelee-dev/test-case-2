import { Router, type Request, type Response, type NextFunction } from 'express';

import { optionalAuth } from '../middleware/auth.js';
import { list, getBySlug } from '../services/articleService.js';

export const articlesRouter = Router();

articlesRouter.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await list(req.query, req.user?.id ?? null);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

articlesRouter.get(
  '/:slug',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await getBySlug(req.params.slug!, req.user?.id ?? null);
      res.status(200).json({ article });
    } catch (err) {
      next(err);
    }
  },
);
