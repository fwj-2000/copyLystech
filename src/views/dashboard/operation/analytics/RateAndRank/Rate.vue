<!-- 同比&环比率 -->
<template>
  <div class="h-[100%]">
    <SpinContent
      v-bind="{
        loading,
        isEmptyData,
        isRequestError,
        showList: false,
      }">
      <Chart :options="options" height="100%" width="100%" class="w-[100%] h-[100%]" />
    </SpinContent>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, inject, computed, Ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { getDatacollectionTrend } from '/@/api/dashbord/report';
  import { baseOption } from './config';
  import { getSeriesBarDataSyle, getSeriesLineDataSyle, getTooltipHtmlStrMth } from '../config';

  import { Chart } from '/@/components/Chart';
  import { EChartsOption } from 'echarts';
  import { IMetricConfig } from '../types';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  interface IProps {
    searchFormValue: Record<string, any>;
    field: string;
    fieldName: string;
    showRank: boolean;
  }
  const props = withDefaults(defineProps<IProps>(), {});
  const getCommonParams = inject('getCommonParams', () => ({}));
  const options = ref<EChartsOption>({});
  const loading = ref<boolean>(true);
  const isEmptyData = ref<boolean>(false);
  const isRequestError = ref<boolean>(false);

  const metricConfig: Ref<IMetricConfig[]> = computed(() => {
    let valueSuffix = '';
    if (props.fieldName.includes('W')) {
      valueSuffix = '万';
    }
    if (props.fieldName.includes('%')) {
      valueSuffix = '%';
    }
    return [
      {
        fieldKey: 'lastValue',
        metric: '23年',
        type: 'bar',
        data: [],
        linearItemColor: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(215, 215, 215, 0.77)',
            },
            {
              offset: 1,
              color: 'rgba(190, 190, 190, 0.1)',
            },
          ],
        },
        suffix: valueSuffix,
        yAxisIndex: 0,
      },
      {
        fieldKey: 'thisValue',
        metric: '24年',
        type: 'bar',
        data: [],
        linearItemColor: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(90, 188, 254, 1)',
            },
            {
              offset: 1,
              color: 'rgba(181, 225, 255, 0.15)',
            },
          ],
        },
        suffix: valueSuffix,
        yAxisIndex: 0,
      },
      {
        fieldKey: 'yoyRatio',
        metric: '同比率',
        type: 'line',
        data: [],
        lineColor: 'rgba(255, 123, 0, 1)',
        itemColor: 'rgba(255, 123, 0, 1)',
        suffix: '%',
        yAxisIndex: 1,
      },
      {
        fieldKey: 'wowRatio',
        metric: '环比率',
        type: 'line',
        data: [],
        lineColor: 'rgba(240, 192, 88, 1)',
        itemColor: 'rgba(240, 192, 88, 1)',
        suffix: '%',
        yAxisIndex: 1,
      },
    ];
  });

  const getDataOption = (dataList: any[]) => {
    const seriesData = metricConfig.value.map(item => {
      return {
        ...item,
        data: dataList.map(record => {
          return Number.parseFloat(record[item?.fieldKey || ''] || 0);
        }),
      };
    });
    // 生成当前指标折线图
    const metricSeries = seriesData.map(item => {
      if (item.type === 'line') {
        const common = getSeriesLineDataSyle(item);
        common['data'] = item.data;
        common['name'] = item.metric;
        common['yAxisIndex'] = item.yAxisIndex;
        return common;
      }
      const common = getSeriesBarDataSyle(item);
      common['data'] = item.data;
      common['name'] = item.metric;
      common['yAxisIndex'] = item.yAxisIndex;
      return common;
    });

    return {
      tooltip: {
        trigger: 'axis',
        formatter: getTooltipHtmlStrMth({ metricName: props.fieldName, seriesData }),
        appendTo: 'body',
      },
      legend: [
        {
          left: '0',
          top: 12,
          data: seriesData.map(item => item.metric),
        },
      ],
      xAxis: {
        data: dataList.map(item => item.dimension),
      },
      series: metricSeries,
    };
  };

  watch(
    [() => props.searchFormValue, () => props.field],
    () => {
      // 重新查询数据
      loading.value = true;
      const params = getCommonParams();
      getDatacollectionTrend({
        ...params,
        field: props.field,
      })
        .then(res => {
          const { data } = res;
          const dataOption = getDataOption(data.list || []);
          // 处理过后填充的数据
          options.value = merge(cloneDeep(baseOption), dataOption);
        })
        .catch(() => {
          isRequestError.value = true;
        })
        .finally(() => {
          loading.value = false;
        });
    },
    { deep: true, immediate: false },
  );
</script>

<style lang="less" scoped>
  :deep(.ant-spin-container) {
    min-height: 0 !important;
  }
</style>
