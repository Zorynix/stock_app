import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReportPeriod, ReportFormat } from '@/types/api';

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
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Экспорт отчёта</DialogTitle>
          <p className="text-sm text-muted-foreground">{instrumentName}</p>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Период
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PERIODS.map(({ key, label }) => (
                <button
                  key={key}
                  className={cn(
                    'py-2 px-3 rounded-xl text-sm font-medium border transition-colors',
                    selectedPeriod === key
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'border-card-border text-muted-foreground hover:text-foreground hover:bg-secondary',
                  )}
                  onClick={() => setSelectedPeriod(key)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Формат
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map(({ key, label, description }) => (
                <button
                  key={key}
                  className={cn(
                    'py-2 px-3 rounded-xl text-left border transition-colors',
                    selectedFormat === key
                      ? 'bg-primary/15 border-primary/40'
                      : 'border-card-border hover:bg-secondary',
                  )}
                  onClick={() => setSelectedFormat(key)}
                  type="button"
                >
                  <div
                    className={cn(
                      'text-sm font-medium',
                      selectedFormat === key ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Отмена
            </Button>
            <Button
              className="flex-1"
              onClick={() => onDownload(selectedPeriod, selectedFormat)}
              loading={isLoading}
            >
              Скачать {selectedFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
