import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TrackedInstrumentResponse } from '@/types/api';
import { formatPrice, formatDate } from '@/utils/format';

interface TrackedCardProps {
  tracked: TrackedInstrumentResponse;
  onEdit: (tracked: TrackedInstrumentResponse) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export function TrackedCard({ tracked, onEdit, onDelete }: TrackedCardProps) {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{tracked.instrumentName}</div>
          <div className="text-xs text-muted-foreground">{tracked.figi}</div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit(tracked)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(tracked.id)}>
            <Trash2 className="w-4 h-4 text-negative" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-positive/10 border border-positive/20 rounded-xl p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5">Покупка</div>
          <div className="text-sm font-semibold text-positive">{formatPrice(tracked.buyPrice)} ₽</div>
        </div>
        <div className="bg-negative/10 border border-negative/20 rounded-xl p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5">Продажа</div>
          <div className="text-sm font-semibold text-negative">{formatPrice(tracked.sellPrice)} ₽</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatDate(tracked.createdAt)}</span>
        <div className="flex gap-1">
          {tracked.buyAlertSent && <Badge variant="success">Покупка ↓</Badge>}
          {tracked.sellAlertSent && <Badge variant="destructive">Продажа ↑</Badge>}
          {!tracked.buyAlertSent && !tracked.sellAlertSent && (
            <Badge variant="normal">Мониторинг</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
