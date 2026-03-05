<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white p-10px">
      <a-alert
        message="Highcharts组件需要付费购买使用"
        type="warning"
        show-icon
        class="!mb-30px" />
      <Chart :options="options" class="h-500px" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Chart } from 'highcharts-vue';

  defineOptions({ name: 'extend-graphDemo-highchartsArea' });

  const options = reactive({
    accessibility: { enabled: false },
    chart: {
      type: 'area',
    },
    title: {
      text: '包含负值的面积图',
    },
    xAxis: {
      categories: ['苹果', '橘子', '梨', '葡萄', '香蕉'],
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: '小张',
        data: [5, 3, 4, 7, 2],
      },
      {
        name: '小彭',
        data: [2, -2, -3, 2, 1],
      },
      {
        name: '小潘',
        data: [3, 4, 4, -2, 5],
      },
    ],
  });
</script>
