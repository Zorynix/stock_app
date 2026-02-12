import { apiClient } from './client';

export const reportsApi = {
  downloadStockReport: async (figi: string, name: string, period: string): Promise<Blob> => {
    const { data } = await apiClient.get('/reports/stock', {
      params: { figi, name, period },
      responseType: 'blob',
    });
    return data;
  },
};
