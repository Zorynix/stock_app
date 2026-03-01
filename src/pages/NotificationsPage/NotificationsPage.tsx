import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { NotificationCard } from '@/components/NotificationCard/NotificationCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Уведомления" subtitle="История ценовых алертов" />

      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground">
          Алерты автоматически отправляются в Telegram, когда цена акции выходит за установленные границы.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="px-4 space-y-2 pb-4">
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
          icon={<Bell className="w-6 h-6" />}
          title="Нет уведомлений"
          description="Когда сработают ваши ценовые алерты, уведомления появятся здесь"
        />
      )}
    </div>
  );
}
