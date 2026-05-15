import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { EditorPage } from '../pages/EditorPage.js';
import { ArticlePage } from '../pages/ArticlePage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from './ProtectedRoute.js';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/editor',
    element: (
      <ProtectedRoute>
        <EditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/editor/:slug',
    element: (
      <ProtectedRoute>
        <EditorPage />
      </ProtectedRoute>
    ),
  },
  { path: '/article/:slug', element: <ArticlePage /> },
  { path: '/profile/:username', element: <ProfilePage /> },
  { path: '*', element: <NotFoundPage /> },
]);
