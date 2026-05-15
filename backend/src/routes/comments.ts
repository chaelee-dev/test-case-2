import { Router, type Request, type Response, type NextFunction } from 'express';

import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { ValidationError } from '../errors/index.js';
import { list, add, remove } from '../services/commentService.js';

// /api/articles/:slug/comments — mergeParams로 부모 :slug 전달
export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await list(req.params.slug!, req.user?.id ?? null);
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
});

commentsRouter.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as { comment?: { body?: unknown } };
    if (!body || typeof body !== 'object' || !body.comment || typeof body.comment !== 'object') {
      throw new ValidationError('body', "can't be empty");
    }
    const comment = await add(req.user!.id, req.params.slug!, body.comment.body);
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
});

commentsRouter.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError('id', 'invalid');
      }
      await remove(req.user!.id, req.params.slug!, id);
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  },
);
