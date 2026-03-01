import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LogOut, Trash2, Bell, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTelegram } from '@/providers/TelegramProvider';
import {
  useProfile,
  useUpdateNotifications,
  useLinkTelegram,
  useResolveConflict,
  useDeleteAccount,
  useAddEmail,
  useVerifyAddEmail,
} from '@/hooks/useProfile';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { AddEmailResponse, ConflictResolution, ProfileResponse } from '@/types/api';

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.834.946z" />
    </svg>
  );
}

interface ConflictState {
  webCount: number;
  telegramCount: number;
  initData: string;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-3 text-center">
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

interface AddEmailState {
  email: string;
  action: AddEmailResponse['action'];
  webCount: number;
  telegramCount: number;
}

function AddEmailSection() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState<AddEmailState | null>(null);
  const [code, setCode] = useState('');
  const [resolution, setResolution] = useState<ConflictResolution | null>(null);
  const [error, setError] = useState('');

  const addEmail = useAddEmail();
  const verifyAddEmail = useVerifyAddEmail();

  const handleSubmitForm = () => {
    setError('');
    addEmail.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (resp) => {
          setPending({
            email: email.trim(),
            action: resp.action,
            webCount: resp.webCount,
            telegramCount: resp.telegramCount,
          });
          setStep('otp');
        },
        onError: (err: unknown) => {
          setError((err as { detail?: string }).detail || 'Произошла ошибка');
        },
      },
    );
  };

  const handleVerify = () => {
    if (!pending) return;
    if (pending.action === 'LINK' && !resolution) {
      setError('Выберите стратегию объединения алертов');
      return;
    }
    setError('');
    verifyAddEmail.mutate(
      { email: pending.email, code, resolution: resolution ?? undefined },
      {
        onSuccess: () => {
          if (pending.action === 'LINK') {
            window.location.reload();
          }
        },
        onError: (err: unknown) => {
          setError((err as { detail?: string }).detail || 'Произошла ошибка');
        },
      },
    );
  };

  if (step === 'form') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Добавить email</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-password">Пароль</Label>
            <Input
              id="add-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль (мин. 8 символов)"
              type="password"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-negative">{error}</p>}
          <Button
            className="w-full"
            loading={addEmail.isPending}
            disabled={!email || !password}
            onClick={handleSubmitForm}
          >
            Продолжить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Подтвердите email</h3>
      <p className="text-sm text-muted-foreground">
        Код подтверждения отправлен на{' '}
        <span className="text-foreground font-medium">{pending?.email}</span>
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="otp-code">6-значный код</Label>
        <Input
          id="otp-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          autoComplete="one-time-code"
        />
      </div>

      {pending?.action === 'LINK' && (
        <div className="space-y-2 p-3 bg-warning/10 border border-warning/20 rounded-xl">
          <p className="text-xs text-warning">
            Аккаунт с этим email уже существует. У него {pending.webCount} алерт(ов), у вас —{' '}
            {pending.telegramCount}. Выберите стратегию:
          </p>
          <div className="flex gap-2">
            {(['KEEP_WEB', 'KEEP_TELEGRAM', 'MERGE'] as ConflictResolution[]).map((r) => (
              <button
                key={r}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  resolution === r
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'border-card-border text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setResolution(r)}
                type="button"
              >
                {r === 'KEEP_WEB' ? 'Оставить web' : r === 'KEEP_TELEGRAM' ? 'Мои алерты' : 'Объединить'}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-negative">{error}</p>}

      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => {
            setStep('form');
            setCode('');
            setError('');
            setResolution(null);
          }}
        >
          Назад
        </Button>
        <Button
          className="flex-1"
          loading={verifyAddEmail.isPending}
          disabled={code.length !== 6}
          onClick={handleVerify}
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
}

function ProfileContent({ profile }: { profile: ProfileResponse }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isTelegram, showConfirm } = useTelegram();
  const initData = window.Telegram?.WebApp?.initData ?? '';

  const updateNotifications = useUpdateNotifications();
  const linkTelegram = useLinkTelegram();
  const resolveConflict = useResolveConflict();
  const deleteAccount = useDeleteAccount();

  const [conflict, setConflict] = useState<ConflictState | null>(null);

  const handleLinkTelegram = () => {
    if (!initData) return;
    linkTelegram.mutate(initData, {
      onError: (err: unknown) => {
        const apiErr = err as { webInstrumentsCount?: number; telegramInstrumentsCount?: number };
        if (apiErr.webInstrumentsCount !== undefined) {
          setConflict({
            webCount: apiErr.webInstrumentsCount ?? 0,
            telegramCount: apiErr.telegramInstrumentsCount ?? 0,
            initData,
          });
        }
      },
    });
  };

  const handleResolveConflict = (resolution: 'KEEP_WEB' | 'KEEP_TELEGRAM' | 'MERGE') => {
    if (!conflict) return;
    resolveConflict.mutate(
      { initData: conflict.initData, resolution },
      { onSuccess: () => setConflict(null) },
    );
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm(
      'Удалить аккаунт? Это действие необратимо — все данные будут удалены.',
    );
    if (!confirmed) return;

    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate('/login', { replace: true });
      },
    });
  };

  const { alertStats } = profile;

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Профиль" subtitle="Управление аккаунтом и настройки" />

      <div className="px-4 space-y-4 pb-6">
        {/* Account info */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Аккаунт</h3>
          <div className="bg-card border border-card-border rounded-2xl divide-y divide-card-border">
            {profile.email && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground truncate">{profile.email}</p>
                </div>
                <Badge variant={profile.emailConfirmed ? 'success' : 'warning'}>
                  {profile.emailConfirmed ? 'Подтверждён' : 'Не подтверждён'}
                </Badge>
              </div>
            )}

            {profile.telegramId && (
              <div className="flex items-center gap-3 px-4 py-3">
                <TelegramIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Telegram</p>
                  <p className="text-sm text-foreground">ID: {profile.telegramId}</p>
                </div>
                <Badge variant="success">Привязан</Badge>
              </div>
            )}

            {!profile.email && !profile.telegramId && (
              <div className="flex items-center gap-3 px-4 py-3">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">Нет привязанного аккаунта</p>
              </div>
            )}
          </div>

          {/* Email not confirmed warning */}
          {profile.email && !profile.emailConfirmed && (
            <div className="flex items-center justify-between gap-3 p-3 bg-warning/10 border border-warning/20 rounded-xl">
              <p className="text-xs text-warning flex-1">
                Подтвердите email, чтобы получать уведомления о ценах.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-warning/40 text-warning hover:bg-warning/10"
                onClick={() => navigate('/confirm-email')}
              >
                Подтвердить
              </Button>
            </div>
          )}

          {/* Link Telegram */}
          {!profile.telegramLinked && isTelegram && initData && (
            <div className="flex items-center gap-3 p-3 bg-card border border-card-border rounded-xl">
              <TelegramIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="flex-1 text-sm text-foreground">Привязать Telegram-аккаунт</p>
              <Button
                size="sm"
                variant="outline"
                loading={linkTelegram.isPending}
                onClick={handleLinkTelegram}
              >
                Привязать
              </Button>
            </div>
          )}

          {/* Conflict resolution */}
          {conflict && (
            <div className="p-3 space-y-2 bg-warning/10 border border-warning/20 rounded-xl">
              <p className="text-xs text-warning">
                У вас есть алерты в обоих аккаунтах ({conflict.webCount} web /{' '}
                {conflict.telegramCount} Telegram). Выберите действие:
              </p>
              <div className="flex gap-2">
                {(['KEEP_WEB', 'KEEP_TELEGRAM', 'MERGE'] as const).map((r) => (
                  <Button
                    key={r}
                    variant={r === 'MERGE' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                    loading={resolveConflict.isPending}
                    onClick={() => handleResolveConflict(r)}
                  >
                    {r === 'KEEP_WEB' ? 'Web' : r === 'KEEP_TELEGRAM' ? 'Telegram' : 'Объединить'}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add email for Telegram users */}
        {isTelegram && !profile.email && (
          <div className="bg-card border border-card-border rounded-2xl p-4">
            <AddEmailSection />
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Статистика алертов
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <StatCard label="Всего" value={alertStats.total} />
            <StatCard label="Активных" value={alertStats.active} />
            <StatCard label="Покупка" value={alertStats.buyAlertTriggered} />
            <StatCard label="Продажа" value={alertStats.sellAlertTriggered} />
          </div>
        </div>

        {/* Notification toggle */}
        {profile.emailConfirmed && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Уведомления
            </h3>
            <div className="flex items-center gap-3 bg-card border border-card-border rounded-xl px-4 py-3">
              <Bell className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Email-уведомления</p>
                <p className="text-xs text-muted-foreground">Получать уведомления о ценах на почту</p>
              </div>
              <Switch
                checked={profile.emailNotificationsEnabled}
                onCheckedChange={(checked) => updateNotifications.mutate(checked)}
                disabled={updateNotifications.isPending}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Действия
          </h3>
          <Button variant="outline" size="lg" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4" /> Выйти из аккаунта
          </Button>
          <Button
            variant="outline-destructive"
            size="lg"
            className="w-full"
            loading={deleteAccount.isPending}
            onClick={handleDeleteAccount}
          >
            <Trash2 className="w-4 h-4" /> Удалить аккаунт
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-sm text-negative">Не удалось загрузить профиль</p>
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}
