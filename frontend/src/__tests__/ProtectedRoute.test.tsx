import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { AuthUser } from '../types/domain.js';
import { AuthProvider } from '../auth/AuthProvider.js';
import { ProtectedRoute } from '../router/ProtectedRoute.js';

function renderWithAuth(initialUser: AuthUser | null, initialPath: string) {
  return render(
    <AuthProvider initialUser={initialUser}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ProtectedRoute', () => {
  it('user=null → /login redirect', () => {
    renderWithAuth(null, '/private');
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('user 있으면 children 렌더', () => {
    const user: AuthUser = {
      username: 'u',
      email: 'u@e.com',
      token: 'jwt',
      bio: '',
      image: null,
    };
    renderWithAuth(user, '/private');
    expect(screen.getByText('Private content')).toBeInTheDocument();
  });
});
