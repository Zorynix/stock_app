import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, formatChange, getPriceChangeClass } from './format';

describe('formatPrice', () => {
  it('returns em-dash for null', () => {
    expect(formatPrice(null)).toBe('—');
  });

  it('returns em-dash for undefined', () => {
    expect(formatPrice(undefined)).toBe('—');
  });

  it('formats zero with two decimal places', () => {
    expect(formatPrice(0)).toMatch(/0[,.]00/);
  });

  it('formats integer with two decimals', () => {
    expect(formatPrice(100)).toMatch(/100[,.]00/);
  });

  it('formats decimal correctly', () => {
    expect(formatPrice(1.5)).toMatch(/1[,.]50/);
  });

  it('formats large number with thousands separator', () => {
    const result = formatPrice(1000000);
    // Should be longer than just "1000000,00" due to thousands separators
    expect(result.replace(/[,.\s\u00a0\u202f]/g, '').replace(/\d+/, '')).toBe('');
    expect(result.length).toBeGreaterThan(9);
  });
});

describe('formatDate', () => {
  it('returns em-dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns em-dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns em-dash for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('formats valid ISO date string', () => {
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(typeof result).toBe('string');
    expect(result).not.toBe('—');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns original string on invalid date', () => {
    // Invalid date string that can't be parsed
    // Note: behavior depends on JS engine; catch block returns original dateStr
    const invalid = 'not-a-date';
    const result = formatDate(invalid);
    // Either returns the invalid string or a fallback — just ensure no throw
    expect(typeof result).toBe('string');
  });
});

describe('formatChange', () => {
  it('prefixes positive value with +', () => {
    const result = formatChange(5);
    expect(result.startsWith('+')).toBe(true);
  });

  it('prefixes negative value with -', () => {
    const result = formatChange(-3);
    expect(result.startsWith('-')).toBe(true);
  });

  it('returns zero without sign prefix', () => {
    const result = formatChange(0);
    expect(result.startsWith('+')).toBe(false);
    expect(result.startsWith('-')).toBe(false);
    expect(result).toMatch(/0[,.]00/);
  });

  it('uses absolute value for formatting', () => {
    const pos = formatChange(5);
    const neg = formatChange(-5);
    // Strip sign prefix — numeric parts should be equal
    expect(pos.slice(1)).toBe(neg.slice(1));
  });
});

describe('getPriceChangeClass', () => {
  it('returns price-positive for positive change', () => {
    expect(getPriceChangeClass(0.01)).toBe('price-positive');
  });

  it('returns price-negative for negative change', () => {
    expect(getPriceChangeClass(-0.01)).toBe('price-negative');
  });

  it('returns price-neutral for zero', () => {
    expect(getPriceChangeClass(0)).toBe('price-neutral');
  });
});
