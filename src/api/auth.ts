import { apiClient } from './client';
import type { AuthResponse } from '@/types/api';

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', { email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  telegramAuth: async (initData: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/telegram', { initData });
    return data;
  },

  verifyEmail: async (email: string, code: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/verify', { email, code });
    return data;
  },

  resendCode: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-code', { email });
  },
};
