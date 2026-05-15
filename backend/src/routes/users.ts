import { Router, type Request, type Response, type NextFunction } from 'express';

import { ValidationError } from '../errors/index.js';
import { register, login } from '../services/userService.js';

export const usersRouter = Router();

function pickUserBody(req: Request): { username?: string; email?: string; password?: string } {
  const body = req.body as { user?: { username?: unknown; email?: unknown; password?: unknown } };
  if (!body || typeof body !== 'object' || !body.user || typeof body.user !== 'object') {
    throw new ValidationError('body', "can't be empty");
  }
  const u = body.user;
  return {
    username: typeof u.username === 'string' ? u.username : undefined,
    email: typeof u.email === 'string' ? u.email : undefined,
    password: typeof u.password === 'string' ? u.password : undefined,
  };
}

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
