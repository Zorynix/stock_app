import { apiClient } from './client';
import type { NotificationResponse } from '@/types/api';

export const notificationsApi = {
  getAll: async (userId: number): Promise<NotificationResponse[]> => {
    const { data } = await apiClient.get<NotificationResponse[]>('/notifications', {
      params: { userId },
    });
    return data;
  },
};
