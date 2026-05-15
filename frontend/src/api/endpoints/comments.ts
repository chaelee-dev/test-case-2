import type { Comment } from '../../types/domain.js';
import { apiClient } from '../apiClient.js';

export function listComments(slug: string): Promise<{ comments: Comment[] }> {
  return apiClient.get(`/articles/${encodeURIComponent(slug)}/comments`);
}

export function createComment(slug: string, body: string): Promise<{ comment: Comment }> {
  return apiClient.post(`/articles/${encodeURIComponent(slug)}/comments`, { comment: { body } });
}

export function deleteComment(slug: string, id: number): Promise<void> {
  return apiClient.delete(`/articles/${encodeURIComponent(slug)}/comments/${id}`);
}
