import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from './AlertDialog';
import type { TrackedInstrumentResponse } from '@/types/api';

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  instrumentName: 'Apple',
  figi: 'BBG000B9XRY4',
};

const mockEditData: TrackedInstrumentResponse = {
  id: 'ti-1',
  figi: 'BBG000B9XRY4',
  instrumentName: 'Apple',
  buyPrice: 90,
  sellPrice: 110,
  buyAlertSent: false,
  sellAlertSent: false,
  createdAt: '2024-01-01T00:00:00Z',
  appUserId: 'user-1',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AlertDialog — rendering', () => {
  it('shows "Создать алерт" title in create mode', () => {
    render(<AlertDialog {...defaultProps} />);
    expect(screen.getByText('Создать алерт')).toBeInTheDocument();
  });

  it('shows "Редактировать алерт" title in edit mode', () => {
    render(<AlertDialog {...defaultProps} editData={mockEditData} />);
    expect(screen.getByText('Редактировать алерт')).toBeInTheDocument();
  });

  it('renders instrument name', () => {
    render(<AlertDialog {...defaultProps} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('shows current price when provided', () => {
    render(<AlertDialog {...defaultProps} currentPrice={150} />);
    expect(screen.getByText(/150[.,]00/)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AlertDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Создать алерт')).not.toBeInTheDocument();
  });

  it('pre-fills inputs from editData', () => {
    render(<AlertDialog {...defaultProps} editData={mockEditData} />);
    expect(screen.getByLabelText(/Цена покупки/)).toHaveValue('90');
    expect(screen.getByLabelText(/Цена продажи/)).toHaveValue('110');
  });

  it('pre-fills inputs with 5% spread from currentPrice', () => {
    render(<AlertDialog {...defaultProps} currentPrice={100} />);
    // buy = 95.00, sell = 105.00
    expect(screen.getByLabelText(/Цена покупки/)).toHaveValue('95.00');
    expect(screen.getByLabelText(/Цена продажи/)).toHaveValue('105.00');
  });

  it('shows serverError when provided', () => {
    render(<AlertDialog {...defaultProps} serverError="Server went down" />);
    expect(screen.getByText('Server went down')).toBeInTheDocument();
  });
});

describe('AlertDialog — validation', () => {
  it('shows error when inputs are not valid numbers', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.type(screen.getByLabelText(/Цена покупки/), 'abc');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(screen.getByText('Введите корректные числа')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error when buy price is zero', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.type(screen.getByLabelText(/Цена покупки/), '0');
    await user.type(screen.getByLabelText(/Цена продажи/), '100');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(screen.getByText('Цены должны быть больше нуля')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error when buy >= sell', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.type(screen.getByLabelText(/Цена покупки/), '110');
    await user.type(screen.getByLabelText(/Цена продажи/), '100');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(screen.getByText('Цена покупки должна быть меньше цены продажи')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error when prices are equal', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.type(screen.getByLabelText(/Цена покупки/), '100');
    await user.type(screen.getByLabelText(/Цена продажи/), '100');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(screen.getByText('Цена покупки должна быть меньше цены продажи')).toBeInTheDocument();
  });
});

describe('AlertDialog — submission', () => {
  it('calls onSubmit with parsed numbers on valid input', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.type(screen.getByLabelText(/Цена покупки/), '90');
    await user.type(screen.getByLabelText(/Цена продажи/), '110');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(90, 110);
  });

  it('shows "Сохранить" button in edit mode', () => {
    render(<AlertDialog {...defaultProps} editData={mockEditData} />);
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('submits with editData pre-filled values unchanged', async () => {
    const user = userEvent.setup();
    render(<AlertDialog {...defaultProps} editData={mockEditData} />);

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(90, 110);
  });
});
