<template>
  <a-input-group compact>
    <a-date-picker
      :value="monthValue"
      :style="`width: ${isSelectedMonth ? '60%' : '100%'};border-radius: 4px ${isSelectedMonth ? '0' : '4px'} ${isSelectedMonth ? '0' : '4px'} 4px !important;`"
      picker="month"
      :disabled="props.disabled"
      :placeholder="t('dict.SalesForecast.selectWeekMonth')"
      @change="handleChangeMonth" />
    <a-select
      v-if="isSelectedMonth"
      :value="weekValue"
      :options="weekOptions"
      :placeholder="t('dict.SalesForecast.selectWeek')"
      :disabled="props.disabled"
      style="width: 40%; border-right-width: 0; border-radius: 0 4px 4px 0 !important"
      @change="handleChangWeek" />
  </a-input-group>
</template>

<script lang="ts" setup>
  import type { Dayjs } from 'dayjs';

  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emits = defineEmits(['update:value']);
  const { t } = useI18n();

  const props = defineProps({
    /**
     * @description 周选择自定义组件，`value`值的格式为`年-月-WK${当前月第几周}`，如2025年1月第一周 `2025-01-WK1`
     * @type {string}
     * @default ''
     */
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const monthValue = computed(() => {
    const [year, month] = props.value.split('-');
    return year && month ? dayjs(`${year}-${month}`, 'YYYY-MM').tz() : '';
  });

  const isSelectedMonth = computed(() => {
    return Boolean(monthValue.value);
  });

  function handleChangeMonth(date: Dayjs | null) {
    emits('update:value', date ? date.format('YYYY-MM') : '');
  }

  const weekValue = computed(() => {
    const [_year, _month, week] = props.value.split('-');
    return week || '';
  });

  const weekOptions = computed(() => {
    const [_year, month] = props.value.split('-');
    if (!month) {
      return [];
    }
    // 判断当前月份是否为每个季度的第一个月份[1, 4, 7, 10]，季度第一个月份分为5周，其他月份分为4周
    const isFirstMonth = [1, 4, 7, 10].includes(Number(month));
    return Array.from({ length: isFirstMonth ? 5 : 4 }, (_, index) => {
      const week = `WK${index + 1}`;
      return {
        label: week,
        value: week,
      };
    });
  });

  function handleChangWeek(value: string) {
    emits('update:value', `${monthValue.value ? monthValue.value.format('YYYY-MM') : ''}-${value}`);
  }
</script>

<style scoped lang="less">
  :deep(div.ant-select-selector) {
    border-radius: 0 4px 4px 0 !important;
  }
</style>
