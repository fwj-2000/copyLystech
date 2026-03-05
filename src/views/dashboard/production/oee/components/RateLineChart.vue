<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white p-10px">
      <Chart :options="options" height="300px" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Chart } from '/@/components/Chart';

  defineOptions({ name: 'RateLineChart' });
  const props = defineProps(['name'])

  const options = reactive({
    title: {
      text: props.name,
      left: 0,
      subtext: '签约演示图',
    },
    grid: { left: 0, right: '10%', top: '20%', bottom: 50, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          width: 1,
          color: '#019680',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [...new Array(6)].map((_item, index) => `2024WK${index + 14}`),
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: 'rgba(226,226,226,0.5)',
        },
      },
      axisTick: {
        show: false,
      },
      min: 0, // x轴起始位置
      axisLine: {
        lineStyle: {
          color: '#666',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value} %',
        },
        splitNumber: 5,
        axisTick: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', '#fff'],
          },
        },
        axisLine: {
          lineStyle: {
            color: '#666',
          },
        },
      },
    ],
    series: [
      {
        smooth: true,
        data: [33, 45, 58, 75, 88, 76, 66, 59],
        type: 'line',
        areaStyle: {},
        itemStyle: {
          color: '#ff7b00',
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider'
      },
      {
        type: 'inside'
      }
    ],
  });

</script>
