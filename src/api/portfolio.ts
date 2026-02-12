import { apiClient } from './client';
import type { AccountDto, PortfolioResponse, OperationDto } from '@/types/api';

export const portfolioApi = {
  getAccounts: async (): Promise<AccountDto[]> => {
    const { data } = await apiClient.get<AccountDto[]>('/accounts');
    return data;
  },

  getPortfolio: async (accountId: string): Promise<PortfolioResponse> => {
    const { data } = await apiClient.get<PortfolioResponse>(`/portfolio/${accountId}`);
    return data;
  },

  getOperations: async (accountId: string, from: string, to: string): Promise<OperationDto[]> => {
    const { data } = await apiClient.get<OperationDto[]>(`/portfolio/${accountId}/operations`, {
      params: { from, to },
    });
    return data;
  },
};
