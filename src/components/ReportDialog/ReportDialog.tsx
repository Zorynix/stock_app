import { useState } from 'react';
import { Modal, Button, Text } from '@gravity-ui/uikit';
import type { ReportPeriod } from '@/types/api';
import styles from './ReportDialog.module.scss';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onDownload: (period: ReportPeriod) => void;
  instrumentName: string;
  isLoading?: boolean;
}

const PERIODS: { key: ReportPeriod; label: string }[] = [
  { key: '1m', label: '1 месяц' },
  { key: '3m', label: '3 месяца' },
  { key: '6m', label: '6 месяцев' },
  { key: '1y', label: '1 год' },
];

export function ReportDialog({
  open,
  onClose,
  onDownload,
  instrumentName,
  isLoading,
}: ReportDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('1m');

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '24px', minWidth: '320px' }}>
        <div style={{ marginBottom: '8px' }}>
          <Text variant="header-1">Экспорт отчёта</Text>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Text variant="body-1" color="secondary">
            {instrumentName}
          </Text>
        </div>

        <div className={styles['report-dialog__periods']}>
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles['report-dialog__period-btn']} ${
                selectedPeriod === key ? styles['report-dialog__period-btn--active'] : ''
              }`}
              onClick={() => setSelectedPeriod(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles['report-dialog__footer']}>
          <Button view="flat" size="l" onClick={onClose}>
            Отмена
          </Button>
          <Button
            view="action"
            size="l"
            onClick={() => onDownload(selectedPeriod)}
            loading={isLoading}
          >
            Скачать PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
