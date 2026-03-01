import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BellDot, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Главная', icon: Home },
  { path: '/search', label: 'Поиск', icon: Search },
  { path: '/tracked', label: 'Алерты', icon: BellDot },
  { path: '/notifications', label: 'Уведомления', icon: Bell },
  { path: '/profile', label: 'Профиль', icon: User },
] as const;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-dvh bg-background">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="shrink-0 border-t border-card-border bg-card/80 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-stretch">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive =
              path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

            return (
              <button
                key={path}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => navigate(path)}
                type="button"
              >
                <Icon
                  className={cn('w-5 h-5', isActive && 'drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]')}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
