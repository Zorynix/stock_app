import {
  SquareArticle,
  Calendar,
  ChartColumn,
  Bell,
  Globe,
} from '@gravity-ui/icons';
import { StubPage } from '@/pages/StubPage/StubPage';

export function NotificationsPage() {
  return (
    <StubPage
      title="Новости и события"
      description="Сервис новостей находится в разработке. Скоро вы сможете следить за событиями, влияющими на ваши инвестиции."
      icon={<SquareArticle />}
      iconBg="linear-gradient(135deg, #ff9500, #e68600)"
      features={[
        { icon: <Globe />, text: 'Лента новостей по вашим инструментам' },
        { icon: <Calendar />, text: 'Календарь отчётностей и дивидендов' },
        { icon: <ChartColumn />, text: 'Влияние новостей на цены' },
        { icon: <Bell />, text: 'Push-уведомления о важных событиях' },
      ]}
    />
  );
}
