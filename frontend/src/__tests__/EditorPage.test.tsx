import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider.js';
import { EditorPage } from '../pages/EditorPage.js';
import type { AuthUser } from '../types/domain.js';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  window.localStorage.clear();
});

afterEach(() => vi.unstubAllGlobals());

const user: AuthUser = { username: 'u', email: 'u@e.com', token: 'jwt', bio: '', image: null };

function renderEditor(initialPath: string) {
  return render(
    <AuthProvider initialUser={user}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:slug" element={<EditorPage />} />
          <Route path="/article/:slug" element={<div>ArticlePage</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

function res(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('EditorPage', () => {
  it('new 모드 — submit → POST → /article/:slug navigate', async () => {
    fetchMock.mockResolvedValueOnce(
      res(200, {
        article: {
          slug: 'new-slug',
          title: 'T',
          description: 'd',
          body: 'b',
          tagList: ['x'],
          createdAt: '2026-05-15T00:00:00Z',
          updatedAt: '2026-05-15T00:00:00Z',
          favorited: false,
          favoritesCount: 0,
          author: { username: 'u', bio: '', image: null, following: false },
        },
      }),
    );
    renderEditor('/editor');
    fireEvent.change(screen.getByPlaceholderText('Article Title'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText("What's this article about?"), { target: { value: 'd' } });
    fireEvent.change(screen.getByPlaceholderText(/markdown/), { target: { value: 'b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publish Article' }));
    await waitFor(() => expect(screen.getByText('ArticlePage')).toBeInTheDocument());
  });

  it('edit 모드 — prefill from GET', async () => {
    fetchMock.mockResolvedValueOnce(
      res(200, {
        article: {
          slug: 'old',
          title: 'Old Title',
          description: 'Old desc',
          body: 'Old body',
          tagList: ['a', 'b'],
          createdAt: '2026-05-15T00:00:00Z',
          updatedAt: '2026-05-15T00:00:00Z',
          favorited: false,
          favoritesCount: 0,
          author: { username: 'u', bio: '', image: null, following: false },
        },
      }),
    );
    renderEditor('/editor/old');
    await waitFor(() =>
      expect((screen.getByPlaceholderText('Article Title') as HTMLInputElement).value).toBe('Old Title'),
    );
    expect((screen.getByPlaceholderText("What's this article about?") as HTMLInputElement).value).toBe('Old desc');
  });
});
