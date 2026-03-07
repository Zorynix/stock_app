import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';
import { authApi } from '@/api/auth';
import * as clientModule from '@/api/client';
import type { AuthResponse } from '@/types/api';

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    telegramAuth: vi.fn(),
    verifyEmail: vi.fn(),
    resendCode: vi.fn(),
  },
}));

vi.mock('@/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof clientModule>();
  return {
    ...actual,
    getStoredAuth: vi.fn(),
    setStoredAuth: vi.fn(),
  };
});

const mockAuth: AuthResponse = {
  token: 'jwt-token',
  userId: 'user-1',
  email: 'test@mail.com',
  telegramId: null,
  emailConfirmed: true,
  telegramLinked: false,
  emailNotificationsEnabled: true,
};

function TestConsumer() {
  const { isAuthenticated, isLoading, authUser, pendingEmail } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user-id">{authUser?.userId ?? 'none'}</span>
      <span data-testid="pending">{pendingEmail ?? 'none'}</span>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: no stored auth, no Telegram
  vi.mocked(clientModule.getStoredAuth).mockReturnValue(null);
  Object.defineProperty(window, 'Telegram', { value: undefined, writable: true, configurable: true });
});

afterEach(() => {
  Object.defineProperty(window, 'Telegram', { value: undefined, writable: true, configurable: true });
});

describe('AuthProvider — initial state', () => {
  it('starts unauthenticated when no stored auth', async () => {
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('none');
  });

  it('starts authenticated when valid token in storage', async () => {
    vi.mocked(clientModule.getStoredAuth).mockReturnValue(mockAuth as unknown as { token: string });
    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user-id').textContent).toBe('user-1');
  });
});

describe('AuthProvider — Telegram auto-auth', () => {
  it('calls telegramAuth when initData is present', async () => {
    vi.mocked(authApi.telegramAuth).mockResolvedValue(mockAuth);
    Object.defineProperty(window, 'Telegram', {
      value: { WebApp: { initData: 'tg-init-data' } },
      writable: true,
      configurable: true,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    expect(authApi.telegramAuth).toHaveBeenCalledWith('tg-init-data');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('stays unauthenticated when telegramAuth fails', async () => {
    vi.mocked(authApi.telegramAuth).mockRejectedValue(new Error('invalid'));
    Object.defineProperty(window, 'Telegram', {
      value: { WebApp: { initData: 'tg-init-data' } },
      writable: true,
      configurable: true,
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });
});

describe('AuthProvider — login', () => {
  it('sets auth user after successful login', async () => {
    vi.mocked(authApi.login).mockResolvedValue(mockAuth);

    function LoginButton() {
      const { login } = useAuth();
      return <button onClick={() => login('test@mail.com', 'password')}>login</button>;
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <LoginButton />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    await act(async () => {
      screen.getByRole('button', { name: 'login' }).click();
    });

    expect(authApi.login).toHaveBeenCalledWith('test@mail.com', 'password');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(clientModule.setStoredAuth).toHaveBeenCalledWith(mockAuth);
  });
});

describe('AuthProvider — register', () => {
  it('sets pendingEmail when email not confirmed after register', async () => {
    const unconfirmedAuth: AuthResponse = { ...mockAuth, emailConfirmed: false };
    vi.mocked(authApi.register).mockResolvedValue(unconfirmedAuth);

    function RegisterButton() {
      const { register } = useAuth();
      return <button onClick={() => register('new@mail.com', 'pass')}>register</button>;
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <RegisterButton />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    await act(async () => {
      screen.getByRole('button', { name: 'register' }).click();
    });

    expect(screen.getByTestId('pending').textContent).toBe('test@mail.com');
  });

  it('does not set pendingEmail when email is confirmed', async () => {
    vi.mocked(authApi.register).mockResolvedValue(mockAuth);

    function RegisterButton() {
      const { register } = useAuth();
      return <button onClick={() => register('test@mail.com', 'pass')}>register</button>;
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <RegisterButton />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    await act(async () => {
      screen.getByRole('button', { name: 'register' }).click();
    });

    expect(screen.getByTestId('pending').textContent).toBe('none');
  });
});

describe('AuthProvider — logout', () => {
  it('clears auth state on logout', async () => {
    vi.mocked(clientModule.getStoredAuth).mockReturnValue(mockAuth as unknown as { token: string });

    function LogoutButton() {
      const { logout } = useAuth();
      return <button onClick={logout}>logout</button>;
    }

    render(
      <AuthProvider>
        <TestConsumer />
        <LogoutButton />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));
    await act(async () => {
      screen.getByRole('button', { name: 'logout' }).click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(clientModule.setStoredAuth).toHaveBeenCalledWith(null);
  });
});

describe('AuthProvider — auth:expired event', () => {
  it('clears auth when auth:expired event fires', async () => {
    vi.mocked(clientModule.getStoredAuth).mockReturnValue(mockAuth as unknown as { token: string });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));

    await act(async () => {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });
});
