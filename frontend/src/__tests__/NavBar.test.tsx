import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider.js';
import { NavBar } from '../components/NavBar.js';
import type { AuthUser } from '../types/domain.js';

describe('NavBar', () => {
  it('익명 → Sign in / Sign up 링크', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('인증 → New Article / Settings / username', () => {
    const user: AuthUser = { username: 'jane', email: 'j@e.com', token: 't', bio: '', image: null };
    render(
      <AuthProvider initialUser={user}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(screen.getByText(/New Article/)).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('jane')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });
});
