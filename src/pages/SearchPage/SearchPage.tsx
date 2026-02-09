import { useState } from 'react';
import { TextInput, Loader } from '@gravity-ui/uikit';
import { Magnifier } from '@gravity-ui/icons';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { InstrumentCard } from '@/components/InstrumentCard/InstrumentCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { useSearchInstruments } from '@/hooks/useInstruments';
import { useDebounce } from '@/hooks/useUtils';
import styles from './SearchPage.module.scss';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data: instruments, isLoading, isFetching } = useSearchInstruments(debouncedQuery);

  return (
    <div className={styles['search-page']}>
      <PageHeader title="Поиск акций" subtitle="Найдите инструмент по названию" />

      <div className={styles['search-page__search-bar']}>
        <TextInput
          value={query}
          onUpdate={setQuery}
          placeholder="Например: Газпром, Сбербанк, Apple..."
          size="xl"
          startContent={
            <div style={{ padding: '0 4px 0 8px', display: 'flex', color: 'var(--g-color-text-hint)' }}>
              <Magnifier />
            </div>
          }
          endContent={
            isFetching ? (
              <div style={{ padding: '0 8px', display: 'flex' }}>
                <Loader size="s" />
              </div>
            ) : undefined
          }
          hasClear
          autoFocus
        />
      </div>

      {!debouncedQuery && (
        <div className={styles['search-page__hint']}>
          Начните вводить название акции<br />для поиска по рынку
        </div>
      )}

      {debouncedQuery && isLoading && (
        <div className={styles['search-page__loading']}>
          <Loader size="l" />
        </div>
      )}

      {debouncedQuery && !isLoading && instruments && instruments.length === 0 && (
        <EmptyState
          icon={<Magnifier />}
          title="Ничего не найдено"
          description={`По запросу «${debouncedQuery}» не найдено инструментов`}
        />
      )}

      {instruments && instruments.length > 0 && (
        <>
          <div className={styles['search-page__results-count']}>
            Найдено: {instruments.length}
          </div>
          <div className={styles['search-page__results']}>
            {instruments.map((instrument, i) => (
              <InstrumentCard key={instrument.figi} instrument={instrument} delay={i * 40} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
