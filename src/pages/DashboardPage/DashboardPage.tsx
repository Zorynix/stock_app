import { useNavigate } from 'react-router-dom';
import { BellDot, TrendingUp, Bell, ArrowRight, Rocket } from 'lucide-react';
import { useTelegram } from '@/providers/TelegramProvider';
import { useTrackedInstruments, useDeleteTracked } from '@/hooks/useTracked';
import { ServiceCard } from '@/components/ServiceCard/ServiceCard';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, showConfirm, hapticFeedback } = useTelegram();
  const { data: trackedList, isLoading } = useTrackedInstruments();
  const deleteMutation = useDeleteTracked();

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Удалить этот алерт?');
    if (confirmed) {
      deleteMutation.mutate(id, {
        onSuccess: () => hapticFeedback('notification'),
      });
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground">Добро пожаловать,</p>
        <h2 className="text-2xl font-bold text-foreground">
          {user?.first_name ?? 'Инвестор'} 👋
        </h2>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Сервисы
        </h3>
        <div className="space-y-2">
          <ServiceCard
            name="Рынок"
            description="Поиск акций, графики цен, алерты на покупку и продажу"
            icon={<TrendingUp className="w-5 h-5" />}
            iconBg="linear-gradient(135deg, #a855f7, #7c3aed)"
            onClick={() => navigate('/search')}
          />
          <ServiceCard
            name="Уведомления"
            description="История алертов и Telegram-уведомления"
            icon={<Bell className="w-5 h-5" />}
            iconBg="linear-gradient(135deg, #8b5cf6, #6d28d9)"
            onClick={() => navigate('/notifications')}
          />
          <ServiceCard
            name="Roadmap"
            description="Планы развития и новые функции приложения"
            icon={<Rocket className="w-5 h-5" />}
            iconBg="linear-gradient(135deg, #c084fc, #a855f7)"
            onClick={() => navigate('/roadmap')}
          />
        </div>
      </div>

      {/* Active Tracked Instruments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Активные алерты
          </h3>
          {trackedList && trackedList.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/tracked')}>
              Все <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <svg
              className="animate-spin h-6 w-6 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="space-y-2">
            {trackedList?.slice(0, 3).map((tracked, i) => (
              <TrackedCard
                key={tracked.id}
                tracked={tracked}
                onEdit={() => navigate('/tracked')}
                onDelete={handleDelete}
                delay={i * 50}
              />
            ))}
            {(!trackedList || trackedList.length === 0) && (
              <ServiceCard
                name="Нет активных алертов"
                description="Найдите акцию и установите ценовые уведомления"
                icon={<BellDot className="w-5 h-5" />}
                iconBg="linear-gradient(135deg, #4c1d95, #3b0764)"
                onClick={() => navigate('/search')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
