<!-- 趋势图 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem>
      <template #title>
        <span class="font-bold">FC滚动对比-4周FC量滚动整体情况</span>
      </template>
      <MetricContent @register="register">
        <div class="w-[100%] h-[100%]">
          <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
        </div>
      </MetricContent>
    </MetricItem>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { trendChartOptions } from './config';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcaccuracydetailallgraphiclist } from '/@/api/dashbord/fc';

  import { Chart } from '/@/components/Chart';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';

  defineOptions({ name: 'dashboard-customerService-accuracy-trend' });

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
  const options = ref<any>(trendChartOptions);
  const [register] = useMetricContent({
    componentProps: props,
    getParams: commonParams => {
      return {
        ...commonParams,
        dimension: 'week',
      };
    },
    fetchApi: getfcaccuracydetailallgraphiclist,
    afterFetch: resData => {
      const orderList = resData.toSorted((a, b) => {
        return Number.parseInt(a.CurrentWeekNum, 10) - Number.parseInt(b.CurrentWeekNum, 10);
      });
      const xAxisData = orderList.map(item => {
        return `WK${item.CurrentWeekNum}`;
      });
      const lineData = orderList.map(item => {
        return item.ChangeRate;
      });
      const barData1 = orderList.map(item => {
        return Number.parseInt(item.PredictionWeekNumQuantity, 10);
      });
      const barData2 = orderList.map(item => {
        return Number.parseInt(item.ActualWeekNumQuantity, 10);
      });
      options.value = merge(cloneDeep(trendChartOptions), {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            type: 'line',
            name: '准确率',
            smooth: true,
            selected: false,
            lineStyle: {
              color: '#FF7B00',
              shadowColor: 'rgba(0, 0, 0, 0.25)',
              shadowBlur: 4,
              shadowOffsetY: 4,
            }, // 添加阴影区域
            data: lineData,
            label: {
              show: true,
              formatter: '{c}%',
            },
            symbolSize: 8,
            yAxisIndex: 1,
            itemStyle: {
              color: '#FF6347', // 数据点的颜色
            },
          },
          {
            type: 'bar',
            name: '上周预测',
            yAxisIndex: 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#CDCDCD',
                  },
                  {
                    offset: 1,
                    color: 'rgba(238, 238, 238, 0.74)',
                  },
                ],
              },
              borderRadius: [50, 50, 0, 0],
            },
            data: barData1,
          },
          {
            type: 'bar',
            yAxisIndex: 0,
            name: '当周需求数量',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(57, 105, 216, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(201, 216, 252, 0.1)',
                  },
                ],
              },
              borderRadius: [50, 50, 0, 0],
            },
            data: barData2,
          },
        ],
      });
    },
  });
</script>
