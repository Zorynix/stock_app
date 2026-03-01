import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Magnifier,
  Bell,
  BellDot,
  House,
  Person,
} from '@gravity-ui/icons';
import styles from './Layout.module.scss';

const NAV_ITEMS = [
  { path: '/', label: 'Главная', icon: House },
  { path: '/search', label: 'Поиск', icon: Magnifier },
  { path: '/tracked', label: 'Алерты', icon: BellDot },
  { path: '/notifications', label: 'Уведомления', icon: Bell },
  { path: '/profile', label: 'Профиль', icon: Person },
] as const;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      <main className={styles.layout__content}>
        <Outlet />
      </main>

      <nav className={styles.layout__nav}>
        <div className={styles['layout__nav-inner']}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive =
              path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

            return (
              <button
                key={path}
                className={`${styles['layout__nav-item']} ${isActive ? styles['layout__nav-item--active'] : ''}`}
                onClick={() => navigate(path)}
                type="button"
              >
                <Icon />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
