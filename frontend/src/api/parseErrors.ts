import type { ApiErrorBody } from '../types/domain.js';
import { ApiError } from './apiClient.js';

/**
 * RealWorld errors body `{errors:{<field>:[msg,...]}}`를 사용자 친화 문자열 배열로.
 */
export function parseApiErrors(err: unknown): string[] {
  if (err instanceof ApiError && err.body && typeof err.body === 'object' && 'errors' in err.body) {
    return apiErrorToList(err.body);
  }
  if (err instanceof Error) return [err.message];
  return ['unknown error'];
}

function apiErrorToList(body: ApiErrorBody): string[] {
  const out: string[] = [];
  for (const [field, msgs] of Object.entries(body.errors)) {
    for (const msg of msgs) {
      out.push(field === 'body' ? msg : `${field} ${msg}`);
    }
  }
  return out;
}
