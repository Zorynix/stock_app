import {
  Briefcase,
  ChartColumn,
  CircleDollar,
  ShieldCheck,
  ArrowsRotateRight,
} from '@gravity-ui/icons';
import { StubPage } from '@/pages/StubPage/StubPage';

export function PortfolioPage() {
  return (
    <StubPage
      title="Портфель"
      description="Сервис управления портфелем находится в разработке. Скоро вы сможете отслеживать свои инвестиции в одном месте."
      icon={<Briefcase />}
      iconBg="linear-gradient(135deg, #34c759, #28a745)"
      features={[
        { icon: <ChartColumn />, text: 'Учёт позиций и P&L в реальном времени' },
        { icon: <CircleDollar />, text: 'Расчёт дивидендной доходности' },
        { icon: <ArrowsRotateRight />, text: 'Ребалансировка портфеля' },
        { icon: <ShieldCheck />, text: 'Анализ рисков и диверсификации' },
      ]}
    />
  );
}
