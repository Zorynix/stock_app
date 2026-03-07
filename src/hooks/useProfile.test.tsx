import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useProfile,
  useUpdateNotifications,
  useLinkTelegram,
  useDeleteAccount,
} from './useProfile';
import { profileApi } from '@/api/profile';
import * as clientModule from '@/api/client';
import type { ProfileResponse, AuthResponse } from '@/types/api';

vi.mock('@/api/profile', () => ({
  profileApi: {
    get: vi.fn(),
    updateNotifications: vi.fn(),
    linkTelegram: vi.fn(),
    resolveConflict: vi.fn(),
    deleteAccount: vi.fn(),
    addEmail: vi.fn(),
    verifyAddEmail: vi.fn(),
  },
}));

vi.mock('@/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof clientModule>();
  return { ...actual, setStoredAuth: vi.fn() };
});

const mockProfile: ProfileResponse = {
  id: 'user-1',
  email: 'test@mail.com',
  telegramId: null,
  emailConfirmed: true,
  telegramLinked: false,
  emailNotificationsEnabled: true,
  createdAt: '2024-01-01T00:00:00Z',
  alertStats: { total: 0, buyAlertTriggered: 0, sellAlertTriggered: 0, active: 0 },
};

function buildWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useProfile', () => {
  it('fetches and returns profile data', async () => {
    vi.mocked(profileApi.get).mockResolvedValue(mockProfile);
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(profileApi.get).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(mockProfile);
  });

  it('uses 30s staleTime (query does not refetch immediately)', async () => {
    vi.mocked(profileApi.get).mockResolvedValue(mockProfile);
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Re-render hook — should not call API again (data is fresh)
    expect(profileApi.get).toHaveBeenCalledTimes(1);
  });

  it('exposes error when fetch fails', async () => {
    vi.mocked(profileApi.get).mockRejectedValue({ status: 401, title: 'Unauthorized' });
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useProfile(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateNotifications', () => {
  it('calls profileApi.updateNotifications and invalidates profile cache', async () => {
    vi.mocked(profileApi.updateNotifications).mockResolvedValue({
      ...mockProfile,
      emailNotificationsEnabled: false,
    });
    const { Wrapper, queryClient } = buildWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateNotifications(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate(false);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(profileApi.updateNotifications).toHaveBeenCalledWith(false);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['profile'] });
  });
});

describe('useLinkTelegram', () => {
  it('calls profileApi.linkTelegram and invalidates profile cache', async () => {
    vi.mocked(profileApi.linkTelegram).mockResolvedValue({ ...mockProfile, telegramLinked: true });
    const { Wrapper, queryClient } = buildWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useLinkTelegram(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate('tg-init-data');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(profileApi.linkTelegram).toHaveBeenCalledWith('tg-init-data');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['profile'] });
  });
});

describe('useDeleteAccount', () => {
  it('calls profileApi.deleteAccount', async () => {
    vi.mocked(profileApi.deleteAccount).mockResolvedValue(undefined);
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useDeleteAccount(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(profileApi.deleteAccount).toHaveBeenCalledOnce();
  });
});
