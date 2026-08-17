import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Both JWTs are HttpOnly cookies. On page load, ask the backend to rotate
  // the refresh cookie and issue a fresh access-token cookie.
  const restoreSession = useCallback(async () => {
    try {
      const res = await api.post('/auth/refresh');
      setUser(res.data.user);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    // Remove the old localStorage token used by earlier versions.
    localStorage.removeItem('dailylife_token');

    restoreSession().finally(() => setLoading(false));

    const handleExpired = () => setUser(null);
    window.addEventListener('dailylife:auth-expired', handleExpired);
    return () => window.removeEventListener('dailylife:auth-expired', handleExpired);
  }, [restoreSession]);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // The browser will still lose the local user state even if the server
      // cannot be reached. The server revokes the refresh token when reachable.
    }
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
