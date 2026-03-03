import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setIsLoggedIn(true);
      setUsername(user?.username ?? null);
    } catch {
      setIsLoggedIn(false);
      setUsername(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((user) => {
    setIsLoggedIn(true);
    setUsername(user?.username ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // ignore
    }
    setIsLoggedIn(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
