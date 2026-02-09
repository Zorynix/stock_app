import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, configure } from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './styles/global.scss';

import { App } from './App';
import { TelegramProvider } from './providers/TelegramProvider';

configure({ lang: 'ru' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <ThemeProvider theme="dark">
            <App />
          </ThemeProvider>
        </TelegramProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
