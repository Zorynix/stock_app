import { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Text } from '@gravity-ui/uikit';
import type { TrackedInstrumentResponse } from '@/types/api';
import styles from './AlertDialog.module.scss';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (buyPrice: number, sellPrice: number) => void;
  instrumentName: string;
  figi: string;
  currentPrice?: number;
  editData?: TrackedInstrumentResponse | null;
  isLoading?: boolean;
}

export function AlertDialog({
  open,
  onClose,
  onSubmit,
  instrumentName,
  currentPrice,
  editData,
  isLoading,
}: AlertDialogProps) {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setBuyPrice(String(editData.buyPrice));
      setSellPrice(String(editData.sellPrice));
    } else if (currentPrice) {
      setBuyPrice(String((currentPrice * 0.95).toFixed(2)));
      setSellPrice(String((currentPrice * 1.05).toFixed(2)));
    } else {
      setBuyPrice('');
      setSellPrice('');
    }
    setError('');
  }, [editData, currentPrice, open]);

  const handleSubmit = () => {
    console.log('[AlertDialog] handleSubmit called', { buyPrice, sellPrice });
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(buy) || isNaN(sell)) {
      console.log('[AlertDialog] NaN check failed', { buy, sell });
      setError('Введите корректные числа');
      return;
    }
    if (buy <= 0 || sell <= 0) {
      console.log('[AlertDialog] <= 0 check failed');
      setError('Цены должны быть больше нуля');
      return;
    }
    if (buy >= sell) {
      console.log('[AlertDialog] buy >= sell check failed');
      setError('Цена покупки должна быть меньше цены продажи');
      return;
    }

    console.log('[AlertDialog] calling onSubmit', { buy, sell });
    onSubmit(buy, sell);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '24px', minWidth: '320px' }}>
        <div style={{ marginBottom: '4px' }}>
          <Text variant="header-1">
            {editData ? 'Редактировать алерт' : 'Создать алерт'}
          </Text>
        </div>
        <div style={{ marginBottom: '4px' }}>
          <Text variant="body-1" color="brand">
            {instrumentName}
          </Text>
          {currentPrice != null && (
            <Text variant="body-1" color="positive">
              {' '}• {currentPrice.toFixed(2)} ₽
            </Text>
          )}
        </div>

        <div className={styles['alert-dialog__form']}>
          <div className={styles['alert-dialog__field']}>
            <label className={styles['alert-dialog__label']}>
              Цена покупки (уведомить, когда цена упадёт ниже)
            </label>
            <TextInput
              value={buyPrice}
              onUpdate={setBuyPrice}
              placeholder="0.00"
              size="l"
              autoFocus
            />
          </div>

          <div className={styles['alert-dialog__field']}>
            <label className={styles['alert-dialog__label']}>
              Цена продажи (уведомить, когда цена поднимется выше)
            </label>
            <TextInput
              value={sellPrice}
              onUpdate={setSellPrice}
              placeholder="0.00"
              size="l"
            />
          </div>

          {error && <div className={styles['alert-dialog__error']}>{error}</div>}

          <div className={styles['alert-dialog__footer']}>
            <Button view="flat" size="l" onClick={onClose}>
              Отмена
            </Button>
            <Button view="action" size="l" onClick={handleSubmit} loading={isLoading}>
              {editData ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
