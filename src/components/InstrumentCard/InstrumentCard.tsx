import { useNavigate } from 'react-router-dom';
import type { InstrumentDto } from '@/types/api';
import { formatPrice } from '@/utils/format';

interface InstrumentCardProps {
  instrument: InstrumentDto;
  delay?: number;
}

export function InstrumentCard({ instrument }: InstrumentCardProps) {
  const navigate = useNavigate();
  const initials = instrument.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-3 p-4 bg-card border border-card-border rounded-2xl cursor-pointer hover:bg-secondary transition-colors active:scale-[0.98]"
      onClick={() => navigate(`/instrument/${instrument.figi}`, { state: { instrument } })}
      role="button"
      tabIndex={0}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{instrument.name}</div>
        <div className="text-xs text-muted-foreground">{instrument.figi}</div>
      </div>
      <div className="text-sm font-semibold text-foreground shrink-0">
        {formatPrice(instrument.price)} ₽
      </div>
    </div>
  );
}
