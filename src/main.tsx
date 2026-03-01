import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/globals.css';

import { App } from './App';
import { TelegramProvider } from './providers/TelegramProvider';
import { AuthProvider } from './providers/AuthProvider';

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
          <AuthProvider>
            <App />
          </AuthProvider>
        </TelegramProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
