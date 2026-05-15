import { describe, it, expect } from 'vitest';
import { slugify, slugSuffix, withSuffix } from '../util/slug.js';

describe('slugify', () => {
  it('영문 + 공백 → 하이픈', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('한글 → untitled (ascii-only)', () => {
    expect(slugify('안녕하세요')).toBe('untitled');
  });

  it('영문 + 한글 혼합 → 영문 부분만', () => {
    expect(slugify('Hello 안녕 World')).toBe('hello-world');
  });

  it('특수문자 → 하이픈으로 치환 + 양끝 정리', () => {
    expect(slugify('!!!Foo & Bar???')).toBe('foo-bar');
  });

  it('연속 공백·하이픈 → 단일 하이픈', () => {
    expect(slugify('foo   bar---baz')).toBe('foo-bar-baz');
  });
});

describe('slugSuffix / withSuffix', () => {
  it('suffix는 base36 6자', () => {
    const s = slugSuffix('hello-world');
    expect(s).toMatch(/^[0-9a-z]{1,6}$/);
    expect(s.length).toBeLessThanOrEqual(6);
  });

  it('같은 (seed, salt)면 deterministic', () => {
    expect(slugSuffix('foo', 12345)).toBe(slugSuffix('foo', 12345));
  });

  it('withSuffix 결과는 base-suffix 형식', () => {
    const out = withSuffix('hello-world', 'hello-world', 12345);
    expect(out).toMatch(/^hello-world-[0-9a-z]{1,6}$/);
  });
});
