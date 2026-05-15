import type { AuthUser } from '../../types/domain.js';
import { apiClient } from '../apiClient.js';

export function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return apiClient.post('/users', { user: input });
}

export function login(input: { email: string; password: string }): Promise<{ user: AuthUser }> {
  return apiClient.post('/users/login', { user: input });
}

export function getCurrentUser(): Promise<{ user: AuthUser }> {
  return apiClient.get('/user');
}

export function updateCurrentUser(patch: {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  image?: string | null;
}): Promise<{ user: AuthUser }> {
  return apiClient.put('/user', { user: patch });
}
