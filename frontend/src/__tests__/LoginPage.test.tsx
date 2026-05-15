import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ErrorList } from '../components/ErrorList.js';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('LoginPage', () => {
  it('렌더 — Sign in 제목', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('submit 정상 → setAuthUser + navigate /', async () => {
    fetchMock.mockResolvedValueOnce(
      makeResponse(200, {
        user: { username: 'u', email: 'u@e.com', token: 'jwt', bio: '', image: null },
      }),
    );
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'u@e.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pw12345678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument());
  });

  it('submit 422 → ErrorList 표시', async () => {
    fetchMock.mockResolvedValueOnce(
      makeResponse(422, { errors: { 'email or password': ['is invalid'] } }),
    );
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'u@e.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(screen.getByText(/email or password is invalid/)).toBeInTheDocument());
  });
});

describe('ErrorList', () => {
  it('빈 배열 → null 렌더', () => {
    const { container } = render(<ErrorList errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('N개 errors 렌더', () => {
    render(<ErrorList errors={['err A', 'err B']} />);
    expect(screen.getByText('err A')).toBeInTheDocument();
    expect(screen.getByText('err B')).toBeInTheDocument();
  });
});
