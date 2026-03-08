import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { setStoredAuth } from '@/api/client';
import type { ConflictResolution } from '@/types/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
    staleTime: 30_000,
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => profileApi.updateNotifications(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useLinkTelegram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (initData: string) => profileApi.linkTelegram(initData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useResolveConflict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      initData,
      resolution,
    }: {
      initData: string;
      resolution: 'KEEP_WEB' | 'KEEP_TELEGRAM' | 'MERGE';
    }) => profileApi.resolveConflict(initData, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => profileApi.deleteAccount(),
  });
}

export function useAddEmail() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      profileApi.addEmail(email, password),
  });
}

export function useVerifyAddEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      email,
      code,
      resolution,
    }: {
      email: string;
      code: string;
      resolution?: ConflictResolution;
    }) => profileApi.verifyAddEmail(email, code, resolution),
    onSuccess: (authResponse) => {
      // Обновляем JWT в localStorage (особенно важно при LINK-сценарии, когда ID меняется)
      setStoredAuth(authResponse);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
