import { Router, type Request, type Response, type NextFunction } from 'express';

import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { ValidationError } from '../errors/index.js';
import { list, getBySlug, create } from '../services/articleService.js';

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

articlesRouter.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as { article?: { title?: unknown; description?: unknown; body?: unknown; tagList?: unknown } };
    if (!body || typeof body !== 'object' || !body.article || typeof body.article !== 'object') {
      throw new ValidationError('body', "can't be empty");
    }
    const a = body.article;
    const tagList =
      Array.isArray(a.tagList)
        ? (a.tagList.filter((t) => typeof t === 'string') as string[])
        : undefined;
    const article = await create(req.user!.id, {
      title: typeof a.title === 'string' ? a.title : undefined,
      description: typeof a.description === 'string' ? a.description : undefined,
      body: typeof a.body === 'string' ? a.body : undefined,
      tagList,
    });
    res.status(200).json({ article });
  } catch (err) {
    next(err);
  }
});
