import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, Switch, Text, TextInput } from '@gravity-ui/uikit';
import { Envelope, LogoTelegram, Bell, ArrowRightFromSquare, TrashBin } from '@gravity-ui/icons';
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
import type { AddEmailResponse, ConflictResolution, ProfileResponse } from '@/types/api';
import styles from './ProfilePage.module.scss';

interface ConflictState {
  webCount: number;
  telegramCount: number;
  initData: string;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles['profile-page__stat-card']}>
      <div className={styles['profile-page__stat-value']}>{value}</div>
      <div className={styles['profile-page__stat-label']}>{label}</div>
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
          setPending({ email: email.trim(), action: resp.action, webCount: resp.webCount, telegramCount: resp.telegramCount });
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
          // onSuccess in hook updates localStorage + invalidates profile query
          // For LINK scenario, reload to get fresh auth state
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
      <div className={styles['profile-page__section']}>
        <div className={styles['profile-page__section-title']}>Добавить email</div>
        <div className={styles['profile-page__add-email-form']}>
          <TextInput
            value={email}
            onUpdate={setEmail}
            placeholder="your@email.com"
            type="email"
            size="l"
            autoComplete="email"
          />
          <TextInput
            value={password}
            onUpdate={setPassword}
            placeholder="Пароль (мин. 8 символов)"
            type="password"
            size="l"
            autoComplete="new-password"
          />
          {error && (
            <Text color="danger" variant="body-2">
              {error}
            </Text>
          )}
          <Button
            view="action"
            size="l"
            width="max"
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

  // OTP step
  return (
    <div className={styles['profile-page__section']}>
      <div className={styles['profile-page__section-title']}>Подтвердите email</div>
      <div className={styles['profile-page__add-email-form']}>
        <Text variant="body-2" color="secondary">
          Код подтверждения отправлен на{' '}
          <span style={{ color: 'var(--g-color-text-primary)' }}>{pending?.email}</span>
        </Text>

        <TextInput
          value={code}
          onUpdate={setCode}
          placeholder="6-значный код"
          size="l"
          autoComplete="one-time-code"
        />

        {pending?.action === 'LINK' && (
          <div className={styles['profile-page__conflict']}>
            <Text variant="body-2">
              Аккаунт с этим email уже существует. У него {pending.webCount} алерт(ов), у вас —{' '}
              {pending.telegramCount}. Выберите стратегию объединения:
            </Text>
            <div className={styles['profile-page__conflict-actions']}>
              <Button
                view={resolution === 'KEEP_WEB' ? 'action' : 'outlined'}
                size="s"
                onClick={() => setResolution('KEEP_WEB')}
              >
                Оставить web
              </Button>
              <Button
                view={resolution === 'KEEP_TELEGRAM' ? 'action' : 'outlined'}
                size="s"
                onClick={() => setResolution('KEEP_TELEGRAM')}
              >
                Оставить мои
              </Button>
              <Button
                view={resolution === 'MERGE' ? 'action' : 'outlined'}
                size="s"
                onClick={() => setResolution('MERGE')}
              >
                Объединить
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Text color="danger" variant="body-2">
            {error}
          </Text>
        )}

        <div className={styles['profile-page__add-email-footer']}>
          <Button
            view="flat"
            size="l"
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
            view="action"
            size="l"
            loading={verifyAddEmail.isPending}
            disabled={code.length !== 6}
            onClick={handleVerify}
          >
            Подтвердить
          </Button>
        </div>
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
    <div className={styles['profile-page']}>
      <PageHeader title="Профиль" subtitle="Управление аккаунтом и настройки" />

      {/* Идентификация */}
      <div className={styles['profile-page__section']}>
        <div className={styles['profile-page__section-title']}>Аккаунт</div>

        <div className={styles['profile-page__info-card']}>
          {profile.email && (
            <div className={styles['profile-page__info-row']}>
              <Envelope className={styles['profile-page__info-icon']} />
              <div className={styles['profile-page__info-content']}>
                <div className={styles['profile-page__info-label']}>Email</div>
                <div className={styles['profile-page__info-value']}>{profile.email}</div>
              </div>
              {profile.emailConfirmed ? (
                <span className={styles['profile-page__badge--confirmed']}>Подтверждён</span>
              ) : (
                <span className={styles['profile-page__badge--pending']}>Не подтверждён</span>
              )}
            </div>
          )}

          {profile.telegramId && (
            <div className={styles['profile-page__info-row']}>
              <LogoTelegram className={styles['profile-page__info-icon']} />
              <div className={styles['profile-page__info-content']}>
                <div className={styles['profile-page__info-label']}>Telegram</div>
                <div className={styles['profile-page__info-value']}>ID: {profile.telegramId}</div>
              </div>
              <span className={styles['profile-page__badge--confirmed']}>Привязан</span>
            </div>
          )}
        </div>

        {/* Email не подтверждён */}
        {profile.email && !profile.emailConfirmed && (
          <div className={styles['profile-page__warning']}>
            <Text variant="body-2" color="warning">
              Подтвердите email, чтобы получать уведомления о ценах.
            </Text>
            <Button
              view="outlined-warning"
              size="s"
              onClick={() => navigate('/confirm-email')}
            >
              Подтвердить
            </Button>
          </div>
        )}

        {/* Привязка Telegram */}
        {!profile.telegramLinked && isTelegram && initData && (
          <div className={styles['profile-page__action-row']}>
            <LogoTelegram />
            <Text variant="body-2">Привязать Telegram-аккаунт</Text>
            <Button
              view="outlined"
              size="s"
              loading={linkTelegram.isPending}
              onClick={handleLinkTelegram}
            >
              Привязать
            </Button>
          </div>
        )}

        {/* Конфликт при привязке */}
        {conflict && (
          <div className={styles['profile-page__conflict']}>
            <Text variant="body-2">
              У вас есть алерты в обоих аккаунтах ({conflict.webCount} web /{' '}
              {conflict.telegramCount} Telegram). Выберите действие:
            </Text>
            <div className={styles['profile-page__conflict-actions']}>
              <Button
                view="outlined"
                size="s"
                loading={resolveConflict.isPending}
                onClick={() => handleResolveConflict('KEEP_WEB')}
              >
                Оставить web
              </Button>
              <Button
                view="outlined"
                size="s"
                loading={resolveConflict.isPending}
                onClick={() => handleResolveConflict('KEEP_TELEGRAM')}
              >
                Оставить Telegram
              </Button>
              <Button
                view="action"
                size="s"
                loading={resolveConflict.isPending}
                onClick={() => handleResolveConflict('MERGE')}
              >
                Объединить
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Добавление email к Telegram-аккаунту */}
      {isTelegram && !profile.email && <AddEmailSection />}

      {/* Статистика */}
      <div className={styles['profile-page__section']}>
        <div className={styles['profile-page__section-title']}>Статистика алертов</div>
        <div className={styles['profile-page__stats']}>
          <StatCard label="Всего" value={alertStats.total} />
          <StatCard label="Активных" value={alertStats.active} />
          <StatCard label="Покупка" value={alertStats.buyAlertTriggered} />
          <StatCard label="Продажа" value={alertStats.sellAlertTriggered} />
        </div>
      </div>

      {/* Настройки уведомлений */}
      {profile.emailConfirmed && (
        <div className={styles['profile-page__section']}>
          <div className={styles['profile-page__section-title']}>Уведомления</div>
          <div className={styles['profile-page__setting-row']}>
            <Bell />
            <div className={styles['profile-page__setting-info']}>
              <Text variant="body-2">Email-уведомления</Text>
              <Text variant="caption-2" color="secondary">
                Получать уведомления о ценах на почту
              </Text>
            </div>
            <Switch
              checked={profile.emailNotificationsEnabled}
              onUpdate={(checked) => updateNotifications.mutate(checked)}
              disabled={updateNotifications.isPending}
            />
          </div>
        </div>
      )}

      {/* Действия */}
      <div className={styles['profile-page__section']}>
        <Button view="outlined" size="l" width="max" onClick={logout}>
          <Button.Icon>
            <ArrowRightFromSquare />
          </Button.Icon>
          Выйти из аккаунта
        </Button>

        <Button
          view="outlined-danger"
          size="l"
          width="max"
          loading={deleteAccount.isPending}
          onClick={handleDeleteAccount}
        >
          <Button.Icon>
            <TrashBin />
          </Button.Icon>
          Удалить аккаунт
        </Button>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className={styles['profile-page__loading']}>
        <Loader size="l" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className={styles['profile-page__loading']}>
        <Text color="danger" variant="body-2">
          Не удалось загрузить профиль
        </Text>
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}
