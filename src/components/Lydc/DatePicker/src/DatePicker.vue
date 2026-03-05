<template>
  <Tooltip :title="showTooltip ? props.tooltip : ''" placement="top">
    <DatePicker v-bind="getBindValue" v-model:value="innerValue" :picker="getPicker" @change="onChange" />
  </Tooltip>
</template>

<script lang="ts" setup>
  import { Tooltip, DatePicker } from 'ant-design-vue';

  import dayjs, { Dayjs } from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import timezone from 'dayjs/plugin/timezone';
  import { useLocale } from '/@/locales/useLocale';
  import { computed, ref, unref, watch } from 'vue';
  import { datePickerProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { getDateTimeUnit, getDateFormat } from '/@/utils/lydc';
  const { getTimeZone } = useLocale();
  // 添加时区插件
  dayjs.extend(utc);
  dayjs.extend(timezone);

  defineOptions({ name: 'LydcDatePicker', inheritAttrs: false });
  const props = defineProps(datePickerProps);
  const emit = defineEmits(['update:value', 'change']);
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const innerValue = ref('');

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
  const getBindValue = computed(() => {
    const bindValue = {
      ...unref(attrs),
      format: unref(getFormat),
      valueFormat: unref(getFormat),
      showTime: unref(getShowTime),
      showToday: !props.startTime && !props.endTime,
      showNow: !props.startTime && !props.endTime,
      disabledDate: (current: Dayjs) => {
        const startTime = unref(getRealStartTime);
        const endTime = unref(getRealEndTime);
        if ((!startTime && !endTime) || !current) return false;
        const currentDate = current.startOf(getDateTimeUnit(unref(getFormat))).valueOf();
        if (startTime && endTime) return startTime > currentDate || endTime < currentDate;
        if (startTime) return startTime > currentDate;
        if (endTime) return endTime < currentDate;
        return false;
      },
      disabledTime: (current: Dayjs) => ({
        disabledHours: () => {
          const startTime = unref(getRealStartTime);
          const endTime = unref(getRealEndTime);
          if ((!startTime && !endTime) || !current) return [];
          const hours: number[] = [];
          if (startTime && current.format('YYYY-MM-DD') === dayjs(startTime).format('YYYY-MM-DD')) {
            const startHour = dayjs(startTime).hour();
            for (let i = 0; i < startHour; i++) {
              hours.push(i);
            }
          }
          if (endTime && current.format('YYYY-MM-DD') === dayjs(endTime).format('YYYY-MM-DD')) {
            const endHour = dayjs(endTime).hour();
            for (let i = 0; i < 24; i++) {
              if (i > endHour) hours.push(i);
            }
          }
          return hours;
        },
        disabledMinutes: selectedHour => {
          const startTime = unref(getRealStartTime);
          const endTime = unref(getRealEndTime);
          if ((!startTime && !endTime) || !current) return [];
          const minutes: number[] = [];
          if (startTime && current.format('YYYY-MM-DD') === dayjs(startTime).format('YYYY-MM-DD')) {
            const startHour = dayjs(startTime).hour();
            const startMinute = dayjs(startTime).minute();
            if (selectedHour < startHour) {
              for (let i = 0; i < 60; i++) {
                minutes.push(i);
              }
              return minutes;
            }
            if (selectedHour === startHour) {
              for (let i = 0; i < startMinute; i++) {
                minutes.push(i);
              }
            }
          }
          if (endTime && current.format('YYYY-MM-DD') === dayjs(endTime).format('YYYY-MM-DD')) {
            const endHour = dayjs(endTime).hour();
            const endMinute = dayjs(endTime).minute();
            if (selectedHour === endHour) {
              for (let i = 0; i < 60; i++) {
                if (i > endMinute) minutes.push(i);
              }
              return minutes;
            }
            if (selectedHour > endHour) {
              for (let i = 0; i < 60; i++) {
                minutes.push(i);
              }
              return minutes;
            }
          }
          return minutes;
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const startTime = unref(getRealStartTime);
          const endTime = unref(getRealEndTime);
          if ((!startTime && !endTime) || !current || unref(getFormat) === 'YYYY-MM-DD HH:mm') return [];
          const seconds: number[] = [];
          const selectedHourMinute = padZero(selectedHour) + padZero(selectedMinute);
          if (startTime && current.format('YYYY-MM-DD') === dayjs(startTime).format('YYYY-MM-DD')) {
            const startHourMinute = padZero(dayjs(startTime).hour()) + padZero(dayjs(startTime).minute());
            const startSecond = dayjs(startTime).second();
            if (selectedHourMinute < startHourMinute) {
              for (let i = 0; i < 60; i++) {
                seconds.push(i);
              }
              return seconds;
            }
            if (selectedHourMinute === startHourMinute) {
              for (let i = 0; i < startSecond; i++) {
                seconds.push(i);
              }
            }
          }
          if (endTime && current.format('YYYY-MM-DD') === dayjs(endTime).format('YYYY-MM-DD')) {
            const endHourMinute = padZero(dayjs(endTime).hour()) + padZero(dayjs(endTime).minute());
            const endSecond = dayjs(endTime).second();
            if (selectedHourMinute === endHourMinute) {
              for (let i = 0; i < 60; i++) {
                if (i > endSecond) seconds.push(i);
              }
              return seconds;
            }
            if (selectedHourMinute > endHourMinute) {
              for (let i = 0; i < 60; i++) {
                seconds.push(i);
              }
              return seconds;
            }
          }
          return seconds;
        },
      }),
    };
    if (Reflect.has(unref(attrs), 'disabledDate')) bindValue.disabledDate = unref(attrs).disabledDate;
    if (Reflect.has(unref(attrs), 'disabledTime')) bindValue.disabledTime = unref(attrs).disabledTime;
    return bindValue;
  });

  watch(
    () => props.value,
    val => {
      setValue(val);
    },
    { immediate: true },
  );
  watch(
    () => unref(getFormat),
    () => {
      setValue(props.value);
    },
  );

  function setValue(value) {
    // innerValue.value = value ? dayjs(Number(value)).format(unref(getFormat)) : '';
    const userTz = unref(getFormat) === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
    const time = value && isTimestamp(value) ? Number(value) : value;
    innerValue.value = value ? dayjs(time).tz(userTz).format(unref(getFormat)) : '';
  }
  function onChange(date) {
    console.log('onChange-date', date);
    // const timestamp = date ? dayjs(date).valueOf() : null;
    const userTz = unref(getFormat) === 'YYYY-MM-DD' ? 'Asia/Shanghai' : unref(getTimeZone);
    const timestamp = date ? dayjs.tz(date, userTz).valueOf() : null;

    emit('update:value', timestamp);
    emit('change', timestamp);
  }
  function padZero(str) {
    return new RegExp(/^\d$/g).test(str) ? `0${str}` : str.toString();
  }

  /**
   * 判断输入是否为有效时间戳（仅支持13位毫秒级正时间戳）
   * @param time 输入值（number或纯数字字符串）
   */
  function isTimestamp(time: unknown): time is number | string {
    // 类型检查
    if (typeof time !== 'number' && typeof time !== 'string') return false;

    // 字符串校验
    if (typeof time === 'string') {
      // 必须为13位纯数字
      if (!/^\d{13}$/.test(time)) return false;
    }

    // 转换为数值
    const numericValue = typeof time === 'string' ? Number(time) : time;

    // 数值有效性检查
    if (Number.isNaN(numericValue)) return false;

    // 时间戳范围检查（0 ~ 8640000000000000）
    return numericValue >= 0 && numericValue <= 8640000000000000;
  }
</script>
