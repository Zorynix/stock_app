import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className={styles['page-header']}>
      <h1 className={styles['page-header__title']}>{title}</h1>
      {subtitle && <p className={styles['page-header__subtitle']}>{subtitle}</p>}
    </header>
  );
}
