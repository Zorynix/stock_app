import { useState, useEffect } from 'react';
import { Loader, Select, Label } from '@gravity-ui/uikit';
import { Briefcase } from '@gravity-ui/icons';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PositionCard } from '@/components/PositionCard/PositionCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { useAccounts, usePortfolio } from '@/hooks/usePortfolio';
import { formatPrice, formatChange, getPriceChangeClass } from '@/utils/format';
import styles from './PortfolioPage.module.scss';

export function PortfolioPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(selectedAccount);

  const accountOptions = (accounts ?? []).map((a) => ({
    value: a.id,
    content: a.name,
  }));

  const isLoading = accountsLoading || portfolioLoading;

  return (
    <div className={styles['portfolio-page']}>
      <PageHeader title="Портфель" subtitle="Позиции и доходность" />

      {accounts && accounts.length > 1 && (
        <div className={styles['portfolio-page__account-select']}>
          <Select
            value={selectedAccount ? [selectedAccount] : []}
            onUpdate={(val) => setSelectedAccount(val[0] ?? null)}
            options={accountOptions}
            size="l"
            width="max"
          />
        </div>
      )}

      {isLoading ? (
        <div className={styles['portfolio-page__loading']}>
          <Loader size="l" />
        </div>
      ) : portfolio ? (
        <>
          {/* Summary Cards */}
          <div className={styles['portfolio-page__summary']}>
            <div className={styles['portfolio-page__stat-card']}>
              <div className={styles['portfolio-page__stat-label']}>Общая стоимость</div>
              <div className={styles['portfolio-page__stat-value']}>
                {formatPrice(portfolio.totalPortfolioValue)} ₽
              </div>
            </div>
            <div className={styles['portfolio-page__stat-card']}>
              <div className={styles['portfolio-page__stat-label']}>Доходность</div>
              <div
                className={`${styles['portfolio-page__stat-value']} ${
                  styles[`portfolio-page__stat-value--${getPriceChangeClass(portfolio.expectedYield)}`]
                }`}
              >
                {formatChange(portfolio.expectedYield)} ₽
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className={styles['portfolio-page__breakdown']}>
            {portfolio.totalAmountShares > 0 && (
              <Label theme="info" size="s">
                Акции: {formatPrice(portfolio.totalAmountShares)} ₽
              </Label>
            )}
            {portfolio.totalAmountBonds > 0 && (
              <Label theme="normal" size="s">
                Облигации: {formatPrice(portfolio.totalAmountBonds)} ₽
              </Label>
            )}
            {portfolio.totalAmountEtf > 0 && (
              <Label theme="utility" size="s">
                ETF: {formatPrice(portfolio.totalAmountEtf)} ₽
              </Label>
            )}
            {portfolio.totalAmountCurrencies > 0 && (
              <Label theme="success" size="s">
                Валюта: {formatPrice(portfolio.totalAmountCurrencies)} ₽
              </Label>
            )}
          </div>

          {/* Positions */}
          <div className={styles['portfolio-page__section']}>
            <div className={styles['portfolio-page__section-title']}>
              Позиции ({portfolio.positions.length})
            </div>
            {portfolio.positions.length > 0 ? (
              <div className={styles['portfolio-page__positions']}>
                {portfolio.positions.map((position, i) => (
                  <PositionCard key={position.figi} position={position} delay={i * 40} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase />}
                title="Нет позиций"
                description="В портфеле пока нет открытых позиций"
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Briefcase />}
          title="Нет данных"
          description="Не удалось загрузить данные портфеля. Проверьте настройки API-токена."
        />
      )}
    </div>
  );
}
