import type { Profile } from '../../types/domain.js';
import { apiClient } from '../apiClient.js';

export function getProfile(username: string): Promise<{ profile: Profile }> {
  return apiClient.get(`/profiles/${encodeURIComponent(username)}`);
}

export function followUser(username: string): Promise<{ profile: Profile }> {
  return apiClient.post(`/profiles/${encodeURIComponent(username)}/follow`);
}

export function unfollowUser(username: string): Promise<{ profile: Profile }> {
  return apiClient.delete(`/profiles/${encodeURIComponent(username)}/follow`);
}
