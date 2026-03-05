<!-- 趋势图 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem>
      <template #title>
        <span class="font-bold">FC准确率-整体分布</span>
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
  import { getMetricNameByDimension, getDimensionName, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

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
    fetchApi: getfcaccuracydetailallgraphiclist,
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData).toSorted((a, b) => {
        return a.CurrentNum - b.CurrentNum;
      });
      const xAxisData = dataInfo.map(item => {
        return getMetricNameByDimension({
          dimension: props.searchFormValue.dimension,
          value: item.CurrentNum,
        });
      });
      const lineData = dataInfo.map(item => {
        return item.ChangeRate;
      });
      const barData1 = dataInfo.map(item => {
        return item.PredictionNumQuantity;
      });
      const barData2 = dataInfo.map(item => {
        return item.ActualNumQuantity;
      });
      const lastDimensionName = getDimensionName({
        type: 'last',
        dimension: props.searchFormValue.dimension,
      });
      const currentDimensionName = getDimensionName({
        type: 'current',
        dimension: props.searchFormValue.dimension,
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
            name: `${lastDimensionName}预测`,
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
            name: `${currentDimensionName}需求数量`,
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
