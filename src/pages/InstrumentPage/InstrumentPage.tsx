import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';
import { ArrowLeft, Bell, Plus } from '@gravity-ui/icons';
import { useTelegram } from '@/providers/TelegramProvider';
import { useTrackedInstruments, useCreateTracked, useDeleteTracked } from '@/hooks/useTracked';
import { PriceChart } from '@/components/PriceChart/PriceChart';
import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import { formatPrice } from '@/utils/format';
import type { InstrumentDto, TrackedInstrumentResponse } from '@/types/api';
import styles from './InstrumentPage.module.scss';

export function InstrumentPage() {
  const { figi } = useParams<{ figi: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, chatId, hapticFeedback, showConfirm } = useTelegram();

  const instrument = (location.state as { instrument?: InstrumentDto })?.instrument;
  const userId = user?.id ?? null;

  const { data: allTracked } = useTrackedInstruments(userId);
  const instrumentTracked = allTracked?.filter((t) => t.figi === figi) ?? [];

  const createMutation = useCreateTracked();
  const deleteMutation = useDeleteTracked();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<TrackedInstrumentResponse | null>(null);

  const handleCreateAlert = (buyPrice: number, sellPrice: number) => {
    if (!figi || !userId || !chatId || !instrument) {
      console.warn('Cannot create alert — missing data:', { figi, userId, chatId, instrument });
      return;
    }

    createMutation.mutate(
      {
        figi,
        instrumentName: instrument.name,
        buyPrice,
        sellPrice,
        userId,
        chatId,
      },
      {
        onSuccess: () => {
          hapticFeedback('notification');
          setDialogOpen(false);
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

  const handleEdit = (tracked: TrackedInstrumentResponse) => {
    setEditData(tracked);
    setDialogOpen(true);
  };

  return (
    <div className={styles['instrument-page']}>
      <div className={styles['instrument-page__back']}>
        <Button view="flat" size="m" onClick={() => navigate(-1)}>
          <Button.Icon>
            <ArrowLeft />
          </Button.Icon>
          Назад
        </Button>
      </div>

      <div className={styles['instrument-page__hero']}>
        <div className={styles['instrument-page__name']}>
          {instrument?.name ?? 'Инструмент'}
        </div>
        <div className={styles['instrument-page__figi']}>{figi}</div>
        {instrument?.price != null && (
          <div className={styles['instrument-page__current-price']}>
            {formatPrice(instrument.price)} ₽
          </div>
        )}
      </div>

      <div className={styles['instrument-page__chart']}>
        {figi && <PriceChart figi={figi} />}
      </div>

      <div className={styles['instrument-page__actions']}>
        <Button
          view="action"
          size="xl"
          width="max"
          onClick={() => {
            setEditData(null);
            setDialogOpen(true);
            hapticFeedback('impact');
          }}
        >
          <Button.Icon>
            <Plus />
          </Button.Icon>
          Создать алерт
        </Button>
      </div>

      {instrumentTracked.length > 0 && (
        <div className={styles['instrument-page__info-section']}>
          <div className={styles['instrument-page__info-title']}>
            <Bell style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Активные алерты ({instrumentTracked.length})
          </div>
          <div className={styles['instrument-page__alerts-list']}>
            {instrumentTracked.map((tracked, i) => (
              <TrackedCard
                key={tracked.id}
                tracked={tracked}
                onEdit={handleEdit}
                onDelete={handleDelete}
                delay={i * 50}
              />
            ))}
          </div>
        </div>
      )}

      <AlertDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        onSubmit={handleCreateAlert}
        instrumentName={instrument?.name ?? ''}
        figi={figi ?? ''}
        currentPrice={instrument?.price}
        editData={editData}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
