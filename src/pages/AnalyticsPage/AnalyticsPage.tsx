import { Cpu, TrendingUp, FilterX, Rocket, MessageCircle } from 'lucide-react';
import { StubPage } from '@/pages/StubPage/StubPage';

export function AnalyticsPage() {
  return (
    <StubPage
      title="Аналитика"
      description="AI-аналитика находится в разработке. Скоро вы получите доступ к рекомендациям на основе машинного обучения."
      icon={<Cpu className="w-8 h-8" />}
      iconBg="linear-gradient(135deg, #af52de, #8b3ec7)"
      features={[
        { icon: <TrendingUp className="w-4 h-4" />, text: 'Технический анализ и индикаторы' },
        { icon: <Rocket className="w-4 h-4" />, text: 'AI-рекомендации по сделкам' },
        { icon: <FilterX className="w-4 h-4" />, text: 'Скринер акций с фильтрами' },
        { icon: <MessageCircle className="w-4 h-4" />, text: 'Анализ настроений рынка' },
      ]}
    />
  );
}
