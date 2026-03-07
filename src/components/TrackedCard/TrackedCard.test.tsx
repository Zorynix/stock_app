import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrackedCard } from './TrackedCard';
import type { TrackedInstrumentResponse } from '@/types/api';

function makeTracked(overrides?: Partial<TrackedInstrumentResponse>): TrackedInstrumentResponse {
  return {
    id: 'ti-1',
    figi: 'BBG000B9XRY4',
    instrumentName: 'Apple',
    buyPrice: 90,
    sellPrice: 110,
    buyAlertSent: false,
    sellAlertSent: false,
    createdAt: '2024-01-15T12:00:00Z',
    appUserId: 'user-1',
    ...overrides,
  };
}

const onEdit = vi.fn();
const onDelete = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TrackedCard — rendering', () => {
  it('renders instrument name and figi', () => {
    render(<TrackedCard tracked={makeTracked()} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('BBG000B9XRY4')).toBeInTheDocument();
  });

  it('renders buy price label and value', () => {
    render(<TrackedCard tracked={makeTracked()} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Покупка')).toBeInTheDocument();
    // formatPrice(90) should contain "90"
    expect(screen.getByText(/90[,.]00\s*₽/)).toBeInTheDocument();
  });

  it('renders sell price label and value', () => {
    render(<TrackedCard tracked={makeTracked()} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Продажа')).toBeInTheDocument();
    expect(screen.getByText(/110[,.]00\s*₽/)).toBeInTheDocument();
  });

  it('renders formatted creation date', () => {
    render(<TrackedCard tracked={makeTracked()} onEdit={onEdit} onDelete={onDelete} />);
    // formatDate returns some non-empty string
    const dateEl = screen.getByText((text) => text.includes('2024') || text.includes('янв'));
    expect(dateEl).toBeInTheDocument();
  });
});

describe('TrackedCard — alert badges', () => {
  it('shows "Мониторинг" badge when no alerts sent', () => {
    render(
      <TrackedCard
        tracked={makeTracked({ buyAlertSent: false, sellAlertSent: false })}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Мониторинг')).toBeInTheDocument();
    expect(screen.queryByText('Покупка ↓')).not.toBeInTheDocument();
    expect(screen.queryByText('Продажа ↑')).not.toBeInTheDocument();
  });

  it('shows "Покупка ↓" badge when buyAlertSent is true', () => {
    render(
      <TrackedCard
        tracked={makeTracked({ buyAlertSent: true, sellAlertSent: false })}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Покупка ↓')).toBeInTheDocument();
    expect(screen.queryByText('Мониторинг')).not.toBeInTheDocument();
  });

  it('shows "Продажа ↑" badge when sellAlertSent is true', () => {
    render(
      <TrackedCard
        tracked={makeTracked({ buyAlertSent: false, sellAlertSent: true })}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Продажа ↑')).toBeInTheDocument();
    expect(screen.queryByText('Мониторинг')).not.toBeInTheDocument();
  });

  it('shows both alert badges when both alerts sent', () => {
    render(
      <TrackedCard
        tracked={makeTracked({ buyAlertSent: true, sellAlertSent: true })}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Покупка ↓')).toBeInTheDocument();
    expect(screen.getByText('Продажа ↑')).toBeInTheDocument();
    expect(screen.queryByText('Мониторинг')).not.toBeInTheDocument();
  });
});

describe('TrackedCard — callbacks', () => {
  it('calls onEdit with the tracked instrument when edit button clicked', async () => {
    const user = userEvent.setup();
    const tracked = makeTracked();
    render(<TrackedCard tracked={tracked} onEdit={onEdit} onDelete={onDelete} />);

    // Edit button is the first icon button (Pencil)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(onEdit).toHaveBeenCalledWith(tracked);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with the instrument id when delete button clicked', async () => {
    const user = userEvent.setup();
    const tracked = makeTracked({ id: 'ti-42' });
    render(<TrackedCard tracked={tracked} onEdit={onEdit} onDelete={onDelete} />);

    // Delete button is the second icon button (Trash2)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);

    expect(onDelete).toHaveBeenCalledWith('ti-42');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not call onDelete when edit button clicked', async () => {
    const user = userEvent.setup();
    render(<TrackedCard tracked={makeTracked()} onEdit={onEdit} onDelete={onDelete} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(onDelete).not.toHaveBeenCalled();
  });
});
