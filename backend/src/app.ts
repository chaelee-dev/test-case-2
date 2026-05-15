import express, { type Express, type Request, type Response, type Router } from 'express';

import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { usersRouter } from './routes/users.js';

export interface CreateAppOptions {
  /**
   * createApp의 health 라우트 *이후*, errorHandler *앞*에 추가 라우터를 마운트한다.
   * 도메인 라우트(ISS-BE-USR-01·ART-01 등) 또는 통합 테스트용 임시 라우트.
   */
  mountExtraRoutes?: (app: Express) => void;
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  app.use(corsMiddleware());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/users', usersRouter);

  options.mountExtraRoutes?.(app);

  app.use(errorHandler);

  return app;
}

/** 후속 이슈에서 도메인 라우터를 본 함수에 전달하여 mountExtraRoutes로 사용. */
export function mountDomainRoutes(_routers: { path: string; router: Router }[]): (app: Express) => void {
  return (app) => {
    for (const { path, router } of _routers) {
      app.use(path, router);
    }
  };
}
