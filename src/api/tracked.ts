import { apiClient } from './client';
import type { TrackedInstrumentRequest, TrackedInstrumentResponse } from '@/types/api';

export const trackedApi = {
  getAll: async (userId: number): Promise<TrackedInstrumentResponse[]> => {
    const { data } = await apiClient.get<TrackedInstrumentResponse[]>('/tracked-instruments', {
      params: { userId },
    });
    return data;
  },

  getById: async (id: string): Promise<TrackedInstrumentResponse> => {
    const { data } = await apiClient.get<TrackedInstrumentResponse>(`/tracked-instruments/${id}`);
    return data;
  },

  create: async (request: TrackedInstrumentRequest): Promise<TrackedInstrumentResponse> => {
    const { data } = await apiClient.post<TrackedInstrumentResponse>(
      '/tracked-instruments',
      request,
    );
    return data;
  },

  update: async (
    id: string,
    request: TrackedInstrumentRequest,
  ): Promise<TrackedInstrumentResponse> => {
    const { data } = await apiClient.put<TrackedInstrumentResponse>(
      `/tracked-instruments/${id}`,
      request,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tracked-instruments/${id}`);
  },
};
