import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackedApi } from '@/api/tracked';
import type { TrackedInstrumentRequest } from '@/types/api';

export function useTrackedInstruments() {
  return useQuery({
    queryKey: ['tracked-instruments'],
    queryFn: () => trackedApi.getAll(),
  });
}

export function useTrackedInstrument(id: string | undefined) {
  return useQuery({
    queryKey: ['tracked-instruments', 'detail', id],
    queryFn: () => trackedApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateTracked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: TrackedInstrumentRequest) => trackedApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-instruments'] });
    },
  });
}

export function useUpdateTracked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: TrackedInstrumentRequest }) =>
      trackedApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-instruments'] });
    },
  });
}

export function useDeleteTracked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trackedApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-instruments'] });
    },
  });
}
