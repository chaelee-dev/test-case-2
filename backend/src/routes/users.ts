import { Router, type Request, type Response, type NextFunction } from 'express';

import { requireAuth } from '../middleware/auth.js';
import { ValidationError } from '../errors/index.js';
import { register, login, getCurrent, updateCurrent } from '../services/userService.js';

export const usersRouter = Router();
export const userRouter = Router();

function pickUserBody(req: Request): {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  image?: string | null;
} {
  const body = req.body as {
    user?: {
      username?: unknown;
      email?: unknown;
      password?: unknown;
      bio?: unknown;
      image?: unknown;
    };
  };
  if (!body || typeof body !== 'object' || !body.user || typeof body.user !== 'object') {
    throw new ValidationError('body', "can't be empty");
  }
  const u = body.user;
  return {
    username: typeof u.username === 'string' ? u.username : undefined,
    email: typeof u.email === 'string' ? u.email : undefined,
    password: typeof u.password === 'string' ? u.password : undefined,
    bio: typeof u.bio === 'string' ? u.bio : undefined,
    image: typeof u.image === 'string' || u.image === null ? (u.image as string | null) : undefined,
  };
}

// === plural: /api/users (register + login) ===

usersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = pickUserBody(req);
    if (!username || !email || !password) {
      throw new ValidationError('body', "can't be empty");
    }
    const user = await register({ username, email, password });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = pickUserBody(req);
    if (!email || !password) {
      throw new ValidationError('email or password', 'is invalid');
    }
    const user = await login({ email, password });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// === singular: /api/user (getCurrent + update) ===

userRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getCurrent(req.user!.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

userRouter.put('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patch = pickUserBody(req);
    const user = await updateCurrent(req.user!.id, patch);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});
