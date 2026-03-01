import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '@gravity-ui/uikit';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { InstrumentPage } from './pages/InstrumentPage/InstrumentPage';
import { TrackedPage } from './pages/TrackedPage/TrackedPage';
import { NotificationsPage } from './pages/NotificationsPage/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { ConfirmEmailPage } from './pages/ConfirmEmailPage/ConfirmEmailPage';
import { useAuth } from './providers/AuthProvider';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
        <Loader size="l" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      {/* Публичные страницы */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      {/* Защищённые страницы */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/instrument/:figi" element={<InstrumentPage />} />
        <Route path="/tracked" element={<TrackedPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
