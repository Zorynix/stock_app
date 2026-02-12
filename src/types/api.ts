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

// ─── Portfolio DTOs ────────────────────────────────────────────

export interface AccountDto {
  id: string;
  name: string;
  type: string;
  status: string;
  accessLevel: string;
  openedDate: string;
}

export interface PositionDto {
  figi: string;
  instrumentUid: string;
  instrumentType: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  expectedYield: number;
  expectedYieldPercent: number;
  currency: string;
}

export interface PortfolioResponse {
  accountId: string;
  totalAmountShares: number;
  totalAmountBonds: number;
  totalAmountEtf: number;
  totalAmountCurrencies: number;
  totalAmountFutures: number;
  totalPortfolioValue: number;
  expectedYield: number;
  positions: PositionDto[];
}

export interface OperationDto {
  id: string;
  figi: string;
  instrumentType: string;
  instrumentName: string;
  operationType: string;
  state: string;
  payment: number;
  price: number;
  quantity: number;
  currency: string;
  date: string;
}

// ─── Notification DTOs ─────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  instrumentName: string;
  figi: string;
  alertType: AlertType;
  currentPrice: number;
  threshold: number;
  message: string;
  sentToTelegram: boolean;
  createdAt: string;
}

// ─── Report Types ──────────────────────────────────────────────

export type ReportPeriod = '1m' | '3m' | '6m' | '1y';

