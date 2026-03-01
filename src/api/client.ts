import axios from 'axios';

const AUTH_KEY = 'auth_user';

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as { token: string }) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: object | null) {
  if (auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем JWT Bearer token если есть
apiClient.interceptors.request.use((config) => {
  const stored = getStoredAuth();
  if (stored?.token) {
    config.headers['Authorization'] = `Bearer ${stored.token}`;
  }
  return config;
});

// Нормализуем ошибки в единый формат.
// При 401 в Telegram-контексте — переаутентифицируемся через initData
// (актуально когда аккаунт был удалён, а старый JWT остался в localStorage).
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        const initData = window.Telegram?.WebApp?.initData;
        if (initData && !error.config?.url?.includes('/auth/telegram')) {
          try {
            const { data } = await axios.post(
              (import.meta.env.VITE_API_BASE_URL || '/api') + '/auth/telegram',
              { initData },
              { headers: { 'Content-Type': 'application/json' } },
            );
            setStoredAuth(data);
            // Повторяем исходный запрос с новым токеном
            const retryConfig = { ...error.config };
            retryConfig.headers?.set('Authorization', `Bearer ${data.token}`);
            return apiClient(retryConfig);
          } catch {
            setStoredAuth(null);
          }
        }
      }

      const data = error.response.data;
      return Promise.reject({
        status,
        title: data?.title || 'Ошибка',
        detail: data?.detail || error.message,
        errors: data?.errors,
        // Детали конфликта привязки Telegram
        webInstrumentsCount: data?.webInstrumentsCount,
        telegramInstrumentsCount: data?.telegramInstrumentsCount,
      });
    }
    return Promise.reject({
      status: 0,
      title: 'Ошибка сети',
      detail: 'Не удалось подключиться к серверу',
    });
  },
);

export { apiClient };
