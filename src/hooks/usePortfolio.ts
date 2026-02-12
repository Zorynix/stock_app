import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '@/api/portfolio';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => portfolioApi.getAccounts(),
  });
}

export function usePortfolio(accountId: string | null) {
  return useQuery({
    queryKey: ['portfolio', accountId],
    queryFn: () => portfolioApi.getPortfolio(accountId!),
    enabled: !!accountId,
    refetchInterval: 30_000,
  });
}

export function useOperations(accountId: string | null, from: string, to: string) {
  return useQuery({
    queryKey: ['operations', accountId, from, to],
    queryFn: () => portfolioApi.getOperations(accountId!, from, to),
    enabled: !!accountId && !!from && !!to,
  });
}
