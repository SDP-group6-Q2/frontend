import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser } from '../api/authApi';

const AuthContext = createContext(null);

const ACCESS = {
  full: new Set(['machines', 'operations', 'commercial', 'scanner', 'assistant']),
  technician: new Set(['machines', 'operations', 'scanner', 'assistant']),
  commercial: new Set(['machines', 'commercial', 'scanner', 'assistant']),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const expired = () => setUser(null);
    window.addEventListener('arol:session-expired', expired);
    return () => window.removeEventListener('arol:session-expired', expired);
  }, []);

  async function login(email, password) {
    const currentUser = await loginUser(email, password);
    setUser(currentUser);
    return currentUser;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  const canAccess = useMemo(() => {
    return (service) => {
      if (!user) return false;
      const visibility = String(user.visibility || 'full').toLowerCase();
      const permissions = ACCESS[visibility] ?? ACCESS.full;
      return permissions.has(service);
    };
  }, [user]);

  return <AuthContext.Provider value={{ user, login, logout, authLoading, isAuthenticated: Boolean(user), canAccess }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
