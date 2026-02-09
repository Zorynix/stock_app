import { useNavigate } from 'react-router-dom';
import type { InstrumentDto } from '@/types/api';
import { formatPrice } from '@/utils/format';
import styles from './InstrumentCard.module.scss';

interface InstrumentCardProps {
  instrument: InstrumentDto;
  delay?: number;
}

export function InstrumentCard({ instrument, delay = 0 }: InstrumentCardProps) {
  const navigate = useNavigate();
  const initials = instrument.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={styles['instrument-card']}
      onClick={() => navigate(`/instrument/${instrument.figi}`, { state: { instrument } })}
      role="button"
      tabIndex={0}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles['instrument-card__avatar']}>{initials}</div>
      <div className={styles['instrument-card__info']}>
        <div className={styles['instrument-card__name']}>{instrument.name}</div>
        <div className={styles['instrument-card__figi']}>{instrument.figi}</div>
      </div>
      <div className={styles['instrument-card__price']}>{formatPrice(instrument.price)} ₽</div>
    </div>
  );
}
