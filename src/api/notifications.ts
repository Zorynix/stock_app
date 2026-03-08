import { apiClient } from './client';
import type { NotificationResponse } from '@/types/api';

export const notificationsApi = {
  getAll: async (): Promise<NotificationResponse[]> => {
    const { data } = await apiClient.get<NotificationResponse[]>('/notifications');
    return data;
  },
};
