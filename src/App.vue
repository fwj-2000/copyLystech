<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeConfig">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { computed, unref, watch } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { changeWaterMark, initWaterMark } from '/@/utils/helper/watermark';
  import { useUserStore } from '/@/store/modules/user';
  import { useBaseStore } from './store/modules/base';
  import 'dayjs/locale/zh-cn';
  import 'dayjs/locale/zh-tw';
  import { useDarkModeTheme } from '/@/hooks/setting/useDarkModeTheme';
  import { generateThemeToken } from '../build/config/themeConfig';

  const userStore = useUserStore();

  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();

  // 阻止火狐浏览器在拖动时打开新窗口
  document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };

  initWaterMark(userStore);

  const token = generateThemeToken();

  const { isDark, darkTheme } = useDarkModeTheme();
  const themeConfig = computed(() =>
    Object.assign(
      {
        token,
      },
      isDark.value ? darkTheme : {},
    ),
  );

  // 延迟加载字典
  setTimeout(() => {
    const baseStore = useBaseStore();
    baseStore.getDictionaryAll();
  }, 3000);

  watch(
    () => unref(userStore.getUserInfo).userName,
    () => {
      changeWaterMark(userStore);
    },
  );
</script>
