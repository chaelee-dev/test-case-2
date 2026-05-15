// dotenv/config는 *가장 먼저* import — process.env가 다른 모듈 evaluation 전에 채워져야 함.
// ESM은 import 문을 의존성 그래프대로 topological 순서로 실행하므로, 'dotenv/config'를 첫 줄에
// 두면 ./config/env.js·middleware/requestLogger.js 등이 getEnv() 호출하기 전에 .env 로드 보장.
import 'dotenv/config';

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
