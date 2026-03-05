<template>
  <Tooltip :title="showTooltip ? props.tooltip : ''" placement="top">
    <RangePicker v-bind="getBindValue" v-model:value="innerValue" :picker="getPicker" @change="onChange" />
  </Tooltip>
</template>

<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { RangePicker } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import { useLocale } from '/@/locales/useLocale';
  import { computed, ref, unref, watch } from 'vue';
  import { dateRangeProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { getDateTimeUnit, getDateFormat } from '/@/utils/lydc';

  // 添加时区插件
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { getTimeZone } = useLocale();

  defineOptions({ name: 'LydcDateRange', inheritAttrs: false });
  const props = defineProps(dateRangeProps);
  const emit = defineEmits(['update:value', 'change']);
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const innerValue = ref<[string, string] | undefined>(undefined);

  const getFormat = computed(() => getDateFormat(props.format || 'YYYY-MM-DD'));
  const showTooltip = computed(() => unref(getFormat) === 'YYYY-MM-DD' && props.tooltip);
  const getShowTime = computed(() => unref(getFormat) === 'YYYY-MM-DD HH:mm' || unref(getFormat) === 'YYYY-MM-DD HH:mm:ss');
  const getPicker = computed(() => {
    if (unref(getFormat) === 'YYYY') return 'year';
    if (unref(getFormat) === 'YYYY-MM') return 'month';
    return 'date';
  });
  const getRealStartTime = computed(() => {
    const format = unref(getFormat);
    if (!props.startTime || format === 'YYYY-MM-DD HH:mm:ss') return props.startTime;
    const startTime = dayjs(props.startTime).startOf(getDateTimeUnit(format)).valueOf();
    return startTime;
  });
  const getRealEndTime = computed(() => {
    const format = unref(getFormat);
    if (!props.endTime || format === 'YYYY-MM-DD HH:mm:ss') return props.endTime;
    const endTime = dayjs(props.endTime).endOf(getDateTimeUnit(format)).valueOf();
    return endTime;
  });
  const getBindValue = computed(() => ({
    placeholder: props.placeholder,
    format: unref(getFormat),
    valueFormat: unref(getFormat),
    showTime: Reflect.has(unref(attrs), 'showTime') ? unref(attrs).showTime : unref(getShowTime),
    disabledDate: (current: Dayjs) => {
      const startTime = unref(getRealStartTime);
      const endTime = unref(getRealEndTime);
      if ((!startTime && !endTime) || !current) return false;
      const currentDate = current.valueOf();
      if (startTime && endTime) return startTime > currentDate || endTime < currentDate;
      if (startTime) return startTime > currentDate;
      if (endTime) return endTime < currentDate;
      return false;
    },
    ...unref(attrs),
  }));

  watch(
    () => props.value,
    val => {
      setValue(val);
    },
    { immediate: true },
  );

  function setValue(value) {
    if (!value || !value.length) return (innerValue.value = undefined);
    // innerValue.value = value.map(o => dayjs(o).format(unref(getFormat)));
    const userTz = unref(getFormat) === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
    innerValue.value = value.map(o => dayjs(o).tz(userTz).format(unref(getFormat)));
  }
  function onChange(date) {
    date = date || [];
    // const timestamp: number[] = date.map(o => dayjs(o).valueOf());
    const userTz = unref(getFormat) === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
    const timestamp: number[] = date.map(o => dayjs.tz(o, userTz).valueOf());

    emit('update:value', timestamp);
    emit('change', timestamp);
  }
</script>
