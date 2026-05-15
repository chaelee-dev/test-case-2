import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('tokenStorage', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  it('get/set/clear roundtrip', async () => {
    const { getToken, setToken, clearToken } = await import('../auth/tokenStorage.js');
    expect(getToken()).toBeNull();
    setToken('abc');
    expect(getToken()).toBe('abc');
    clearToken();
    expect(getToken()).toBeNull();
  });

  it('localStorage 접근 실패 시 catch (return null)', async () => {
    const original = window.localStorage.getItem;
    Object.defineProperty(window.localStorage, 'getItem', {
      value: () => {
        throw new Error('access denied');
      },
      configurable: true,
    });
    const { getToken } = await import('../auth/tokenStorage.js');
    expect(getToken()).toBeNull();
    Object.defineProperty(window.localStorage, 'getItem', { value: original, configurable: true });
  });
});
