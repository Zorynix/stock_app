import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextInput, Text } from '@gravity-ui/uikit';
import { useAuth } from '@/providers/AuthProvider';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; title?: string };
      setError(apiErr.detail || apiErr.title || 'Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Text variant="header-1">StockApp</Text>
          <Text variant="body-2" color="secondary">
            Войдите в аккаунт
          </Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            type="email"
            label="Email"
            value={email}
            onUpdate={setEmail}
            placeholder="you@example.com"
            size="l"
            autoComplete="email"
            disabled={isLoading}
          />

          <TextInput
            type="password"
            label="Пароль"
            value={password}
            onUpdate={setPassword}
            placeholder="Ваш пароль"
            size="l"
            autoComplete="current-password"
            disabled={isLoading}
          />

          {error && (
            <Text color="danger" variant="body-2">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            view="action"
            size="l"
            width="max"
            loading={isLoading}
            disabled={!email || !password}
          >
            Войти
          </Button>
        </form>

        <div className={styles.footer}>
          <Text variant="body-2" color="secondary">
            Нет аккаунта?{' '}
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
