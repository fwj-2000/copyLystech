<!-- 预测&实际柱状图 -->
<template>
  <div class="w-[100%] h-[100%] px-[6px] py-[3px]">
    <div class="h-[28px] flex justify-start">
      <div v-for="(item, idx) in legendOptions" :key="idx" class="flex ml-[12px]">
        <div class="w-[8px] h-[8px] mr-[8px]" :style="`background-color: ${item.color}`"></div>
        <div>{{ item.label }}</div>
      </div>
    </div>
    <div class="w-[100%] h-[calc(100%-28px)] relative">
      <Chart :options="baseBgOptions" height="100%" style="height: 100%; width: 100%" />
      <div class="absolute top-0 left-0 w-[100%] h-[100%]">
        <div class="w-[100%] h-[100%] pl-[32px] flex">
          <div class="w-[100%] h-[100%] flex justify-around items-start">
            <div class="w-[54px] h-[calc(100%-18px)]">
              <SingleBarChart :data="barChartData" />
            </div>
            <div class="w-[54px] h-[calc(100%-18px)]">
              <SingleBarChart :data="barChartData2" />
            </div>
            <div class="w-[54px] h-[calc(100%-18px)]">
              <SingleBarChart :data="barChartData3" />
            </div>
            <div class="w-[54px] h-[calc(100%-18px)]">
              <SingleBarChart :data="barChartData4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, inject } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { staticBaseBgOptions } from './config';
  import { getPridictBarSeriesData, getPridictAndActualBarSeriesData } from './utils';

  import { Chart } from '/@/components/Chart';
  import SingleBarChart from './SingleBarChart.vue';

  const getInfoData = inject('getInfoData', () => ({}));
  const infoData = getInfoData() as any;
  const baseBgOptions = computed(() => {
    const { weekNum1, weekNum2, weekNum3, weekNum4 } = infoData;
    return merge(cloneDeep(staticBaseBgOptions), {
      xAxis: {
        data: [`WK${weekNum1}`, `WK${weekNum2}`, `WK${weekNum3}`, `WK${weekNum4}`],
      },
    });
  });
  const legendOptions = computed(() => {
    const { weekNum1 } = infoData;
    const current = dayjs().tz().week(Number.parseInt(weekNum1, 10));
    const lastWeek = current.subtract(1, 'week').week();
    return [
      { color: '#C3C3C3', label: `WK${lastWeek}预测` },
      { color: '#64BEFE', label: `WK${weekNum1}预测` },
      { color: '#FFA75A', label: `WK${weekNum1}实际` },
    ];
  });
  const barChartData = computed(() => {
    const { lastWeekPredictQuantity1, currentWeekActualQuantity } = infoData;
    return getPridictAndActualBarSeriesData(lastWeekPredictQuantity1, currentWeekActualQuantity);
  });
  const barChartData2 = computed(() => {
    const { lastWeekPredictQuantity2, currentWeekPredictQuantity1 } = infoData;
    return getPridictBarSeriesData(lastWeekPredictQuantity2, currentWeekPredictQuantity1);
  });
  const barChartData3 = computed(() => {
    const { lastWeekPredictQuantity3, currentWeekPredictQuantity2 } = infoData;
    return getPridictBarSeriesData(lastWeekPredictQuantity3, currentWeekPredictQuantity2);
  });
  const barChartData4 = computed(() => {
    const { lastWeekPredictQuantity4, currentWeekPredictQuantity3 } = infoData;
    return getPridictBarSeriesData(lastWeekPredictQuantity4, currentWeekPredictQuantity3);
  });
</script>
