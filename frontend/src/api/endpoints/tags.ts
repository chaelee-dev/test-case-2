import { apiClient } from '../apiClient.js';

export function listTags(): Promise<{ tags: string[] }> {
  return apiClient.get('/tags');
}
