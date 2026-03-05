import { i18n } from '/@/locales/setupI18n';

type I18nKeyParam = string | string[];
type I18nGlobalTranslation = {
  (key: I18nKeyParam): string;
  (key: I18nKeyParam, locale: string): string;
  (key: I18nKeyParam, locale: string, list: unknown[]): string;
  (key: I18nKeyParam, locale: string, named: Record<string, unknown>): string;
  (key: I18nKeyParam, list: unknown[]): string;
  (key: I18nKeyParam, named: Record<string, unknown>): string;
};

type I18nTranslationRestParameters = [string, any];

function getKey(namespace: string | undefined, key: string) {
  if (!namespace) {
    return key;
  }
  if (key.startsWith(namespace)) {
    return key;
  }
  return `${namespace}.${key}`;
}

function getGlobalI18n() {
  return i18n?.global;
}

function getLocaleValue() {
  const global = getGlobalI18n();
  const locale = global?.locale as unknown;
  if (typeof locale === 'string') {
    return locale;
  }
  return (locale as { value?: string } | undefined)?.value;
}

function translate(key: string, args: I18nTranslationRestParameters | any[]) {
  const global = getGlobalI18n();
  const translator = global?.t;
  if (!translator) {
    return key;
  }
  return translator(key, ...(args as I18nTranslationRestParameters));
}

export function useI18n(namespace?: string) {
  const formatKey = (key: string) => getKey(namespace, key);

  const tFn: I18nGlobalTranslation = (key: I18nKeyParam, ...arg: any[]) => {
    if (Array.isArray(key)) {
      const translatedTexts = key.map(item => translate(formatKey(item), arg as any[]));
      const localeValue = getLocaleValue();
      if (localeValue && ['en_US', 'vi-VN'].includes(localeValue)) {
        return translatedTexts.join(' ');
      }
      return translatedTexts.join('');
    }
    if (!key) return '';
    const normalizedKey = formatKey(key);
    if (!normalizedKey.includes('.') && !namespace) {
      return normalizedKey;
    }
    return translate(normalizedKey, arg as any[]);
  };

  const global = getGlobalI18n();
  if (!global) {
    return {
      t: tFn,
    } as {
      t: I18nGlobalTranslation;
    };
  }

  const { t, ...methods } = global;

  return {
    ...methods,
    t: tFn,
  };
}

// Why write this function?
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places.

// 为什么要编写此函数？
// 主要用于配合vscode i18nn ally插件。此功能仅用于路由和菜单。请在其他地方使用useI18n
export const t = (key: string) => key;
