import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, type IChartApi, ColorType } from 'lightweight-charts';
import { Loader } from '@gravity-ui/uikit';
import { useCandles } from '@/hooks/useInstruments';
import styles from './PriceChart.module.scss';

interface PriceChartProps {
  figi: string;
}

type PeriodKey = '1D' | '1W' | '1M' | '3M' | '1Y';

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

export function PriceChart({ figi }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('1M');

  const { from, to } = useMemo(
    () => getDateRange(PERIODS.find((p) => p.key === activePeriod)!.days),
    [activePeriod],
  );

  const { data: candles, isLoading } = useCandles(figi, from, to);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9b9b9b',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(255, 255, 255, 0.2)', width: 1, style: 2 },
        horzLine: { color: 'rgba(255, 255, 255, 0.2)', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: activePeriod === '1D',
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    });

    chartRef.current = chart;

    const areaSeries = chart.addAreaSeries({
      lineColor: '#26d9a0',
      topColor: 'rgba(38, 217, 160, 0.28)',
      bottomColor: 'rgba(38, 217, 160, 0.02)',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBackgroundColor: '#ffffff',
      priceLineColor: '#26d9a0',
      priceLineStyle: 2,
    });

    if (candles && candles.length > 0) {
      const seriesData = candles.map((candle, index) => {
        const date = new Date(from);
        date.setDate(date.getDate() + index);
        return {
          time: date.toISOString().split('T')[0],
          value: candle.close,
        };
      });
      areaSeries.setData(seriesData);
      chart.timeScale().fitContent();
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
  }, [candles, from, activePeriod]);

  return (
    <div className={styles['price-chart']}>
      <div className={styles['price-chart__controls']}>
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles['price-chart__period-btn']} ${activePeriod === key ? styles['price-chart__period-btn--active'] : ''}`}
            onClick={() => setActivePeriod(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className={styles['price-chart__loading']}>
          <Loader size="m" />
        </div>
      ) : candles && candles.length > 0 ? (
        <div ref={chartContainerRef} className={styles['price-chart__container']} />
      ) : (
        <div className={styles['price-chart__empty']}>Нет данных за выбранный период</div>
      )}
    </div>
  );
}
