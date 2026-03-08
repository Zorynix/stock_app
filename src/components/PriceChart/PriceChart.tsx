import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, type IChartApi, ColorType, type UTCTimestamp } from 'lightweight-charts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { useCandles } from '@/hooks/useInstruments';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  figi: string;
}

type PeriodKey = '1D' | '1W' | '1M' | '3M' | '1Y';
type ChartMode = 'candle' | 'line';

const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: '1D', label: '1Д', days: 1 },
  { key: '1W', label: '1Н', days: 7 },
  { key: '1M', label: '1М', days: 30 },
  { key: '3M', label: '3М', days: 90 },
  { key: '1Y', label: '1Г', days: 365 },
];

function getDateRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

/** Intraday periods where candles have minute/hour granularity. */
const INTRADAY_PERIODS: PeriodKey[] = ['1D', '1W'];

export function PriceChart({ figi }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('1M');
  const [chartMode, setChartMode] = useState<ChartMode>('candle');

  const { from, to } = useMemo(
    () => getDateRange(PERIODS.find((p) => p.key === activePeriod)!.days),
    [activePeriod],
  );

  const { data: candles, isLoading } = useCandles(figi, from, to);

  const isIntraday = INTRADAY_PERIODS.includes(activePeriod);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
        fontFamily: "'Inter', system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(168, 85, 247, 0.3)', width: 1, style: 2 },
        horzLine: { color: 'rgba(168, 85, 247, 0.3)', width: 1, style: 2 },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: isIntraday,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    });

    chartRef.current = chart;

    if (chartMode === 'candle') {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        priceLineColor: '#22c55e',
        priceLineStyle: 2,
      });

      if (candles && candles.length > 0) {
        const seriesData = candles.map((candle) => {
          if (isIntraday) {
            return {
              time: Math.floor(new Date(candle.time).getTime() / 1000) as UTCTimestamp,
              open: candle.open,
              high: candle.high,
              low: candle.low,
              close: candle.close,
            };
          }
          return {
            time: candle.time.split('T')[0] as `${number}-${number}-${number}`,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          };
        });
        candlestickSeries.setData(seriesData);
        chart.timeScale().fitContent();
      }
    } else {
      const areaSeries = chart.addAreaSeries({
        lineColor: '#a855f7',
        topColor: 'rgba(168, 85, 247, 0.28)',
        bottomColor: 'rgba(168, 85, 247, 0.02)',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: '#a855f7',
        priceLineColor: '#a855f7',
        priceLineStyle: 2,
      });

      if (candles && candles.length > 0) {
        const seriesData = candles.map((candle) => {
          if (isIntraday) {
            return {
              time: Math.floor(new Date(candle.time).getTime() / 1000) as UTCTimestamp,
              value: candle.close,
            };
          }
          return {
            time: candle.time.split('T')[0] as `${number}-${number}-${number}`,
            value: candle.close,
          };
        });
        areaSeries.setData(seriesData);
        chart.timeScale().fitContent();
      }
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, isIntraday, chartMode]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-1">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activePeriod === key
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
              )}
              onClick={() => setActivePeriod(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            className={cn(
              'p-1.5 rounded-md transition-colors',
              chartMode === 'line' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setChartMode('line')}
            type="button"
            title="Линейный"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button
            className={cn(
              'p-1.5 rounded-md transition-colors',
              chartMode === 'candle' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setChartMode('candle')}
            type="button"
            title="Свечи"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <svg
            className="animate-spin h-6 w-6 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : candles && candles.length > 0 ? (
        <div ref={chartContainerRef} className="h-48 w-full" />
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Нет данных за выбранный период
        </div>
      )}
    </div>
  );
}
