import { Badge } from '@/components/ui/badge';
import type { NotificationResponse } from '@/types/api';
import { formatPrice, formatDate } from '@/utils/format';

interface NotificationCardProps {
  notification: NotificationResponse;
  delay?: number;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const isBuy = notification.alertType === 'BUY';
  const emoji = isBuy ? '📉' : '📈';
  const typeLabel = isBuy ? 'Покупка' : 'Продажа';

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-foreground truncate">
            {notification.instrumentName}
          </span>
        </div>
        <Badge variant={isBuy ? 'success' : 'destructive'}>{typeLabel}</Badge>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          Цена: <b className="text-foreground">{formatPrice(notification.currentPrice)} ₽</b>
        </span>
        <span>
          Порог: <b className="text-foreground">{formatPrice(notification.threshold)} ₽</b>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
        <Badge variant={notification.sentToTelegram ? 'success' : 'warning'}>
          {notification.sentToTelegram ? 'Отправлено' : 'Не отправлено'}
        </Badge>
      </div>
    </div>
  );
}
