import type { PositionDto } from '@/types/api';
import { formatPrice, formatChange, getPriceChangeClass } from '@/utils/format';
import styles from './PositionCard.module.scss';

interface PositionCardProps {
  position: PositionDto;
  delay?: number;
}

export function PositionCard({ position, delay = 0 }: PositionCardProps) {
  const initials = position.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const yieldClass = getPriceChangeClass(position.expectedYield);

  return (
    <div
      className={styles['position-card']}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles['position-card__left']}>
        <div className={styles['position-card__avatar']}>{initials}</div>
        <div className={styles['position-card__info']}>
          <div className={styles['position-card__name']}>{position.name}</div>
          <div className={styles['position-card__meta']}>
            {position.quantity} шт. · {formatPrice(position.averagePrice)} ₽
          </div>
        </div>
      </div>

      <div className={styles['position-card__right']}>
        <div className={styles['position-card__current-price']}>
          {formatPrice(position.currentPrice)} ₽
        </div>
        <div className={`${styles['position-card__yield']} ${styles[`position-card__yield--${yieldClass}`]}`}>
          {formatChange(position.expectedYield)} ₽ ({position.expectedYieldPercent > 0 ? '+' : ''}
          {position.expectedYieldPercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}
