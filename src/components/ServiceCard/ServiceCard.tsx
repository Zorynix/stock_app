import { Label } from '@gravity-ui/uikit';
import { ChevronRight } from '@gravity-ui/icons';
import type { ReactNode } from 'react';
import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  delay?: number;
}

export function ServiceCard({
  name,
  description,
  icon,
  iconBg,
  onClick,
  disabled = false,
  badge,
  delay = 0,
}: ServiceCardProps) {
  return (
    <div
      className={`${styles['service-card']} ${disabled ? styles['service-card--disabled'] : ''}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles['service-card__icon']} style={{ background: iconBg }}>
        {icon}
      </div>
      <div className={styles['service-card__body']}>
        <div className={styles['service-card__name']}>{name}</div>
        <div className={styles['service-card__description']}>{description}</div>
      </div>
      {badge && (
        <div className={styles['service-card__badge']}>
          <Label theme="info" size="s">
            {badge}
          </Label>
        </div>
      )}
      {!disabled && (
        <div className={styles['service-card__arrow']}>
          <ChevronRight />
        </div>
      )}
    </div>
  );
}
