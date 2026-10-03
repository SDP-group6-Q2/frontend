import { Navigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

export default function VisibilityRoute({ service, children }) {
  const { canAccess } = useAuth();

  if (!canAccess(service)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
