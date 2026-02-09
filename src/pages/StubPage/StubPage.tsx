import type { ReactNode } from 'react';
import { Button, Label } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import styles from './StubPage.module.scss';

interface StubPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  features: { icon: ReactNode; text: string }[];
}

export function StubPage({ title, description, icon, iconBg, features }: StubPageProps) {
  const navigate = useNavigate();

  return (
    <div className={styles['stub-page']}>
      <div className={styles['stub-page__content']}>
        <div className={styles['stub-page__icon']} style={{ background: iconBg }}>
          {icon}
        </div>
        <div className={styles['stub-page__title']}>
          {title}
          {' '}
          <Label theme="info" size="s">
            Скоро
          </Label>
        </div>
        <div className={styles['stub-page__description']}>{description}</div>

        <div className={styles['stub-page__features']}>
          {features.map((feature, i) => (
            <div key={i} className={styles['stub-page__feature']}>
              {feature.icon}
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <div className={styles['stub-page__action']}>
          <Button view="outlined" size="l" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
