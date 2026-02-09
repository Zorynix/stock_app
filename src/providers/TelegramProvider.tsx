import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextValue {
  user: TelegramUser | null;
  chatId: number | null;
  isReady: boolean;
  isTelegram: boolean;
  colorScheme: 'light' | 'dark';
  hapticFeedback: (type: 'impact' | 'notification' | 'selection') => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  close: () => void;
  expand: () => void;
}

const TelegramContext = createContext<TelegramContextValue>({
  user: null,
  chatId: null,
  isReady: false,
  isTelegram: false,
  colorScheme: 'dark',
  hapticFeedback: () => {},
  showAlert: () => {},
  showConfirm: () => Promise.resolve(false),
  close: () => {},
  expand: () => {},
});

export function useTelegram() {
  return useContext(TelegramContext);
}

interface Props {
  children: ReactNode;
}

export function TelegramProvider({ children }: Props) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const initDataUser = tg?.initDataUnsafe?.user;

    if (tg && initDataUser) {
      // Running inside Telegram with real user data
      setIsTelegram(true);
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      setUser({
        id: initDataUser.id,
        first_name: initDataUser.first_name,
        last_name: initDataUser.last_name,
        username: initDataUser.username,
        language_code: initDataUser.language_code,
      });
      setChatId(tg.initDataUnsafe?.chat?.id ?? initDataUser.id);

      setColorScheme(tg.colorScheme || 'dark');

      tg.onEvent('themeChanged', () => {
        setColorScheme(tg.colorScheme || 'dark');
      });

      setIsReady(true);
    } else {
      // Development mode — no real Telegram user
      setUser({
        id: 123456789,
        first_name: 'Dev',
        last_name: 'User',
        username: 'devuser',
        language_code: 'ru',
      });
      setChatId(123456789);
      setIsReady(true);
    }
  }, []);

  const hapticFeedback = React.useCallback((type: 'impact' | 'notification' | 'selection') => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.HapticFeedback) return;
    switch (type) {
      case 'impact':
        tg.HapticFeedback.impactOccurred('medium');
        break;
      case 'notification':
        tg.HapticFeedback.notificationOccurred('success');
        break;
      case 'selection':
        tg.HapticFeedback.selectionChanged();
        break;
    }
  }, []);

  const showAlert = React.useCallback((message: string) => {
    const tg = window.Telegram?.WebApp;
    if (isTelegram && tg) {
      try {
        tg.showAlert(message);
      } catch {
        alert(message);
      }
    } else {
      alert(message);
    }
  }, [isTelegram]);

  const showConfirm = React.useCallback((message: string): Promise<boolean> => {
    const tg = window.Telegram?.WebApp;
    if (isTelegram && tg) {
      try {
        return new Promise((resolve) => {
          tg.showConfirm(message, (confirmed: boolean) => {
            resolve(confirmed);
          });
        });
      } catch {
        return Promise.resolve(confirm(message));
      }
    }
    return Promise.resolve(confirm(message));
  }, [isTelegram]);

  const close = React.useCallback(() => {
    window.Telegram?.WebApp?.close();
  }, []);

  const expand = React.useCallback(() => {
    window.Telegram?.WebApp?.expand();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      chatId,
      isReady,
      isTelegram,
      colorScheme,
      hapticFeedback,
      showAlert,
      showConfirm,
      close,
      expand,
    }),
    [user, chatId, isReady, isTelegram, colorScheme, hapticFeedback, showAlert, showConfirm, close, expand],
  );

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}
