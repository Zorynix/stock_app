import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PositionCard } from '@/components/PositionCard/PositionCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAccounts, usePortfolio } from '@/hooks/usePortfolio';
import { formatPrice, formatChange } from '@/utils/format';
import { cn } from '@/lib/utils';

export function PortfolioPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(selectedAccount);

  const isLoading = accountsLoading || portfolioLoading;

  const Spinner = () => (
    <div className="flex justify-center py-12">
      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Портфель" subtitle="Позиции и доходность" />

      {accounts && accounts.length > 1 && (
        <div className="px-4 pb-3">
          <Select
            value={selectedAccount ?? undefined}
            onValueChange={(val) => setSelectedAccount(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите счёт" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : portfolio ? (
        <div className="px-4 space-y-4 pb-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Общая стоимость</p>
              <p className="text-lg font-bold text-foreground">
                {formatPrice(portfolio.totalPortfolioValue)} ₽
              </p>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Доходность</p>
              <p
                className={cn(
                  'text-lg font-bold',
                  portfolio.expectedYield > 0 && 'text-positive',
                  portfolio.expectedYield < 0 && 'text-negative',
                  portfolio.expectedYield === 0 && 'text-foreground',
                )}
              >
                {formatChange(portfolio.expectedYield)} ₽
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex flex-wrap gap-2">
            {portfolio.totalAmountShares > 0 && (
              <Badge variant="info">Акции: {formatPrice(portfolio.totalAmountShares)} ₽</Badge>
            )}
            {portfolio.totalAmountBonds > 0 && (
              <Badge variant="normal">Облигации: {formatPrice(portfolio.totalAmountBonds)} ₽</Badge>
            )}
            {portfolio.totalAmountEtf > 0 && (
              <Badge variant="secondary">ETF: {formatPrice(portfolio.totalAmountEtf)} ₽</Badge>
            )}
            {portfolio.totalAmountCurrencies > 0 && (
              <Badge variant="success">Валюта: {formatPrice(portfolio.totalAmountCurrencies)} ₽</Badge>
            )}
          </div>

          {/* Positions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Позиции ({portfolio.positions.length})
            </h3>
            {portfolio.positions.length > 0 ? (
              <div className="space-y-2">
                {portfolio.positions.map((position, i) => (
                  <PositionCard key={position.figi} position={position} delay={i * 40} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="w-6 h-6" />}
                title="Нет позиций"
                description="В портфеле пока нет открытых позиций"
              />
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="Нет данных"
          description="Не удалось загрузить данные портфеля. Проверьте настройки API-токена."
        />
      )}
    </div>
  );
}
