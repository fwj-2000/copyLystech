<template>
  <div ref="chartRef" class="left-chart"></div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref, defineProps } from 'vue';
  import { EChartsType } from 'echarts';
  import * as echarts from 'echarts';
  import { debounce } from '/@/utils/debounce';

  const { options } = defineProps(['options']);

  const chartRef = ref<HTMLDivElement>();
  let chartInstance: EChartsType | null = null;

  const destroyChart = () => {
    chartInstance?.clear();
    chartInstance?.dispose();
    chartInstance = null;
  };

  const resizeChart = () => {
    destroyChart();
    initChart();
  };

  const initChart = () => {
    console.log(chartRef.value);
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(options, true);
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', debounce(resizeChart, 500));
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', destroyChart);
  });
</script>

<style lang="less" scoped>
  .left-chart {
    height: 324px;
    width: 100%;
    margin-top: 20px;
  }
</style>
