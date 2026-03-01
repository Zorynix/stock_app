import { useState } from 'react';
import { Modal, Button, Text } from '@gravity-ui/uikit';
import type { ReportPeriod, ReportFormat } from '@/types/api';
import styles from './ReportDialog.module.scss';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onDownload: (period: ReportPeriod, format: ReportFormat) => void;
  instrumentName: string;
  isLoading?: boolean;
}

const PERIODS: { key: ReportPeriod; label: string }[] = [
  { key: '1m', label: '1 месяц' },
  { key: '3m', label: '3 месяца' },
  { key: '6m', label: '6 месяцев' },
  { key: '1y', label: '1 год' },
];

const FORMATS: { key: ReportFormat; label: string; description: string }[] = [
  { key: 'pdf', label: 'PDF', description: 'С графиком свечей' },
  { key: 'md', label: 'Markdown', description: 'Текст и таблицы' },
];

export function ReportDialog({
  open,
  onClose,
  onDownload,
  instrumentName,
  isLoading,
}: ReportDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('1m');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');

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

        <div className={styles['report-dialog__section-label']}>Период</div>
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

        <div className={styles['report-dialog__section-label']}>Формат</div>
        <div className={styles['report-dialog__formats']}>
          {FORMATS.map(({ key, label, description }) => (
            <button
              key={key}
              className={`${styles['report-dialog__format-btn']} ${
                selectedFormat === key ? styles['report-dialog__format-btn--active'] : ''
              }`}
              onClick={() => setSelectedFormat(key)}
              type="button"
            >
              <span className={styles['report-dialog__format-label']}>{label}</span>
              <span className={styles['report-dialog__format-desc']}>{description}</span>
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
            onClick={() => onDownload(selectedPeriod, selectedFormat)}
            loading={isLoading}
          >
            Скачать {selectedFormat.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
