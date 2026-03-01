import { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { InstrumentCard } from '@/components/InstrumentCard/InstrumentCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Input } from '@/components/ui/input';
import { useSearchInstruments } from '@/hooks/useInstruments';
import { useDebounce } from '@/hooks/useUtils';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data: instruments, isLoading, isFetching } = useSearchInstruments(debouncedQuery);

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Поиск акций" subtitle="Найдите инструмент по названию" />

      <div className="px-4 py-3 sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: Газпром, Сбербанк, Apple..."
            className="pl-10 pr-10"
            autoFocus
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4">
        {!debouncedQuery && (
          <p className="text-center text-sm text-muted-foreground mt-12">
            Начните вводить название акции
            <br />
            для поиска по рынку
          </p>
        )}

        {debouncedQuery && isLoading && (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {debouncedQuery && !isLoading && instruments && instruments.length === 0 && (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="Ничего не найдено"
            description={`По запросу «${debouncedQuery}» не найдено инструментов`}
          />
        )}

        {instruments && instruments.length > 0 && (
          <div className="space-y-2 pb-4">
            <p className="text-xs text-muted-foreground py-1">
              Найдено: {instruments.length}
            </p>
            {instruments.map((instrument, i) => (
              <InstrumentCard key={instrument.figi} instrument={instrument} delay={i * 40} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
