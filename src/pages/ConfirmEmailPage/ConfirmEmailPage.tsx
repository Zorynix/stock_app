import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/AuthProvider';

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
    <div className="min-h-dvh flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Подтвердите email</h1>
          <p className="text-sm text-muted-foreground">
            Мы отправили 6-значный код на{' '}
            <span className="text-primary font-medium">{pendingEmail}</span>
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">Код из письма</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoComplete="one-time-code"
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-negative">{error}</p>}
            {success && <p className="text-sm text-positive">{success}</p>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={code.length !== 6}
            >
              Подтвердить
            </Button>
          </form>
        </div>

        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Повторная отправка через {cooldown} сек.
            </p>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleResend}>
              Отправить код повторно
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
