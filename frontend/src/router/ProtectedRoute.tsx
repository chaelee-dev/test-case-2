import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/useAuth.js';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}
