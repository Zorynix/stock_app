import { Button, Label } from '@gravity-ui/uikit';
import { Pencil, TrashBin } from '@gravity-ui/icons';
import type { TrackedInstrumentResponse } from '@/types/api';
import { formatPrice, formatDate } from '@/utils/format';
import styles from './TrackedCard.module.scss';

interface TrackedCardProps {
  tracked: TrackedInstrumentResponse;
  onEdit: (tracked: TrackedInstrumentResponse) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export function TrackedCard({ tracked, onEdit, onDelete, delay = 0 }: TrackedCardProps) {
  return (
    <div
      className={styles['tracked-card']}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles['tracked-card__header']}>
        <div>
          <div className={styles['tracked-card__name']}>{tracked.instrumentName}</div>
          <div className={styles['tracked-card__figi']}>{tracked.figi}</div>
        </div>
        <div className={styles['tracked-card__actions']}>
          <Button view="flat" size="s" onClick={() => onEdit(tracked)}>
            <Button.Icon>
              <Pencil />
            </Button.Icon>
          </Button>
          <Button view="flat" size="s" onClick={() => onDelete(tracked.id)}>
            <Button.Icon>
              <TrashBin />
            </Button.Icon>
          </Button>
        </div>
      </div>

      <div className={styles['tracked-card__prices']}>
        <div
          className={`${styles['tracked-card__price-block']} ${styles['tracked-card__price-block--buy']}`}
        >
          <div className={styles['tracked-card__price-label']}>Покупка</div>
          <div className={styles['tracked-card__price-value']}>
            {formatPrice(tracked.buyPrice)} ₽
          </div>
        </div>
        <div
          className={`${styles['tracked-card__price-block']} ${styles['tracked-card__price-block--sell']}`}
        >
          <div className={styles['tracked-card__price-label']}>Продажа</div>
          <div className={styles['tracked-card__price-value']}>
            {formatPrice(tracked.sellPrice)} ₽
          </div>
        </div>
      </div>

      <div className={styles['tracked-card__footer']}>
        <span className={styles['tracked-card__date']}>{formatDate(tracked.createdAt)}</span>
        <div className={styles['tracked-card__alerts']}>
          {tracked.buyAlertSent && (
            <Label theme="success" size="xs">
              Покупка ↓
            </Label>
          )}
          {tracked.sellAlertSent && (
            <Label theme="danger" size="xs">
              Продажа ↑
            </Label>
          )}
          {!tracked.buyAlertSent && !tracked.sellAlertSent && (
            <Label theme="normal" size="xs">
              Мониторинг
            </Label>
          )}
        </div>
      </div>
    </div>
  );
}
