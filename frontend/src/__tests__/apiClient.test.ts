import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient, ApiError } from '../api/apiClient.js';
import { setToken, clearToken } from '../auth/tokenStorage.js';
import { parseApiErrors } from '../api/parseErrors.js';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  clearToken();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeResponse(status: number, body: unknown): Response {
  const json = body === null ? '' : JSON.stringify(body);
  return new Response(json, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('apiClient', () => {
  it('GET — Token 헤더 부착', async () => {
    setToken('jwt-abc');
    fetchMock.mockResolvedValueOnce(makeResponse(200, { user: { username: 'u' } }));
    await apiClient.get('/user');
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Token jwt-abc');
  });

  it('GET — token 없을 때 Authorization 헤더 없음', async () => {
    fetchMock.mockResolvedValueOnce(makeResponse(200, {}));
    await apiClient.get('/articles');
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('401 → ApiError + token clear', async () => {
    setToken('expired');
    fetchMock.mockResolvedValueOnce(makeResponse(401, { errors: { body: ['unauthorized'] } }));
    await expect(apiClient.get('/user')).rejects.toBeInstanceOf(ApiError);
    expect(window.localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY ?? 'conduit.jwt')).toBeNull();
  });

  it('422 → ApiError + body 포함', async () => {
    fetchMock.mockResolvedValueOnce(makeResponse(422, { errors: { email: ['is invalid'] } }));
    try {
      await apiClient.post('/users', { user: { email: 'x' } });
      throw new Error('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(422);
      expect(parseApiErrors(e)).toEqual(['email is invalid']);
    }
  });

  it('parseApiErrors — body 키는 그대로', async () => {
    fetchMock.mockResolvedValueOnce(makeResponse(404, { errors: { body: ['article not found'] } }));
    try {
      await apiClient.get('/articles/never');
    } catch (e) {
      expect(parseApiErrors(e)).toEqual(['article not found']);
    }
  });
});
