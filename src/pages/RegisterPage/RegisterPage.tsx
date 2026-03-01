import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextInput, Text } from '@gravity-ui/uikit';
import { useAuth } from '@/providers/AuthProvider';
import styles from './RegisterPage.module.scss';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await register(email, password);
      navigate('/confirm-email', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; title?: string };
      setError(apiErr.detail || apiErr.title || 'Ошибка регистрации');
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
            Создайте аккаунт
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
            placeholder="Минимум 8 символов"
            size="l"
            autoComplete="new-password"
            disabled={isLoading}
          />

          <TextInput
            type="password"
            label="Повторите пароль"
            value={confirm}
            onUpdate={setConfirm}
            placeholder="Повторите пароль"
            size="l"
            autoComplete="new-password"
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
            disabled={!email || !password || !confirm}
          >
            Зарегистрироваться
          </Button>
        </form>

        <div className={styles.footer}>
          <Text variant="body-2" color="secondary">
            Уже есть аккаунт?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
