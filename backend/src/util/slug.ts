import { createHash } from 'node:crypto';

/**
 * slugify — 영문/숫자/하이픈만, 한글·특수문자·공백은 하이픈으로 치환.
 * 09 API spec 정합: `slugify(title)`; 충돌 시 `-<base36 6자 해시>` suffix.
 */
export function slugify(title: string): string {
  const lower = title.toLowerCase().trim();
  const ascii = lower
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  const replaced = ascii
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return replaced.length > 0 ? replaced : 'untitled';
}

/**
 * slug 충돌 시 사용할 suffix — base36 6자 해시.
 */
export function slugSuffix(seed: string, salt: number = Date.now()): string {
  const hash = createHash('sha256').update(`${seed}::${salt}`).digest('hex');
  return BigInt(`0x${hash.slice(0, 12)}`).toString(36).slice(0, 6);
}

export function withSuffix(base: string, seed: string, salt: number = Date.now()): string {
  return `${base}-${slugSuffix(seed, salt)}`;
}
