import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../markdown/render.js';

describe('markdown sanitizer (RISK-03 XSS)', () => {
  it('일반 마크다운 → HTML', () => {
    const out = renderMarkdown('# title\n\n**bold** _italic_');
    expect(out).toContain('<h1>title</h1>');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('<em>italic</em>');
  });

  it('<script> 제거', () => {
    const out = renderMarkdown('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).not.toContain('alert(1)');
  });

  it('onerror= 속성 제거', () => {
    const out = renderMarkdown('<img src="x" onerror="alert(1)">');
    expect(out).not.toMatch(/onerror/i);
  });

  it('javascript: href 제거', () => {
    const out = renderMarkdown('[click](javascript:alert(1))');
    expect(out).not.toMatch(/href="javascript:/i);
  });

  it('<iframe> 제거', () => {
    const out = renderMarkdown('<iframe src="//evil.example"></iframe>');
    expect(out).not.toContain('<iframe');
  });

  it('안전 HTML 유지 — <strong>, <code>', () => {
    const out = renderMarkdown('<p><strong>hi</strong> <code>x</code></p>');
    expect(out).toContain('<strong>hi</strong>');
    expect(out).toContain('<code>x</code>');
  });

  it('img src 허용 (http URL만)', () => {
    const out = renderMarkdown('<img src="https://example.com/x.png" alt="x">');
    expect(out).toContain('src="https://example.com/x.png"');
  });

  it('마크다운 link http:// 유지', () => {
    const out = renderMarkdown('[link](https://example.com)');
    expect(out).toContain('href="https://example.com"');
  });
});
