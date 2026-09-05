import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getCurrentUser();

        setUser(response?.user ?? null);
      } catch (error) {
        console.error('Unable to load current user:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(email, password) {
    const response = await loginUser(email, password);

    setUser(response.user);

    return response.user;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authLoading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider',
    );
  }

  return context;
}