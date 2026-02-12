import { Loader } from '@gravity-ui/uikit';
import { Bell } from '@gravity-ui/icons';
import { useTelegram } from '@/providers/TelegramProvider';
import { useNotifications } from '@/hooks/useNotifications';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { NotificationCard } from '@/components/NotificationCard/NotificationCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import styles from './NotificationsPage.module.scss';

export function NotificationsPage() {
  const { user } = useTelegram();
  const userId = user?.id ?? null;
  const { data: notifications, isLoading } = useNotifications(userId);

  return (
    <div className={styles['notifications-page']}>
      <PageHeader
        title="Уведомления"
        subtitle="История ценовых алертов"
      />

      <div className={styles['notifications-page__info']}>
        Алерты автоматически отправляются в Telegram, когда цена акции выходит за установленные границы.
      </div>

      {isLoading ? (
        <div className={styles['notifications-page__loading']}>
          <Loader size="l" />
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className={styles['notifications-page__list']}>
          {notifications.map((notification, i) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              delay={i * 40}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell />}
          title="Нет уведомлений"
          description="Когда сработают ваши ценовые алерты, уведомления появятся здесь"
        />
      )}
    </div>
  );
}
