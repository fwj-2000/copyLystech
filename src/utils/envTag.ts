import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export type EnvKind = 'local' | 'dev' | 'test' | 'pre' | 'prod' | 'unknown';

export function getEnvFromHost(hostname = window.location.hostname): EnvKind {
  const host = hostname.toLowerCase();
  if (host.includes('localhost')) return 'local';
  if (host.startsWith('lydcdev.')) return 'dev';
  if (host.startsWith('lydctest.')) return 'test';
  if (host.startsWith('lydcpre.')) return 'pre';
  if (host === 'lydc.lstech.com' || host.startsWith('lydc.')) return 'prod';

  return 'unknown';
}

export function getEnvMeta(kind: EnvKind) {
  switch (kind) {
    case 'local':
      return { label: t('common.local'), color: 'cyan' as const };
    case 'dev':
      return { label: t('common.development'), color: 'blue' as const };
    case 'test':
      return { label: t('common.test'), color: 'orange' as const };
    case 'pre':
      return { label: t('common.preProduction'), color: 'purple' as const };
    case 'prod':
      return { label: '生产', color: 'green' as const };
    default:
      return { label: '未知', color: 'default' as const };
  }
}
