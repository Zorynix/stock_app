import { useQuery } from '@tanstack/react-query';
import { instrumentApi } from '@/api/instruments';

export function useSearchInstruments(query: string) {
  return useQuery({
    queryKey: ['instruments', 'search', query],
    queryFn: () => instrumentApi.search(query),
    enabled: query.length >= 2,
    placeholderData: (prev) => prev,
  });
}

export function useCandles(figi: string, from: string, to: string) {
  return useQuery({
    queryKey: ['instruments', 'candles', figi, from, to],
    queryFn: () => instrumentApi.getCandles(figi, from, to),
    enabled: !!figi && !!from && !!to,
  });
}
