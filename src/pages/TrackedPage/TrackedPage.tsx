import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader } from '@gravity-ui/uikit';
import { BellDot, Plus } from '@gravity-ui/icons';
import { useTelegram } from '@/providers/TelegramProvider';
import {
  useTrackedInstruments,
  useUpdateTracked,
  useDeleteTracked,
} from '@/hooks/useTracked';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import type { TrackedInstrumentResponse } from '@/types/api';
import styles from './TrackedPage.module.scss';

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
    <div className={styles['tracked-page']}>
      <PageHeader
        title="Ценовые алерты"
        subtitle="Мониторинг цен ваших инструментов"
      />

      <div className={styles['tracked-page__header-actions']}>
        <Button view="outlined-action" size="m" onClick={() => navigate('/search')}>
          <Button.Icon>
            <Plus />
          </Button.Icon>
          Добавить инструмент
        </Button>
      </div>

      {isLoading ? (
        <div className={styles['tracked-page__loading']}>
          <Loader size="l" />
        </div>
      ) : trackedList && trackedList.length > 0 ? (
        <div className={styles['tracked-page__list']}>
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
          icon={<BellDot />}
          title="Нет алертов"
          description="Найдите акцию и установите ценовые границы — мы уведомим вас, когда цена выйдет за пределы"
          action={
            <Button view="action" size="l" onClick={() => navigate('/search')}>
              Найти акцию
            </Button>
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
