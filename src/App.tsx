import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { InstrumentPage } from './pages/InstrumentPage/InstrumentPage';
import { TrackedPage } from './pages/TrackedPage/TrackedPage';
import { PortfolioPage } from './pages/PortfolioPage/PortfolioPage';
import { AnalyticsPage } from './pages/AnalyticsPage/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage/NotificationsPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/instrument/:figi" element={<InstrumentPage />} />
        <Route path="/tracked" element={<TrackedPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
