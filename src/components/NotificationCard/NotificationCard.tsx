import { Label } from '@gravity-ui/uikit';
import type { NotificationResponse } from '@/types/api';
import { formatPrice, formatDate } from '@/utils/format';
import styles from './NotificationCard.module.scss';

interface NotificationCardProps {
  notification: NotificationResponse;
  delay?: number;
}

export function NotificationCard({ notification, delay = 0 }: NotificationCardProps) {
  const isBuy = notification.alertType === 'BUY';
  const emoji = isBuy ? '📉' : '📈';
  const typeLabel = isBuy ? 'Покупка' : 'Продажа';

  return (
    <div
      className={styles['notification-card']}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles['notification-card__header']}>
        <div className={styles['notification-card__title']}>
          <span className={styles['notification-card__emoji']}>{emoji}</span>
          <span>{notification.instrumentName}</span>
        </div>
        <Label theme={isBuy ? 'success' : 'danger'} size="xs">
          {typeLabel}
        </Label>
      </div>

      <div className={styles['notification-card__body']}>
        <div className={styles['notification-card__prices']}>
          <span>Цена: <b>{formatPrice(notification.currentPrice)} ₽</b></span>
          <span>Порог: <b>{formatPrice(notification.threshold)} ₽</b></span>
        </div>
      </div>

      <div className={styles['notification-card__footer']}>
        <span className={styles['notification-card__date']}>
          {formatDate(notification.createdAt)}
        </span>
        <div className={styles['notification-card__status']}>
          {notification.sentToTelegram ? (
            <Label theme="success" size="xs">Отправлено</Label>
          ) : (
            <Label theme="warning" size="xs">Не отправлено</Label>
          )}
        </div>
      </div>
    </div>
  );
}
