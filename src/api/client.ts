import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Telegram init data for auth
apiClient.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    // Send initData for backend validation if needed
    config.headers['X-Telegram-Init-Data'] = tg.initDataUnsafe
      ? JSON.stringify(tg.initDataUnsafe)
      : '';
  }
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      return Promise.reject({
        status: error.response.status,
        title: data?.title || 'Ошибка',
        detail: data?.detail || error.message,
        errors: data?.errors,
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
