import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardPathFor, dashboardSlugFor } from '../../auth/roleRoutes';

interface ProtectedRouteProps {
  dashboard: string;
  children: React.ReactElement;
}

// Decides before the dashboard renders (no flash of protected content). This is a UX guard only:
// the backend re-checks the session and role on every request, so editing localStorage here
// cannot grant any API access.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ dashboard, children }) => {
  const { user, isAuthenticated, isVerifying } = useAuth();

  if (isVerifying) {
    return <div style={{ padding: 32, fontFamily: 'sans-serif' }}>Verifying session…</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const ownSlug = dashboardSlugFor(user.roleName);
  if (!ownSlug) {
    return <Navigate to="/login" replace />;
  }

  if (ownSlug !== dashboard) {
    return <Navigate to={dashboardPathFor(user.roleName)!} replace />;
  }

  return children;
};

export default ProtectedRoute;
