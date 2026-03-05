<!-- 预测&实际柱状图 -->
<template>
  <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { getBarChartOptions } from './config';

  import { Chart } from '/@/components/Chart';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const options = computed(() => {
    const barChartData = props.data.map(item => item.value);
    const barChartName = props.data.map(item => item.name);
    const barChartOptions = getBarChartOptions(barChartData);
    return merge(cloneDeep(barChartOptions), {
      xAxis: {
        data: barChartName,
      },
    });
  });
</script>
