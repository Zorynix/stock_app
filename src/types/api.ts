// ─── Instrument DTOs ───────────────────────────────────────────

export interface InstrumentDto {
  name: string;
  figi: string;
  price: number;
}

export interface CandleDto {
  open: number;
  high: number;
  low: number;
  close: number;
}

// ─── Tracked Instrument DTOs ───────────────────────────────────

export interface TrackedInstrumentRequest {
  figi: string;
  instrumentName: string;
  buyPrice: number;
  sellPrice: number;
  userId: number;
  chatId: number;
}

export interface TrackedInstrumentResponse {
  id: string;
  figi: string;
  instrumentName: string;
  buyPrice: number;
  sellPrice: number;
  buyAlertSent: boolean;
  sellAlertSent: boolean;
  createdAt: string;
  userId: number;
}

// ─── Period ────────────────────────────────────────────────────

export type Period = 'day' | 'week' | 'month' | 'year';

// ─── Price Alert ───────────────────────────────────────────────

export type AlertType = 'BUY' | 'SELL';

export interface PriceAlertEvent {
  instrumentName: string;
  figi: string;
  currentPrice: number;
  threshold: number;
  alertType: AlertType;
  userId: number;
  chatId: number;
}

// ─── API Error ─────────────────────────────────────────────────

export interface ApiError {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string>;
}
