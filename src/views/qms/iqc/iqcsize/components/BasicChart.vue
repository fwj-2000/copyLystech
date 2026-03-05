<template>
  <Chart ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { basicOptions } from './chartConfig ';
  interface IProps {
    data: any[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
  });
  const chartOptions = ref<any>({});
  const chartRef = ref<HTMLElement>();

  onMounted(() => {
    // const _mockxAxisData = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
    // const keys = props.data.map(item => item.key);
    // const xAxisData = keys.length ? keys : _mockxAxisData;
    // const yAxisData = props.data.map(item => item.value);

    const xAxisData = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
    const yAxisData = [33, 45, 98, 75, 88, 36, 66, 59];
    chartOptions.value = basicOptions({ xAxisData, yAxisData, dom: chartRef.value });
  });
  // const xAxisData = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
  // const yAxisData = [33, 45, 98, 75, 88, 36, 66, 59];
  // const chartOptions = todayActivationOptions({ xAxisData, yAxisData });
</script>

<style lang="less" scoped>
  .chart-wrapper {
    height: 100%;
  }
</style>
