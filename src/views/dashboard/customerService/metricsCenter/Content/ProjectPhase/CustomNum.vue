<!-- 客服&客户数 -->
<template>
  <MetricContent @register="register">
    <div class="w-[100%] h-[100%] p-2">
      <div class="w-[100%] h-[28px] flex justify-start gap-row-4">
        <div class="flex">
          <div class="w-[8px] h-[8px] bg-[rgba(90,188,254,1)]"></div>
          <span class="ml-1">客服数</span>
        </div>
        <div class="flex">
          <div class="w-[8px] h-[8px] bg-[rgba(75,123,236,1)]"></div>
          <span class="ml-1">客户数</span>
        </div>
      </div>
      <div class="w-[100%] h-[calc(100%-28px)]">
        <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
      </div>
    </div>
  </MetricContent>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { cloneDeep, merge } from 'lodash-es';
  import { getfccustomerandcustomelist } from '/@/api/dashbord/fc';
  import { barChartOptions, selfSeriesOption } from './config';
  import { getMetricNameByDimension, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import { Chart } from '/@/components/Chart';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import { getSpecialBarData01 } from '/@/views/dashboard/chartSeriesDataConfig';

  const props = defineProps({
    searchFormValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
  });

  const options = ref<echarts.EChartsOption>(barChartOptions);

  const [register, { fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfccustomerandcustomelist,
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      const lastCustomeCount = dataInfo?.LastCustomeCount ?? '';
      const lastClientCount = dataInfo?.LastClientCount ?? '';
      const currentCustomeCount = dataInfo?.CurrentCustomeCount ?? '';
      const currentClientCount = dataInfo?.CurrentClientCount ?? '';
      const { dimension } = props.searchFormValue;
      const lastMetricName = getMetricNameByDimension({
        dimension,
        value: dataInfo?.Last,
      });
      const currentMetricName = getMetricNameByDimension({
        dimension,
        value: dataInfo?.Current,
      });
      const xAxisData = [lastMetricName, currentMetricName];
      const lastSeriesData = getSpecialBarData01({
        data: [lastCustomeCount, currentCustomeCount],
        selfSeriesOption: {
          name: '客服数',
          ...selfSeriesOption,
        },
      });
      const currentSeriesData = getSpecialBarData01({
        data: [lastClientCount, currentClientCount],
        markPointColor: 'rgba(75, 123, 236, 1)',
        color: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: 'rgba(75, 123, 236, 1)',
            },
            {
              offset: 0,
              color: 'rgba(199, 215, 255, 0.15)',
            },
          ],
        },
        selfSeriesOption: {
          name: '客户数',
          ...selfSeriesOption,
        },
      });
      options.value = merge(cloneDeep(barChartOptions), {
        xAxis: {
          data: xAxisData,
        },
        series: [lastSeriesData, currentSeriesData],
      });
    },
  });
  defineExpose({
    fetchData,
  });
</script>

<style scoped>
  /* Add your styles here */
</style>
