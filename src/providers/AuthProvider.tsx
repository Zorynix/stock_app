import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { getStoredAuth, setStoredAuth } from '@/api/client';
import type { AuthResponse } from '@/types/api';

interface AuthContextValue {
  authUser: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** true — зарегистрирован, но email ещё не подтверждён */
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authUser: null,
  isAuthenticated: false,
  isLoading: true,
  pendingEmail: null,
  login: async () => {},
  register: async () => {},
  verifyEmail: async () => {},
  resendCode: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthResponse | null>(() => {
    const stored = getStoredAuth() as AuthResponse | null;
    return stored?.token ? stored : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;

    if (initData) {
      // Внутри Telegram: автоматическая аутентификация через initData
      authApi
        .telegramAuth(initData)
        .then((user) => {
          persist(user);
        })
        .catch((err) => {
          console.error('Telegram auth failed:', err);
          // Если Telegram auth упал, пробуем использовать сохранённый токен
        })
        .finally(() => setIsLoading(false));
    } else {
      // Web-режим: используем сохранённый токен
      setIsLoading(false);
    }
  }, []);

  const persist = (user: AuthResponse) => {
    setAuthUser(user);
    setStoredAuth(user);
    if (!user.emailConfirmed && user.email) {
      setPendingEmail(user.email);
    } else {
      setPendingEmail(null);
    }
  };

  const login = async (email: string, password: string) => {
    const user = await authApi.login(email, password);
    persist(user);
  };

  const register = async (email: string, password: string) => {
    const user = await authApi.register(email, password);
    persist(user);
    if (!user.emailConfirmed && user.email) {
      setPendingEmail(user.email);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    const user = await authApi.verifyEmail(email, code);
    persist(user);
  };

  const resendCode = async (email: string) => {
    await authApi.resendCode(email);
  };

  const logout = () => {
    setAuthUser(null);
    setPendingEmail(null);
    setStoredAuth(null);
  };

  const value = React.useMemo(
    () => ({
      authUser,
      isAuthenticated: !!authUser,
      isLoading,
      pendingEmail,
      login,
      register,
      verifyEmail,
      resendCode,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authUser, isLoading, pendingEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
