<template>
  <div class="chart-container">
    <Chart ref="chartRef" height="100%" width="100%" id="chart-wrapper" />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch, unref, onUnmounted } from 'vue';
  import { timeActivationOptions } from '../config';
  import { Chart } from '/@/components/Chart';

  interface IProps {
    data: any[];
  }
  const emits = defineEmits(['onTimeActivationClick']);
  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
  });
  const chartRef = ref<any>();
  const chartOptions = ref<any>({});
  const chartInstance = ref<any>(null);
  watch(
    () => props.data,
    () => {
      init();
    },
  );

  function init() {
    const chartDom = document.getElementById('chart-wrapper');
    if (!chartDom) return;
    // 如果已经存在图表实例，先销毁它
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }

    const xAxisData = props.data.map(item => item.key);
    const yAxisData = props.data.map(item => item.value);
    chartInstance.value = timeActivationOptions(
      chartDom,
      { xAxisData, yAxisData },
      {
        onClick: e => {
          emits('onTimeActivationClick', e);
        },
      },
    );
    // 监听窗口大小变化，自动调整图表大小
    window.addEventListener('resize', () => {
      chartInstance.value.resize();
    });
  }

  function clearChartSelect() {
    if (chartInstance.value) {
      chartInstance.value.dispatchAction({
        type: 'unselect',
      });
    }
  }

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', chartInstance.value.resize);
  });

  defineExpose({
    clearChartSelect,
  });
</script>

<style lang="less" scoped>
  .chart-container,
  #chart-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
