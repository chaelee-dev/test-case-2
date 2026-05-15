import { Router, type Request, type Response, type NextFunction } from 'express';

import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { getProfile, follow, unfollow } from '../services/userService.js';

export const profilesRouter = Router();

profilesRouter.get(
  '/:username',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await getProfile(req.params.username!, req.user?.id ?? null);
      res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  },
);

profilesRouter.post(
  '/:username/follow',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await follow(req.user!.id, req.params.username!);
      res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  },
);

profilesRouter.delete(
  '/:username/follow',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await unfollow(req.user!.id, req.params.username!);
      res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  },
);
