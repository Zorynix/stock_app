import {
  Cpu,
  ChartLine,
  FunnelXmark,
  Rocket,
  Comment,
} from '@gravity-ui/icons';
import { StubPage } from '@/pages/StubPage/StubPage';

export function AnalyticsPage() {
  return (
    <StubPage
      title="Аналитика"
      description="AI-аналитика находится в разработке. Скоро вы получите доступ к рекомендациям на основе машинного обучения."
      icon={<Cpu />}
      iconBg="linear-gradient(135deg, #af52de, #8b3ec7)"
      features={[
        { icon: <ChartLine />, text: 'Технический анализ и индикаторы' },
        { icon: <Rocket />, text: 'AI-рекомендации по сделкам' },
        { icon: <FunnelXmark />, text: 'Скринер акций с фильтрами' },
        { icon: <Comment />, text: 'Анализ настроений рынка' },
      ]}
    />
  );
}
