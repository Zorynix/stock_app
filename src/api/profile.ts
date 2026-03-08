import { apiClient } from './client';
import type { AddEmailResponse, AuthResponse, ConflictResolution, ProfileResponse } from '@/types/api';

export const profileApi = {
  get: async (): Promise<ProfileResponse> => {
    const { data } = await apiClient.get<ProfileResponse>('/profile');
    return data;
  },

  updateNotifications: async (enabled: boolean): Promise<ProfileResponse> => {
    const { data } = await apiClient.patch<ProfileResponse>('/profile/notifications', { enabled });
    return data;
  },

  linkTelegram: async (initData: string): Promise<ProfileResponse> => {
    const { data } = await apiClient.post<ProfileResponse>('/profile/link-telegram', { initData });
    return data;
  },

  resolveConflict: async (
    initData: string,
    resolution: 'KEEP_WEB' | 'KEEP_TELEGRAM' | 'MERGE',
  ): Promise<ProfileResponse> => {
    const { data } = await apiClient.post<ProfileResponse>('/profile/link-telegram/resolve', {
      initData,
      resolution,
    });
    return data;
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/profile');
  },

  addEmail: async (email: string, password: string): Promise<AddEmailResponse> => {
    const { data } = await apiClient.post<AddEmailResponse>('/profile/add-email', { email, password });
    return data;
  },

  verifyAddEmail: async (
    email: string,
    code: string,
    resolution?: ConflictResolution,
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/profile/verify-add-email', {
      email,
      code,
      resolution,
    });
    return data;
  },
};
