/**
 * Multi-language related operations
 */
import type { LocaleType } from '/#/config';

import { i18n } from './setupI18n';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import { unref, computed } from 'vue';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { getLangDict } from '/@/api/system/baseLang';
import { localeSetting } from '/@/settings/localeSetting';
import type { DropMenu } from '../components/Dropdown';

interface LangModule {
  message: Recordable;
  dateLocale: Recordable;
  dateLocaleName: string;
}

const { availableLocales } = localeSetting;

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut();

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
  localeStore.setLocaleInfo({ locale });
  setHtmlPageLang(locale);
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  const getLocale = computed(() => localeStore.getLocale);
  const getTimeZone = computed(() => localeStore.getTimeZone);
  const getTimeZoneList = computed(() => localeStore.getTimezoneList);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);

  const getAntdLocale = computed((): any => {
    return i18n.global.getLocaleMessage(unref(getLocale))?.antdLocale ?? {};
  });

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (!availableLocales.includes(locale)) locale = 'zh_CN';
    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
    console.log('changeLocale-langModule:', langModule);
    // console.log("changeLocale-!langModule:",!langModule);
    if (!langModule) return;

    const { message } = langModule;

    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);

    setI18nLanguage(locale);
    return locale;
  }
  async function initLocale(locale: LocaleType) {
    const res = await getLangDict();
    if (!res || !res.data) return;
    const message = res.data;
    if (!availableLocales.includes(locale)) locale = 'zh_CN';
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
    // console.log("initLocale-langModule:",langModule);
    // console.log("initLocale-!langModule:",!langModule);
    // console.log('initLocale message:', message);
    if (!langModule) return setLocale(locale, message);
    const { message: defaultMessage } = langModule;
    setLocale(locale, { ...defaultMessage, ...message }); //服务端多语言会覆盖本地多语言
  }
  function setLocale(locale: LocaleType, message) {
    const globalI18n = i18n.global;
    // console.log('setLocale-locale:', locale);
    // console.log('setLocale-message:', message);
    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);
    setI18nLanguage(locale);
  }
  function setTimeZone(timezone: string) {
    localeStore.setLocaleInfo({ timezone });
  }
  function setTimeZoneList(timezoneList: DropMenu[]) {
    localeStore.setLocaleInfo({ timezoneList });
  }
  function setlocaleList(localeList: DropMenu[]) {
    localeStore.setLocaleInfo({ localeList });
  }

  return {
    getLocale,
    getTimeZone,
    setTimeZone,
    getTimeZoneList,
    setTimeZoneList,
    setlocaleList,
    getShowLocalePicker,
    changeLocale,
    initLocale,
    getAntdLocale,
  };
}
