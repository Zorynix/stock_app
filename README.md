# StockApp — Telegram Mini App

Telegram Mini App для работы с рынком акций. Построена на React + TypeScript + Gravity UI.

## Стек

- **React 18** + **TypeScript** — UI
- **Vite** — сборка и dev-сервер
- **Gravity UI** (`@gravity-ui/uikit`) — дизайн-система компонентов
- **TanStack Query** — управление серверным состоянием и кэширование
- **React Router v6** — маршрутизация
- **Lightweight Charts** — финансовые графики
- **Axios** — HTTP-клиент
- **SCSS Modules** — стили

## Структура проекта

```
webapp/
├── public/              # Статические файлы
├── src/
│   ├── api/             # HTTP-клиент и API-функции
│   ├── components/      # Переиспользуемые компоненты
│   │   ├── AlertDialog/     # Диалог создания/редактирования алерта
│   │   ├── EmptyState/      # Пустое состояние
│   │   ├── InstrumentCard/  # Карточка инструмента
│   │   ├── Layout/          # Основной layout с навигацией
│   │   ├── PageHeader/      # Заголовок страницы
│   │   ├── PriceChart/      # График цен (Lightweight Charts)
│   │   ├── ServiceCard/     # Карточка сервиса
│   │   └── TrackedCard/     # Карточка отслеживаемого инструмента
│   ├── hooks/           # React Query хуки
│   ├── pages/           # Страницы приложения
│   │   ├── DashboardPage/       # Главная — обзор сервисов и алертов
│   │   ├── SearchPage/         # Поиск акций
│   │   ├── InstrumentPage/     # Детали инструмента + график + алерты
│   │   ├── TrackedPage/        # Список всех ценовых алертов
│   │   ├── PortfolioPage/      # [Заглушка] Портфель
│   │   ├── AnalyticsPage/      # [Заглушка] AI-аналитика
│   │   └── NotificationsPage/  # [Заглушка] Новости и события
│   ├── providers/       # Telegram контекст
│   ├── styles/          # Глобальные стили
│   ├── types/           # TypeScript типы
│   └── utils/           # Утилиты
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Сервисы

| Сервис | Статус | Описание |
|--------|--------|----------|
| **MarketService** | ✅ Подключён | Поиск акций, графики цен, ценовые алерты |
| **PortfolioService** | 🔜 Заглушка | Управление портфелем, учёт P&L |
| **AnalyticsService** | 🔜 Заглушка | AI-аналитика, скринеры, рекомендации |
| **NewsService** | 🔜 Заглушка | Новости, события, календарь отчётностей |

## Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер (порт 3000, прокси → localhost:8080)
npm run dev

# Production-сборка
npm run build

# Превью production-сборки
npm run preview
```

## API Proxy

В dev-режиме Vite проксирует `/api/*` → `http://localhost:8080/api/*` (MarketService).

## Интеграция с Telegram

Приложение автоматически определяет, запущено ли оно в Telegram:
- **В Telegram**: использует `window.Telegram.WebApp` для авторизации, haptic feedback, нативных диалогов
- **Вне Telegram**: работает в dev-режиме с моковым пользователем

Для подключения к боту, укажите URL приложения в настройках Mini App бота через `@BotFather`.
