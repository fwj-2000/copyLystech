<template>
  <Tooltip :title="tooltipText" placement="left" :mouseEnterDelay="0.5">
    <Dropdown
      placement="bottom"
      :trigger="['click']"
      :dropMenuList="timezoneListFromStore"
      :selectedKeys="selectedKeys"
      @menu-event="handleMenuEvent"
      overlayClassName="app-locale-picker-overlay">
      <span class="cursor-pointer flex items-center leading-none">
        <slot name="prefix"></slot>
        <Icon icon="ion:time" v-if="!$slots.prefix && !$slots.suffix" class="mr-4px" />
        <span v-if="showText" class="mr-8px">{{ getShowText }}</span>
        <slot name="suffix"></slot>
      </span>
    </Dropdown>
  </Tooltip>
</template>
<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { LocaleType } from '/#/config';
  import type { DropMenu } from '/@/components/Dropdown';
  import { ref, watchEffect, unref, computed } from 'vue';
  import { Dropdown } from '/@/components/Dropdown';
  import { Icon } from '/@/components/Icon';
  import { useLocale } from '/@/locales/useLocale';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  // import { updateLanguage } from '/@/api/permission/userSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const localeStore = useLocaleStoreWithOut();
  let systemTz = dayjs.tz.guess();
  let systemTzOffset = dayjs().tz(systemTz).utcOffset();
  let timezoneListFromStore = computed(() =>
    localeStore.getTimezoneList.filter(item => {
      // 如果是系统时区选项，保留它
      if (item.event === 'system') return true;
      // 比较时区偏移量而不是名称
      try {
        const itemTzOffset = dayjs().tz(item.event).utcOffset();
        return itemTzOffset !== systemTzOffset;
      } catch (e) {
        // 如果时区名称无效，保留该选项
        console.warn(`无效的时区名称: ${item.event}`);
        return true;
      }
    }),
  );
  let currentTimeZone = computed(() => localeStore.getlocalInfoTimeZone);
  const { t } = useI18n();
  const props = defineProps({
    /**
     * Whether to display text
     */
    showText: { type: Boolean, default: true },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean, default: true },
    ignoreLogin: { type: Boolean, default: false },
  });

  const selectedKeys = ref<string[]>([]);

  const { changeLocale, setTimeZone } = useLocale();
  const { createMessage } = useMessage();
  let tooltipText = computed(() => {
    const key = selectedKeys.value[0];

    return (key === 'system' ? systemTz : key) + ' ' + t('layout.header.timezone');
  });
  const getShowText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }

    let item = timezoneListFromStore.value.find(item => item.event === key);
    if (!item) return '';
    if (item.event === 'system') {
      // 获取 UTC 偏移量（示例输出: "+08:00"）
      const offset = dayjs().tz(systemTz).format('Z');
      return 'TZ: UTC' + offset;
    }
    return 'TZ: ' + item.text;
  });

  watchEffect(() => {
    selectedKeys.value = [unref(currentTimeZone)];
  });

  async function toggleTimeZone(tz: string) {
    await setTimeZone(tz);
    selectedKeys.value = [tz];
    let timezone = tz === 'system' ? systemTz : tz;
    dayjs.tz.setDefault(timezone);
    props.reload && location.reload();
  }

  function toggleToast(menu) {
    let msg = '切换成功';
    if (menu.event === 'en') msg = 'Switch Language Success';
    if (menu.event === 'zh_TW') msg = '切換成功';
    createMessage.success(msg);
  }

  function handleMenuEvent(menu: DropMenu) {
    if (unref(currentTimeZone) === menu.event) return;
    toggleTimeZone(menu.event as string);
    toggleToast(menu);
  }
</script>
