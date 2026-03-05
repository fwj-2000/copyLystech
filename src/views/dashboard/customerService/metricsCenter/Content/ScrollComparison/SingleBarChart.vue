<!-- 单个柱状图组 -->
<template>
  <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { barChartOptions } from './config';
  import { getCylinderSeriesData } from '/@/views/dashboard/chartSeriesDataConfig';

  import { Chart } from '/@/components/Chart';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const options = computed(() => {
    const seriesData = getCylinderSeriesData({
      barWidth: 14,
      data: props.data,
    });
    return merge(cloneDeep(barChartOptions), {
      series: seriesData,
    });
  });
</script>
