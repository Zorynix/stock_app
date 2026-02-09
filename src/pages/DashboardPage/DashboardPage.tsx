import { useNavigate } from 'react-router-dom';
import { Button, Loader } from '@gravity-ui/uikit';
import {
  Magnifier,
  BellDot,
  ChartLine,
  Briefcase,
  Cpu,
  SquareArticle,
  ArrowRight,
} from '@gravity-ui/icons';
import { useTelegram } from '@/providers/TelegramProvider';
import { useTrackedInstruments } from '@/hooks/useTracked';
import { ServiceCard } from '@/components/ServiceCard/ServiceCard';
import { TrackedCard } from '@/components/TrackedCard/TrackedCard';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const userId = user?.id ?? null;
  const { data: trackedList, isLoading } = useTrackedInstruments(userId);

  return (
    <div className={styles.dashboard}>
      {/* Greeting */}
      <div className={styles.dashboard__greeting}>
        <div className={styles['dashboard__greeting-text']}>Добро пожаловать,</div>
        <div className={styles['dashboard__greeting-name']}>
          {user?.first_name ?? 'Инвестор'} 👋
        </div>
      </div>

      {/* Services */}
      <div className={styles.dashboard__section}>
        <div className={styles['dashboard__section-header']}>
          <span className={styles['dashboard__section-title']}>Сервисы</span>
        </div>
        <div className={styles.dashboard__services}>
          <ServiceCard
            name="Рынок"
            description="Поиск акций, графики цен, алерты на покупку и продажу"
            icon={<ChartLine />}
            iconBg="linear-gradient(135deg, #ffbe5c, #e6a030)"
            onClick={() => navigate('/search')}
            delay={50}
          />
          <ServiceCard
            name="Портфель"
            description="Управление портфелем, учёт позиций и P&L"
            icon={<Briefcase />}
            iconBg="linear-gradient(135deg, #34c759, #28a745)"
            onClick={() => navigate('/portfolio')}
            badge="Скоро"
            disabled
            delay={100}
          />
          <ServiceCard
            name="Аналитика"
            description="AI-аналитика, рекомендации и скринеры"
            icon={<Cpu />}
            iconBg="linear-gradient(135deg, #af52de, #8b3ec7)"
            onClick={() => navigate('/analytics')}
            badge="Скоро"
            disabled
            delay={150}
          />
          <ServiceCard
            name="Новости"
            description="Лента новостей, события и отчётности компаний"
            icon={<SquareArticle />}
            iconBg="linear-gradient(135deg, #ff9500, #e68600)"
            onClick={() => navigate('/notifications')}
            badge="Скоро"
            disabled
            delay={200}
          />
        </div>
      </div>

      {/* Active Tracked Instruments */}
      <div className={styles.dashboard__section}>
        <div className={styles['dashboard__section-header']}>
          <span className={styles['dashboard__section-title']}>Активные алерты</span>
          {trackedList && trackedList.length > 0 && (
            <Button view="flat" size="s" onClick={() => navigate('/tracked')}>
              Все
              <Button.Icon side="end">
                <ArrowRight />
              </Button.Icon>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <Loader size="m" />
          </div>
        ) : (
          <div className={styles['dashboard__tracked-list']}>
            {trackedList?.slice(0, 3).map((tracked, i) => (
              <TrackedCard
                key={tracked.id}
                tracked={tracked}
                onEdit={() => navigate('/tracked')}
                onDelete={() => {}}
                delay={i * 50}
              />
            ))}
            {(!trackedList || trackedList.length === 0) && (
              <ServiceCard
                name="Нет активных алертов"
                description="Найдите акцию и установите ценовые уведомления"
                icon={<BellDot />}
                iconBg="linear-gradient(135deg, #636366, #48484a)"
                onClick={() => navigate('/search')}
                delay={50}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
