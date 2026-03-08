import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, '')).toBe('a');
  });

  it('handles conditional classes', () => {
    const active = true;
    expect(cn('base', active && 'active')).toBe('base active');
    expect(cn('base', !active && 'active')).toBe('base');
  });

  it('resolves Tailwind conflicts by keeping last class', () => {
    // tailwind-merge resolves conflicts: last wins
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
    expect(result).not.toContain('text-red-500');
  });

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });

  it('returns empty string when no classes', () => {
    expect(cn()).toBe('');
  });

  it('handles array inputs', () => {
    expect(cn(['a', 'b'])).toBe('a b');
  });
});
