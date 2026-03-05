<!-- 趋势图 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem>
      <template #title>
        <span class="font-bold">厂区-数量</span>
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
  import { cloneDeep, merge, isEmpty } from 'lodash-es';
  import { trendChartOptions } from './config';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcpricequantitygraphicdetaillists } from '/@/api/dashbord/fc';
  import { getMetricNameByDimension, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

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
    fetchApi: getfcpricequantitygraphicdetaillists,
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      const amountList = Object.values(dataInfo.FactoryCount) as any;
      if (isEmpty(amountList)) {
        throw new Error('FactoryPrice is empty');
      }
      const xAxisData = amountList.map(item => {
        return item.FactoryName;
      });
      const lineData = amountList.map(item => {
        return Number.parseFloat(item.ChangeRateCount * 100);
      });
      const barData1 = amountList.map(item => {
        return item.LastQuantityCount;
      });
      const barData2 = amountList.map(item => {
        return item.CurrentQuantityCount;
      });
      const lastMerticName = getMetricNameByDimension({
        dimension: props.searchFormValue.dimension,
        value: dataInfo.LastNum,
      });
      const currentMerticName = getMetricNameByDimension({
        dimension: props.searchFormValue.dimension,
        value: dataInfo.CurrentNum,
      });
      options.value = merge(cloneDeep(trendChartOptions), {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            type: 'line',
            name: '变化率',
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
            name: `${lastMerticName}余量`,
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
            name: `${currentMerticName}余量`,
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
