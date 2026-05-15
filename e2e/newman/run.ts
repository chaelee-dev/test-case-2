import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import newman from 'newman';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const collectionPath = join(__dirname, 'conduit.postman_collection.json');
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

newman.run(
  {
    collection: require(collectionPath),
    reporters: ['cli'],
    environment: {
      values: [{ key: 'baseUrl', value: baseUrl, enabled: true }],
    } as Parameters<typeof newman.run>[0]['environment'],
  },
  (err: Error | null, summary?: newman.NewmanRunSummary) => {
    if (err) {
      console.error('Newman run failed:', err);
      process.exit(1);
    }
    const failures = summary?.run.failures.length ?? 0;
    if (failures > 0) {
      console.error(`Newman: ${failures} assertion failure(s)`);
      process.exit(1);
    }
    console.info('Newman: all assertions passed');
  },
);
