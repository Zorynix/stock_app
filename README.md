# StockApp — Telegram Mini App

Telegram Mini App для работы с рынком акций: поиск инструментов, ценовые алерты,
уведомления и отчёты.

---

## Стек

| Инструмент | Версия / Назначение |
|-----------|---------------------|
| **React 18** + **TypeScript** | UI + типизация |
| **Vite** | Сборка и dev-сервер |
| **shadcn/ui** | Компоненты (Button, Input, Dialog, Badge, Switch, Select, ...) |
| **Tailwind CSS v4** | Утилитарные стили (через `@tailwindcss/vite`, без tailwind.config.ts) |
| **Lucide React** | Иконки |
| **TanStack Query** | Серверное состояние и кэш (staleTime: 30 с) |
| **React Router v6** | Маршрутизация |
| **Lightweight Charts** | Финансовые свечные графики |
| **Axios** | HTTP-клиент |
| **bun** | Пакетный менеджер и раннер |

---

## Запуск

```bash
# Установить зависимости
bun install

# Dev-сервер (порт 3000, проксирует API)
bun run dev

# Проверка типов
bun run type-check

# Линтер (строгий, --max-warnings 0)
bun run lint

# Production-сборка
bun run build
```

---

## Маршруты

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | DashboardPage | Главная: сводка по алертам и сервисам |
| `/search` | SearchPage | Поиск акций по названию |
| `/instruments/:figi` | InstrumentPage | График цен + управление алертами |
| `/tracked` | TrackedPage | Все активные ценовые алерты |
| `/notifications` | NotificationsPage | История срабатывания алертов |
| `/analytics` | AnalyticsPage | AI-аналитика (roadmap) |
| `/profile` | ProfilePage | Профиль, email/Telegram, уведомления |
| `/login` | LoginPage | Вход по email / через Telegram |
| `/register` | RegisterPage | Регистрация по email |
| `/confirm-email` | ConfirmEmailPage | Ввод OTP-кода подтверждения email |
| `/roadmap` | RoadmapPage | Запланированные функции |

---

## Архитектура

### API-слой (`src/api/`)

Один файл на ресурс. Каждый файл содержит функции, которые вызывают Axios с нужным endpoint.

| Файл | Сервис | Описание |
|------|--------|----------|
| `auth.ts` | AuthService | Регистрация, вход, OTP |
| `profile.ts` | AuthService | Профиль, email, Telegram-связка |
| `instruments.ts` | MarketDataService | Поиск акций, свечи |
| `tracked.ts` | AlertService | CRUD ценовых алертов |
| `notifications.ts` | AlertService | История уведомлений |
| `reports.ts` | AlertService | Скачивание отчётов (PDF/MD) |

Все запросы проходят через единый API Gateway (`localhost:8080`), который маршрутизирует их к нужному сервису.

Базовый клиент (`client.ts`) — Axios instance с автоматической подстановкой JWT-токена
из localStorage и заголовка `X-Telegram-Init-Data` для Telegram-авторизации.

### Хуки (`src/hooks/`)

React Query обёртки над API-функциями. Содержат queries (useQuery) и mutations
(useMutation с инвалидацией кэша).

### Аутентификация

- JWT хранится в `localStorage`
- Telegram Mini App использует `window.Telegram.WebApp.initData` для авторизации без пароля
- Вне Telegram — мок-пользователь (ID: 123456789) для разработки

### Стили

- Tailwind v4 подключён через Vite-плагин (`@tailwindcss/vite`)
- Отдельный `tailwind.config.ts` не нужен
- Глобальные переменные и базовые стили — `src/styles/globals.css`
- Цветовая схема: тёмная тема, фиолетовый акцент (`#a855f7`)
- SCSS Modules для компонентов с нестандартными стилями

### PriceChart

Свечной график на базе `lightweight-charts`:
- Краткосрочные периоды (1D, 1W): используют `UTCTimestamp` из реального `candle.time`
- Длинные периоды (1M, 3M, 1Y): используют date-строку `"YYYY-MM-DD"` из `candle.time`
- `timeScale.timeVisible: true` для внутридневных периодов

---

## API Proxy (vite.config.ts)

В dev-режиме Vite проксирует все `/api/**` запросы к API Gateway:

```
/api/**  → http://localhost:8080  (API Gateway)
```

API Gateway маршрутизирует запросы к downstream-сервисам:

| Маршрут | Сервис | JWT |
|---------|--------|-----|
| `/api/auth/**` | AuthService:8081 | Нет |
| `/api/profile/**` | AuthService:8081 | Да |
| `/api/tracked-instruments/**` | AlertService:8082 | Да |
| `/api/notifications/**` | AlertService:8082 | Да |
| `/api/reports/**` | AlertService:8082 | Да |
| `/api/instruments/**` | MarketDataService:8083 | Нет |
| `/api/accounts/**` | PortfolioService:8084 | Нет |
| `/api/portfolio/**` | PortfolioService:8084 | Нет |

---

## Структура проекта

```
webapp/
├── src/
│   ├── api/                 # HTTP-функции по ресурсам
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── ui/              # shadcn/ui базовые компоненты
│   │   ├── AlertDialog/     # Диалог создания/редактирования алерта
│   │   ├── Layout/          # Layout с нижней навигацией
│   │   ├── PriceChart/      # Свечной график
│   │   └── ...              # Прочие компоненты
│   ├── hooks/               # React Query хуки
│   ├── lib/
│   │   └── utils.ts         # cn() helper (clsx + tailwind-merge)
│   ├── pages/               # Страницы (см. таблицу маршрутов)
│   ├── providers/           # TelegramProvider (контекст Telegram WebApp)
│   ├── styles/
│   │   └── globals.css      # CSS-переменные, Tailwind directives
│   ├── types/
│   │   └── api.ts           # TypeScript-интерфейсы для всех DTO
│   └── App.tsx              # Router + маршруты
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Типы (`src/types/api.ts`)

Все DTO-интерфейсы соответствуют контрактам бэкенда:

- `InstrumentDto`, `CandleDto` — MarketDataService
- `TrackedInstrumentRequest`, `TrackedInstrumentResponse` — AlertService
- `NotificationResponse` — AlertService
- `AuthResponse`, `ProfileResponse` — AuthService

`TrackedInstrumentResponse.appUserId` — UUID string (не число).
`CandleDto.time` — ISO 8601 UTC строка.
