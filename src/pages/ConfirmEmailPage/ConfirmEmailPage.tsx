import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Text } from '@gravity-ui/uikit';
import { useAuth } from '@/providers/AuthProvider';
import styles from './ConfirmEmailPage.module.scss';

const RESEND_COOLDOWN = 60;

export function ConfirmEmailPage() {
  const navigate = useNavigate();
  const { verifyEmail, resendCode, pendingEmail } = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!pendingEmail) {
      navigate('/', { replace: true });
    }
  }, [pendingEmail, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingEmail || code.length !== 6) return;

    setError('');
    setIsLoading(true);
    try {
      await verifyEmail(pendingEmail, code);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { detail?: string };
      setError(apiErr.detail || 'Неверный или просроченный код');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail || cooldown > 0) return;
    try {
      await resendCode(pendingEmail);
      setSuccess('Новый код отправлен на почту');
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setSuccess('');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Text variant="header-1">Подтвердите email</Text>
          <Text variant="body-2" color="secondary">
            Мы отправили 6-значный код на{' '}
            <Text as="span" variant="body-2" color="primary">
              {pendingEmail}
            </Text>
          </Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Код из письма"
            value={code}
            onUpdate={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            size="l"
            autoComplete="one-time-code"
            disabled={isLoading}
          />

          {error && (
            <Text color="danger" variant="body-2">
              {error}
            </Text>
          )}

          {success && (
            <Text color="positive" variant="body-2">
              {success}
            </Text>
          )}

          <Button
            type="submit"
            view="action"
            size="l"
            width="max"
            loading={isLoading}
            disabled={code.length !== 6}
          >
            Подтвердить
          </Button>
        </form>

        <div className={styles.footer}>
          {cooldown > 0 ? (
            <Text variant="body-2" color="secondary">
              Повторная отправка через {cooldown} сек.
            </Text>
          ) : (
            <Button view="flat" size="s" onClick={handleResend}>
              Отправить код повторно
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
