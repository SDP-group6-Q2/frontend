import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const location = useLocation();

  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return (
      <div className="auth-loading">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;