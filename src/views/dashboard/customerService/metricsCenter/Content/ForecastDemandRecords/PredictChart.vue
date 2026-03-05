<!-- 预测图表 -->
<template>
  <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import { getBarChartOptions } from './config';

  import { Chart } from '/@/components/Chart';
  import { isEmpty } from 'lodash-es';

  const props = defineProps({
    infoData: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  });
  const options = computed(() => {
    if (isEmpty(props.infoData)) return;
    const sortData = props.infoData.sort((a, b) => a.WeekNum - b.WeekNum);
    const lastData = sortData.map(item => Number.parseInt(item.LastWeekPredictQuantity ?? 0, 10));
    const currentData = sortData.map(item => Number.parseInt(item.CurrentWeekQuantity ?? 0, 10));
    const xAxisData = sortData.map(item => `WK${item.WeekNum}`);
    const currentWeekNum = dayjs().tz().week();
    const dataZoomStart = Math.floor((currentWeekNum / sortData.length) * sortData.length) - 6; // 缩放开始位置
    const dataZoomEnd = dataZoomStart + 12; // 缩放结束位置
    return getBarChartOptions({
      dataList: [lastData, currentData],
      legends: ['预测需求记录', '实际出货'],
      options: {
        xAxis: {
          data: xAxisData,
        },
        dataZoom: {
          startValue: dataZoomStart,
          endValue: dataZoomEnd,
        },
      },
    });
  });
</script>
