import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BrainCircuit,
  Briefcase,
  MessageSquare,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RoadmapItem {
  id: number;
  quarter: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  gradient: string;
  status: 'done' | 'in-progress' | 'planned' | 'future';
  progress: number;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 1,
    quarter: 'Q2 2026',
    title: 'AI-Аналитика',
    description:
      'Умный анализ портфеля и рекомендации на основе искусственного интеллекта',
    details: [
      'Прогноз движения цены по историческим данным',
      'Персональные торговые рекомендации',
      'Анализ новостного фона по инструменту',
      'Автоматическое определение точек входа',
    ],
    icon: <BrainCircuit className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    status: 'in-progress',
    progress: 35,
  },
  {
    id: 2,
    quarter: 'Q3 2026',
    title: 'Раздел Портфель',
    description: 'Полное управление инвестиционным портфелем прямо в Telegram',
    details: [
      'Сводная статистика активов и доходности',
      'Разбивка по секторам и валютам',
      'История сделок и дивидендов',
      'Аналитические графики по временным периодам',
    ],
    icon: <Briefcase className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    status: 'planned',
    progress: 10,
  },
  {
    id: 3,
    quarter: 'Q4 2026',
    title: 'Интеграция с Max',
    description:
      'Получайте алерты и торговые сигналы прямо в мессенджере Max',
    details: [
      'Push-уведомления о срабатывании алертов',
      'Чат-бот для быстрых запросов по акциям',
      'Командное управление отслеживаемыми инструментами',
      'Расшаривание аналитики с другими трейдерами',
    ],
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
    status: 'planned',
    progress: 0,
  },
  {
    id: 4,
    quarter: 'Q1 2027',
    title: 'Умные алерты 2.0',
    description: 'Следующее поколение ценовых уведомлений с расширенными триггерами',
    details: [
      'Алерты по техническим индикаторам (RSI, MACD, BB)',
      'Условные цепочки: «если A, то уведомить о B»',
      'Групповые алерты на корзину инструментов',
      'Интеграция с новостными событиями компании',
    ],
    icon: <Zap className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
    status: 'future',
    progress: 0,
  },
];

const STATUS_CONFIG = {
  done: { label: 'Готово', icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'bg-positive/15 text-positive border-positive/30' },
  'in-progress': { label: 'В разработке', icon: <Sparkles className="w-3.5 h-3.5" />, cls: 'bg-primary/15 text-primary border-primary/30' },
  planned: { label: 'Запланировано', icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-muted text-muted-foreground border-card-border' },
  future: { label: 'В планах', icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-muted text-muted-foreground border-card-border opacity-70' },
};

function RoadmapCard({ item, index }: { item: RoadmapItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const status = STATUS_CONFIG[item.status];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
    >
      {/* Timeline connector */}
      <div className="flex gap-4">
        {/* Left column — dot + line */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-500',
              visible && 'scale-100',
              !visible && 'scale-75',
            )}
            style={{ background: item.gradient }}
          >
            {item.icon}
          </div>
          {index < ROADMAP_ITEMS.length - 1 && (
            <div
              className={cn(
                'w-0.5 flex-1 mt-2 mb-0 transition-all duration-1000 origin-top',
                visible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0',
              )}
              style={{
                background: `linear-gradient(to bottom, rgba(168,85,247,0.4), rgba(168,85,247,0.05))`,
                transitionDelay: `${index * 120 + 300}ms`,
              }}
            />
          )}
        </div>

        {/* Right column — card */}
        <div className="flex-1 pb-6">
          {/* Quarter badge + status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              {item.quarter}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                status.cls,
              )}
            >
              {status.icon}
              {status.label}
            </span>
          </div>

          {/* Card */}
          <div
            className={cn(
              'bg-card border border-card-border rounded-2xl p-4 space-y-3 transition-all duration-500',
              item.status === 'in-progress' && 'border-primary/25',
            )}
          >
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Progress bar (only when progress > 0) */}
            {item.progress > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Прогресс</span>
                  <span className="font-semibold text-primary">{item.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: visible ? `${item.progress}%` : '0%',
                      background: item.gradient,
                      transitionDelay: `${index * 120 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Feature list */}
            <ul className="space-y-1.5">
              {item.details.map((detail, di) => (
                <li
                  key={di}
                  className={cn(
                    'flex items-start gap-2 text-sm text-muted-foreground transition-all duration-500',
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
                  )}
                  style={{ transitionDelay: `${index * 120 + 200 + di * 60}ms` }}
                >
                  <span
                    className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: item.gradient.includes('#a855f7') ? '#a855f7' : '#8b5cf6' }}
                  />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoadmapPage() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-4 py-4 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Назад
      </Button>

      {/* Header */}
      <div
        ref={headerRef}
        className={cn(
          'transition-all duration-700 ease-out',
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
        )}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Roadmap</h1>
            <p className="text-xs text-muted-foreground">Планы развития приложения</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Мы постоянно работаем над новыми функциями. Вот что вас ждёт в ближайшее время.
        </p>
      </div>

      {/* Timeline */}
      <div>
        {ROADMAP_ITEMS.map((item, index) => (
          <RoadmapCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
