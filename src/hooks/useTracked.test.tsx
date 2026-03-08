import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTrackedInstruments,
  useTrackedInstrument,
  useCreateTracked,
  useUpdateTracked,
  useDeleteTracked,
} from './useTracked';
import { trackedApi } from '@/api/tracked';
import type { TrackedInstrumentResponse } from '@/types/api';

vi.mock('@/api/tracked', () => ({
  trackedApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockTracked: TrackedInstrumentResponse = {
  id: 'ti-1',
  figi: 'BBG000B9XRY4',
  instrumentName: 'Apple',
  buyPrice: 90,
  sellPrice: 110,
  buyAlertSent: false,
  sellAlertSent: false,
  createdAt: '2024-01-01T00:00:00Z',
  appUserId: 'user-1',
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

describe('useTrackedInstruments', () => {
  it('fetches and returns list of tracked instruments', async () => {
    vi.mocked(trackedApi.getAll).mockResolvedValue([mockTracked]);
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useTrackedInstruments(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(trackedApi.getAll).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual([mockTracked]);
  });

  it('exposes error when fetch fails', async () => {
    vi.mocked(trackedApi.getAll).mockRejectedValue(new Error('network'));
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useTrackedInstruments(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useTrackedInstrument', () => {
  it('fetches a single instrument by id', async () => {
    vi.mocked(trackedApi.getById).mockResolvedValue(mockTracked);
    const { Wrapper } = buildWrapper();

    const { result } = renderHook(() => useTrackedInstrument('ti-1'), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(trackedApi.getById).toHaveBeenCalledWith('ti-1');
    expect(result.current.data).toEqual(mockTracked);
  });

  it('does not fetch when id is undefined', () => {
    const { Wrapper } = buildWrapper();
    const { result } = renderHook(() => useTrackedInstrument(undefined), { wrapper: Wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(trackedApi.getById).not.toHaveBeenCalled();
  });
});

describe('useCreateTracked', () => {
  it('calls trackedApi.create and invalidates cache on success', async () => {
    vi.mocked(trackedApi.create).mockResolvedValue(mockTracked);
    const { Wrapper, queryClient } = buildWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateTracked(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({
        figi: 'BBG000B9XRY4',
        instrumentName: 'Apple',
        buyPrice: 90,
        sellPrice: 110,
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(trackedApi.create).toHaveBeenCalledWith({
      figi: 'BBG000B9XRY4',
      instrumentName: 'Apple',
      buyPrice: 90,
      sellPrice: 110,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tracked-instruments'] });
  });
});

describe('useUpdateTracked', () => {
  it('calls trackedApi.update and invalidates cache on success', async () => {
    vi.mocked(trackedApi.update).mockResolvedValue(mockTracked);
    const { Wrapper, queryClient } = buildWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateTracked(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate({
        id: 'ti-1',
        request: { figi: 'BBG000B9XRY4', instrumentName: 'Apple', buyPrice: 80, sellPrice: 120 },
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(trackedApi.update).toHaveBeenCalledWith('ti-1', {
      figi: 'BBG000B9XRY4',
      instrumentName: 'Apple',
      buyPrice: 80,
      sellPrice: 120,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tracked-instruments'] });
  });
});

describe('useDeleteTracked', () => {
  it('calls trackedApi.delete and invalidates cache on success', async () => {
    vi.mocked(trackedApi.delete).mockResolvedValue(undefined);
    const { Wrapper, queryClient } = buildWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteTracked(), { wrapper: Wrapper });

    await act(async () => {
      result.current.mutate('ti-1');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(trackedApi.delete).toHaveBeenCalledWith('ti-1');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tracked-instruments'] });
  });
});
