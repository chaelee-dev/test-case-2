import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider.js';
import { router } from './router/routes.js';

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
