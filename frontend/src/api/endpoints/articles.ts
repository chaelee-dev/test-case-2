import type { Article } from '../../types/domain.js';
import { apiClient } from '../apiClient.js';

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

function buildQuery(params: { tag?: string; author?: string; favorited?: string; limit?: number; offset?: number }) {
  const qs = new URLSearchParams();
  if (params.tag) qs.set('tag', params.tag);
  if (params.author) qs.set('author', params.author);
  if (params.favorited) qs.set('favorited', params.favorited);
  if (params.limit !== undefined) qs.set('limit', String(params.limit));
  if (params.offset !== undefined) qs.set('offset', String(params.offset));
  const s = qs.toString();
  return s.length > 0 ? `?${s}` : '';
}

export function listArticles(
  params: { tag?: string; author?: string; favorited?: string; limit?: number; offset?: number } = {},
): Promise<ArticlesResponse> {
  return apiClient.get(`/articles${buildQuery(params)}`);
}

export function feedArticles(params: { limit?: number; offset?: number } = {}): Promise<ArticlesResponse> {
  return apiClient.get(`/articles/feed${buildQuery(params)}`);
}

export function getArticle(slug: string): Promise<{ article: Article }> {
  return apiClient.get(`/articles/${slug}`);
}

export function createArticle(input: {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}): Promise<{ article: Article }> {
  return apiClient.post('/articles', { article: input });
}

export function updateArticle(
  slug: string,
  input: { title?: string; description?: string; body?: string },
): Promise<{ article: Article }> {
  return apiClient.put(`/articles/${slug}`, { article: input });
}

export function deleteArticle(slug: string): Promise<void> {
  return apiClient.delete(`/articles/${slug}`);
}

export function favoriteArticle(slug: string): Promise<{ article: Article }> {
  return apiClient.post(`/articles/${slug}/favorite`);
}

export function unfavoriteArticle(slug: string): Promise<{ article: Article }> {
  return apiClient.delete(`/articles/${slug}/favorite`);
}
