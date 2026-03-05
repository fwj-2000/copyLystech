<template>
  <div ref="categoryRef" class="right-chart"></div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref, defineProps } from 'vue';
  import { EChartsType } from 'echarts';
  import * as echarts from 'echarts';
  import { debounce } from '/@/utils/debounce';

  const { options } = defineProps(['options']);

  let categoryInstance: EChartsType | null = null;
  const categoryRef = ref<HTMLDivElement>();

  const destroyCategoryChart = () => {
    categoryInstance?.clear();
    categoryInstance?.dispose();
    categoryInstance = null;
  };

  const initCategoryChart = () => {
    categoryInstance = echarts.init(categoryRef.value);
    categoryInstance.setOption(options);
  };
  const resizeChart = () => {
    destroyCategoryChart();
    initCategoryChart();
  };
  const initChart = () => {
    categoryInstance = echarts.init(categoryRef.value);
    categoryInstance.setOption(options);
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', debounce(resizeChart, 500));
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', destroyCategoryChart);
  });
</script>

<style lang="less" scoped>
  .right-chart {
    width: 100%;
    height: 389px;
  }
</style>
