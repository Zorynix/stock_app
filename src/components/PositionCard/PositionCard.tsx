import type { PositionDto } from '@/types/api';
import { formatPrice, formatChange } from '@/utils/format';
import { cn } from '@/lib/utils';

interface PositionCardProps {
  position: PositionDto;
  delay?: number;
}

export function PositionCard({ position }: PositionCardProps) {
  const initials = position.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const isPositive = position.expectedYield > 0;
  const isNegative = position.expectedYield < 0;

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-card-border rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{position.name}</div>
        <div className="text-xs text-muted-foreground">
          {position.quantity} шт. · {formatPrice(position.averagePrice)} ₽
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-foreground">
          {formatPrice(position.currentPrice)} ₽
        </div>
        <div
          className={cn(
            'text-xs font-medium',
            isPositive && 'text-positive',
            isNegative && 'text-negative',
            !isPositive && !isNegative && 'text-muted-foreground',
          )}
        >
          {formatChange(position.expectedYield)} ₽ ({position.expectedYieldPercent > 0 ? '+' : ''}
          {position.expectedYieldPercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}
