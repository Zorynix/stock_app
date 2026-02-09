import { apiClient } from './client';
import type { InstrumentDto, CandleDto } from '@/types/api';

export const instrumentApi = {
  search: async (name: string): Promise<InstrumentDto[]> => {
    const { data } = await apiClient.get<InstrumentDto[]>('/instruments/search', {
      params: { name },
    });
    return data;
  },

  getCandles: async (figi: string, from: string, to: string): Promise<CandleDto[]> => {
    const { data } = await apiClient.get<CandleDto[]>(`/instruments/${figi}/candles`, {
      params: { from, to },
    });
    return data;
  },
};
