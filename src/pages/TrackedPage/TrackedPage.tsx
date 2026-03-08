import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellDot, Plus } from 'lucide-react';
import { useTelegram } from '@/providers/TelegramProvider';
import { useTrackedInstruments, useUpdateTracked, useDeleteTracked } from '@/hooks/useTracked';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import { Button } from '@/components/ui/button';
import type { TrackedInstrumentResponse } from '@/types/api';

export function TrackedPage() {
  const navigate = useNavigate();
  const { hapticFeedback, showConfirm } = useTelegram();

  const { data: trackedList, isLoading } = useTrackedInstruments();
  const updateMutation = useUpdateTracked();
  const deleteMutation = useDeleteTracked();

  const [editData, setEditData] = useState<TrackedInstrumentResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (tracked: TrackedInstrumentResponse) => {
    setEditData(tracked);
    setDialogOpen(true);
  };

  const handleUpdateSubmit = (buyPrice: number, sellPrice: number) => {
    if (!editData) return;

    updateMutation.mutate(
      {
        id: editData.id,
        request: {
          figi: editData.figi,
          instrumentName: editData.instrumentName,
          buyPrice,
          sellPrice,
        },
      },
      {
        onSuccess: () => {
          hapticFeedback('notification');
          setDialogOpen(false);
          setEditData(null);
        },
      },
    );
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Удалить этот алерт?');
    if (confirmed) {
      deleteMutation.mutate(id, {
        onSuccess: () => hapticFeedback('notification'),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Ценовые алерты" subtitle="Мониторинг цен ваших инструментов" />

      <div className="px-4 pb-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
          <Plus className="w-4 h-4" /> Добавить инструмент
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : trackedList && trackedList.length > 0 ? (
        <div className="px-4 space-y-2 pb-4">
          {trackedList.map((tracked, i) => (
            <TrackedCard
              key={tracked.id}
              tracked={tracked}
              onEdit={handleEdit}
              onDelete={handleDelete}
              delay={i * 50}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BellDot className="w-6 h-6" />}
          title="Нет алертов"
          description="Найдите акцию и установите ценовые границы — мы уведомим вас, когда цена выйдет за пределы"
          action={
            <Button onClick={() => navigate('/search')}>Найти акцию</Button>
          }
        />
      )}

      <AlertDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        onSubmit={handleUpdateSubmit}
        instrumentName={editData?.instrumentName ?? ''}
        figi={editData?.figi ?? ''}
        editData={editData}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
