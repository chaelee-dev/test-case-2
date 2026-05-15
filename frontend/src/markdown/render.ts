import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { PURIFY_CONFIG } from './purifyConfig.js';

marked.setOptions({ gfm: true, breaks: true });

/**
 * marked → DOMPurify 파이프라인.
 * RISK-03 XSS 완화 정본.
 */
export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md) as string;
  return DOMPurify.sanitize(rawHtml, PURIFY_CONFIG);
}
