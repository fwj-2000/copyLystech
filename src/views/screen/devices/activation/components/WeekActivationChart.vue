<template>
  <Chart ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { todayActivationOptions } from '../config';
  import { Chart } from '/@/components/Chart';

  interface IProps {
    data: any[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
  });
  const chartOptions = ref<any>({});
  watch(
    () => props.data,
    () => {
      init();
    },
  );
  function init() {
    const xAxisData = props.data.map(item => item.key);
    const yAxisData = props.data.map(item => item.value);
    chartOptions.value = todayActivationOptions({ xAxisData, yAxisData });
  }
  onMounted(() => {
    init();
  });
</script>
