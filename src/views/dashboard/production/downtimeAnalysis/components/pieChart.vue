
<template>
  <div ref="pieRef" class="left-chart"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { EChartsType } from "echarts"
import * as echarts from "echarts"
import { defineProps, onBeforeUnmount, onMounted } from "vue"
import { debounce } from "/@/utils/debounce"

const { options } = defineProps(['options']);

const pieRef = ref<HTMLDivElement>();
let pieInstance: EChartsType | null = null;

const destroyPieChart = () => {
  pieInstance?.clear();
  pieInstance?.dispose();
  pieInstance = null;
};

const resizeChart = () => {
  destroyPieChart();
  initPieChart();
};


const initPieChart = () => {
  pieInstance = echarts.init(pieRef.value);
  pieInstance.setOption(options);
};

onMounted(() => {
  initPieChart();
  window.addEventListener('resize', debounce(resizeChart, 500));
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', destroyPieChart);
});
</script>

<style lang="less" scoped>
.left-chart {
  //height: 324px;
  height: 389px;
  width: 100%;
  //margin-top: 20px;
}
</style>
