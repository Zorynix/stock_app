/**
 * Format a number as price with spaces as thousands separators
 */
export function formatPrice(value: number | undefined | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format ISO date string to readable Russian format
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Format a number with sign prefix for display
 */
export function formatChange(value: number): string {
  const formatted = formatPrice(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

/**
 * Get change percentage class name
 */
export function getPriceChangeClass(change: number): string {
  if (change > 0) return 'price-positive';
  if (change < 0) return 'price-negative';
  return 'price-neutral';
}
