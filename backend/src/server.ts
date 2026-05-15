import { createApp } from './app.js';
import { getEnv } from './config/env.js';
import { logger } from './middleware/requestLogger.js';

export { createApp };

if (process.env.NODE_ENV !== 'test') {
  const env = getEnv();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`[conduit/backend] listening on :${env.PORT}`);
  });
}
