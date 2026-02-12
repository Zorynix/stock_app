import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';

export function useNotifications(userId: number | null) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationsApi.getAll(userId!),
    enabled: !!userId,
    refetchInterval: 15_000,
  });
}
