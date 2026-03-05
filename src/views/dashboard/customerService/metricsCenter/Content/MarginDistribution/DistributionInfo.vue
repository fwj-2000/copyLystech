<!-- 余量信息 -->
<template>
  <span class="w-[45%] text-ellipsis">
    <span>{{ lastMetricTitle }}</span>
    <a-tooltip placement="topLeft" color="orange" class="font-bold">
      <template #title>
        <span>{{ lastThousandsFormatValue }}</span>
      </template>
      {{ lastThousandsFormatValue }}
    </a-tooltip>
  </span>
  <span class="w-[45%] text-ellipsis">
    <span>{{ currentMetricTitle }}</span>
    <a-tooltip placement="topLeft" color="orange" class="font-bold">
      <template #title>
        <span>{{ currentThousandsFormatValue }}</span>
      </template>
      {{ currentThousandsFormatValue }}
    </a-tooltip>
  </span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { thousandsFormat } from '/@/utils/lydc';
  import { getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import { ETimeDimension } from '/@/views/dashboard/customerService/types';

  interface IInfo {
    lastNum: number;
    lastValue: number;
    currentNum: number;
    currentValue: number;
  }
  const props = defineProps({
    info: {
      type: Object as PropType<IInfo>,
    },
    dimension: {
      type: String as PropType<ETimeDimension>,
      default: ETimeDimension.WEEK,
    },
  });

  const lastThousandsFormatValue = computed(() => {
    return thousandsFormat(props.info?.lastValue);
  });
  const currentThousandsFormatValue = computed(() => {
    return thousandsFormat(props.info?.currentValue);
  });
  const currentMetricTitle = computed(() => {
    const metricName = getMetricNameByDimension({
      dimension: props.dimension,
      value: props.info?.currentNum ?? 0,
    });
    return `${metricName}余量：`;
  });
  const lastMetricTitle = computed(() => {
    const metricName = getMetricNameByDimension({
      dimension: props.dimension,
      value: props.info?.lastNum ?? 0,
    });
    return `${metricName}余量：`;
  });
</script>
