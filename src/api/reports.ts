import { apiClient } from './client';
import type { ReportFormat } from '@/types/api';

export const reportsApi = {
  downloadStockReport: async (
    figi: string,
    name: string,
    period: string,
    format: ReportFormat,
  ): Promise<Blob> => {
    const { data } = await apiClient.get('/reports/stock', {
      params: { figi, name, period, format },
      responseType: 'blob',
      timeout: 30_000,
    });
    return data;
  },
};
