<!-- 指标趋势 -->
<template>
  <div class="bx-shadow p-12px">
    <div class="color-[#1A1A1A] font-bold">指标趋势</div>
    <div class="relative">
      <Chart :options="options" height="284px" width="100%" class="chart-wrapper" />
      <div class="absolute top-0 left-0">{{ lastYear }}年：</div>
      <div class="absolute top-[24px] left-0"> {{ currentYear }}年：</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { baseOption } from './config';
  import { getSeriesLineDataSyle } from '../config';

  import { EChartsOption } from 'echarts';
  import { Chart } from '/@/components/Chart';
  import { IMetricConfig } from '../types';

  interface IProps {
    dataList: any[];
    weekList: string[];
    currentYear: string;
    lastYear: string;
  }
  const props = withDefaults(defineProps<IProps>(), {});

  const options = ref<EChartsOption>({});
  const metricConfig: IMetricConfig[] = [
    {
      metric: '产值',
      data: [],
      lineColor: 'rgba(255, 123, 0, 1)',
      itemColor: 'rgba(255, 123, 0, 1)',
      suffix: '万',
      yAxisIndex: 0,
    },
    {
      metric: 'AOI稼动率',
      data: [],
      lineColor: 'rgba(41, 73, 199, 1)',
      itemColor: 'rgba(41, 73, 199, 1)',
      suffix: '%',
      yAxisIndex: 1,
    },
    {
      metric: '时间稼动率',
      data: [],
      lineColor: 'rgba(9, 157, 231, 1)',
      itemColor: 'rgba(9, 157, 231, 1)',
      suffix: '%',
      yAxisIndex: 1,
    },
    {
      metric: 'DL模切数',
      data: [],
      lineColor: 'rgba(39, 181, 174, 1)',
      itemColor: 'rgba(39, 181, 174, 1) ',
      suffix: '',
      yAxisIndex: 0,
    },
    {
      metric: 'DL手工数',
      data: [],
      lineColor: 'rgba(181, 39, 150, 1)',
      itemColor: 'rgba(181, 39, 150, 1)',
      suffix: '',
      yAxisIndex: 0,
    },
  ];

  const getDataOption = (dataList: any[]) => {
    const thisMetricConfig: IMetricConfig[] = [];
    const lastMetricConfig: IMetricConfig[] = [];
    metricConfig.forEach(item => {
      const { thisyVlist = [], lastyVlist = [] } = dataList.find(({ metric }) => metric.includes(item.metric)) || { thisyVlist: [], lastyVlist: [] };
      thisMetricConfig.push({
        ...item,
        data: thisyVlist.map((item: any) => Number.parseFloat(item.valueS)),
      });
      lastMetricConfig.push({
        ...item,
        lineColor: (item?.lineColor || 'rgba(255, 123, 0, 1)').replace('1)', '0.3)'),
        itemColor: (item?.itemColor || 'rgba(255, 123, 0, 1)').replace('1)', '0.3)'),
        data: lastyVlist.map((item: any) => Number.parseFloat(item.valueS)),
      });
    });
    // 生成当前指标折线图
    const thisMetricSeries = thisMetricConfig.map(item => {
      const common = getSeriesLineDataSyle(item);
      common['data'] = item.data;
      common['name'] = item.metric;
      common['yAxisIndex'] = item.yAxisIndex;
      return common;
    });
    // 生成上期指标折线图
    const lastMetricSeries = lastMetricConfig.map(item => {
      const common = getSeriesLineDataSyle(item);
      common['data'] = item.data;
      common['name'] = `${item.metric}​`; // 注意：这里有一个宽度为0的特殊字符
      common['yAxisIndex'] = item.yAxisIndex;
      return common;
    });

    return {
      legend: [
        {
          left: '54',
          top: 24,
          data: thisMetricConfig.map(item => item.metric),
        },
        {
          left: '54',
          data: lastMetricConfig.map(item => `${item.metric}​`),
        },
      ],
      xAxis: {
        data: props.weekList,
      },
      series: [...thisMetricSeries, ...lastMetricSeries],
    };
  };

  watch(
    () => props.dataList,
    dataList => {
      const dataOption = getDataOption(dataList);
      // 处理过后填充的数据
      options.value = merge(cloneDeep(baseOption), dataOption);
    },
    { deep: true, immediate: false },
  );
</script>

<style lang="less" scoped>
  .bx-shadow {
    box-shadow: 0 -1px 15px 0 rgb(0 0 0 / 5%), 0 6px 15px 0 rgb(0 0 0 / 5%);
  }
</style>
