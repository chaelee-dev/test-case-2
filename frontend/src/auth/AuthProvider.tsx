import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { AuthUser } from '../types/domain.js';
import { clearToken, getToken, setToken } from './tokenStorage.js';

export interface AuthContextValue {
  user: AuthUser | null;
  setAuthUser: (u: AuthUser) => void;
  clearAuthUser: () => void;
  hasToken: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const setAuthUser = useCallback((u: AuthUser) => {
    setUser(u);
    setToken(u.token);
  }, []);

  const clearAuthUser = useCallback(() => {
    setUser(null);
    clearToken();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, setAuthUser, clearAuthUser, hasToken: getToken() !== null }),
    [user, setAuthUser, clearAuthUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
