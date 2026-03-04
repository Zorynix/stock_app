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
  time: string;
}

// ─── Tracked Instrument DTOs ───────────────────────────────────

export interface TrackedInstrumentRequest {
  figi: string;
  instrumentName: string;
  buyPrice: number;
  sellPrice: number;
  /** Опционален при JWT-аутентификации (legacy: Telegram userId) */
  userId?: number;
  /** Опционален при JWT-аутентификации (legacy: Telegram chatId) */
  chatId?: number;
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
  appUserId: string;
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
export type ReportFormat = 'pdf' | 'md';

// ─── Add Email DTOs ────────────────────────────────────────

export interface AddEmailResponse {
  /** "VERIFY" — новый email; "LINK" — email принадлежит существующему web-аккаунту */
  action: 'VERIFY' | 'LINK';
  webCount: number;
  telegramCount: number;
}

export type ConflictResolution = 'KEEP_WEB' | 'KEEP_TELEGRAM' | 'MERGE';

// ─── Auth DTOs ─────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  userId: string;
  email: string | null;
  telegramId: number | null;
  emailConfirmed: boolean;
  telegramLinked: boolean;
  emailNotificationsEnabled: boolean;
}

export interface AlertStats {
  total: number;
  buyAlertTriggered: number;
  sellAlertTriggered: number;
  active: number;
}

export interface ProfileResponse {
  id: string;
  email: string | null;
  telegramId: number | null;
  emailConfirmed: boolean;
  telegramLinked: boolean;
  emailNotificationsEnabled: boolean;
  createdAt: string;
  alertStats: AlertStats;
}

