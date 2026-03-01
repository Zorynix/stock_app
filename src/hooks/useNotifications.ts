import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
    refetchInterval: 15_000,
  });
}
