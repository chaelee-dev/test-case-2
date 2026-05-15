import type { ApiErrorBody } from '../types/domain.js';
import { clearToken, getToken } from '../auth/tokenStorage.js';

const BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Token ${token}`;

  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  let json: unknown = null;
  const text = await res.text();
  if (text.length > 0) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new ApiError(res.status, `Invalid JSON response (status ${res.status})`);
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
    }
    throw new ApiError(res.status, `Request failed: ${res.status}`, json as ApiErrorBody | null);
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
