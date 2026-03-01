import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Plus, Download } from 'lucide-react';
import { useTelegram } from '@/providers/TelegramProvider';
import { useTrackedInstruments, useCreateTracked, useDeleteTracked } from '@/hooks/useTracked';
import { PriceChart } from '@/components/PriceChart/PriceChart';
import { AlertDialog } from '@/components/AlertDialog/AlertDialog';
import { ReportDialog } from '@/components/ReportDialog/ReportDialog';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import { Button } from '@/components/ui/button';
import { reportsApi } from '@/api/reports';
import { formatPrice } from '@/utils/format';
import type { InstrumentDto, TrackedInstrumentResponse, ReportPeriod, ReportFormat } from '@/types/api';

export function InstrumentPage() {
  const { figi } = useParams<{ figi: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { hapticFeedback, showConfirm } = useTelegram();

  const instrument = (location.state as { instrument?: InstrumentDto })?.instrument;

  const { data: allTracked } = useTrackedInstruments();
  const instrumentTracked = allTracked?.filter((t) => t.figi === figi) ?? [];

  const createMutation = useCreateTracked();
  const deleteMutation = useDeleteTracked();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<TrackedInstrumentResponse | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const handleCreateAlert = (buyPrice: number, sellPrice: number) => {
    if (!figi || !instrument) return;

    createMutation.mutate(
      { figi, instrumentName: instrument.name, buyPrice, sellPrice },
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

  const handleDownloadReport = async (period: ReportPeriod, format: ReportFormat) => {
    if (!figi || !instrument) return;
    setReportLoading(true);
    try {
      const blob = await reportsApi.downloadStockReport(figi, instrument.name, period, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${figi}_${period}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      hapticFeedback('notification');
      setReportDialogOpen(false);
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Назад
      </Button>

      {/* Hero */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-foreground">{instrument?.name ?? 'Инструмент'}</h1>
        <p className="text-xs text-muted-foreground">{figi}</p>
        {instrument?.price != null && (
          <p className="text-2xl font-bold text-primary">{formatPrice(instrument.price)} ₽</p>
        )}
      </div>

      {/* Chart */}
      <div className="bg-card border border-card-border rounded-2xl p-4">
        {figi && <PriceChart figi={figi} />}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            setEditData(null);
            setDialogOpen(true);
            hapticFeedback('impact');
          }}
        >
          <Plus className="w-4 h-4" /> Создать алерт
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            setReportDialogOpen(true);
            hapticFeedback('impact');
          }}
        >
          <Download className="w-4 h-4" /> Отчёт
        </Button>
      </div>

      {/* Active alerts */}
      {instrumentTracked.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Bell className="w-4 h-4 text-primary" />
            Активные алерты ({instrumentTracked.length})
          </div>
          <div className="space-y-2">
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

      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onDownload={handleDownloadReport}
        instrumentName={instrument?.name ?? ''}
        isLoading={reportLoading}
      />
    </div>
  );
}
