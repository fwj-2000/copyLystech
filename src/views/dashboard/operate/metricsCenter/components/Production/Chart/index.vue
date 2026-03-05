<!-- 产销图表 -->
<template>
  <div class="compo-container flex gap-12px">
    <!-- 产值 -->
    <div class="w-[30%] h-[100%]">
      <LineChart :options="options" :monthOptions="monthOptions" />
    </div>
    <div class="split-line"></div>
    <!-- 出货 -->
    <div class="w-[30%] h-[100%]">
      <LineChart :options="options2" :monthOptions="monthOptions2" />
    </div>
    <div class="split-line"></div>
    <!-- 产销率 -->
    <div class="w-[30%] h-[100%]">
      <LineChart :options="options3" :monthOptions="monthOptions3" />
    </div>
    <div class="split-line"></div>
    <div class="summary-chart w-[9%] h-[100%] pt-8px px-6px flex flex-col justify-between items-start">
      <div class="font-bold text-[14px]">年度CUM</div>
      <div class="w-[100%] h-[100%] flex-1">
        <!-- 产值 -->
        <div class="w-[100%] h-[50%] flex flex-col">
          <div class="w-[70%] flex">
            <ProcessSvg v-if="props.info.year.outputValue" :rate="getRateValue(props.info.year.outputValue)" :colorId="EColorId.chanzhi" class="w-[100%]" />
          </div>
          <div>产值</div>
        </div>
        <div class="split-line-v"></div>
        <!-- 出货 -->
        <div class="w-[100%] h-[50%] flex flex-col">
          <div class="w-[70%] flex">
            <ProcessSvg v-if="props.info.year.shipment" :rate="getRateValue(props.info.year.shipment)" :colorId="EColorId.chuhuo" class="w-[100%]" />
          </div>
          <div>出货</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep, merge, flatten } from 'lodash-es';
  import { chartOptions, getLineSeriiesOptions, chanzhiListConfig, chanxiaolvListConfig, chuhuoListConfig, EColorId } from './config';

  import type { EChartsOption } from 'echarts';
  import ProcessSvg from './ProcessSvg.vue';
  import LineChart from './LineChart.vue';

  const props = defineProps<{
    info: any;
    listData?: any;
    queryInfo: any;
  }>();

  const options = ref<EChartsOption>({});
  const monthOptions = ref<EChartsOption>({});
  const options2 = ref<EChartsOption>({});
  const monthOptions2 = ref<EChartsOption>({});
  const options3 = ref<EChartsOption>({});
  const monthOptions3 = ref<EChartsOption>({});
  // 初始化产值的图表
  const getRateValue = value => {
    return (value || 0).toFixed(1);
  };
  const getChartOptions = ({ title = '', xAxisData, suffix = '', infoData = [], metricKeyList, isMonth = false }) => {
    const seriesData = flatten(
      infoData.map(item => {
        return metricKeyList
          .map(key => item[key.key])
          .filter(value => value !== undefined)
          .map(value => Number.parseFloat(value));
      }),
    );
    return merge(cloneDeep(chartOptions), {
      title: {
        show: isMonth,
        text: title,
      },
      grid: isMonth
        ? {}
        : {
            top: 24,
          },
      legend: {
        show: isMonth,
        data: metricKeyList.map(item => item.name),
      },
      xAxis: {
        data: xAxisData,
      },
      yAxis: {
        min: Math.min(...seriesData),
        max: Math.max(...seriesData),
        axisLabel: {
          formatter: `{value}${suffix}`,
        },
      },
      series: metricKeyList.map(item => getLineSeriiesOptions(item, infoData)),
    });
  };

  const formatValue = value => {
    if (value === undefined) return 0;
    return Number.parseFloat((value / 100).toFixed(1));
  };

  const initWeekChart = () => {
    const { week } = props.info;
    const infoData = week
      .sort((a, b) => {
        return Number.parseInt(a.TimeDate.replace('WK', ''), 10) - Number.parseInt(b.TimeDate.replace('WK', ''), 10);
      })
      .map(item => {
        if (props.queryInfo.orgCode === 'MQ') {
          return {
            ...item,
            SjChfValue: formatValue(item.SjChfValue),
            SjCzfValue: formatValue(item.SjCzfValue),
            YcChfValue: formatValue(item.YcChfValue),
            YcCzfValue: formatValue(item.YcCzfValue),
          };
        }
        return item;
      });
    const unit = props.queryInfo.orgCode === 'MQ' ? '百万元' : '万元';
    const xAxisData = infoData.map(item => item.TimeDate.substr(4));
    options.value = getChartOptions({
      title: `产值(${unit})`,
      xAxisData,
      infoData,
      metricKeyList: chanzhiListConfig,
    });

    options2.value = getChartOptions({
      title: `出货(${unit})`,
      xAxisData,
      infoData,
      metricKeyList: chuhuoListConfig,
    });

    options3.value = getChartOptions({
      title: '产销率(%)',
      xAxisData,
      infoData,
      suffix: '%',
      metricKeyList: chanxiaolvListConfig,
    });
  };
  const initMonthChart = () => {
    const { month } = props.info;
    const infoData = month
      .sort((a, b) => {
        return Number.parseInt(a.TimeDate.replace('-', ''), 10) - Number.parseInt(b.TimeDate.replace('-', ''), 10);
      })
      .map(item => {
        if (props.queryInfo.orgCode === 'MQ') {
          return {
            ...item,
            SjChfValue: formatValue(item.SjChfValue),
            SjCzfValue: formatValue(item.SjCzfValue),
            YcChfValue: formatValue(item.YcChfValue),
            YcCzfValue: formatValue(item.YcCzfValue),
          };
        }
        return item;
      });
    const unit = props.queryInfo.orgCode === 'MQ' ? '百万元' : '万元';

    const xAxisData = infoData.map(item => `${item.TimeDate.slice(5)}月`);
    monthOptions.value = getChartOptions({
      title: `产值(${unit})`,
      xAxisData,
      infoData,
      metricKeyList: chanzhiListConfig,
      isMonth: true,
    });
    monthOptions2.value = getChartOptions({
      title: `出货(${unit})`,
      xAxisData,
      infoData,
      metricKeyList: chuhuoListConfig,
      isMonth: true,
    });
    monthOptions3.value = getChartOptions({
      title: '产销率(%)',
      xAxisData,
      infoData,
      suffix: '%',
      metricKeyList: chanxiaolvListConfig,
      isMonth: true,
    });
  };

  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      initWeekChart();
      initMonthChart();
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .compo-container {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    overflow: hidden;
  }

  .summary-chart {
    border-radius: 2px;
    border: 1px solid #fdfdfd;
    background: linear-gradient(180deg, #e9eeff 2.17%, #fff 100%);
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);
  }

  .split-line {
    height: 100%;
    width: 1px;
    background: linear-gradient(180deg, rgb(255 255 255 / 0%) -34.75%, #e6e6e6 56.04%, rgb(255 255 255 / 0%) 147.46%);
  }

  .split-line-v {
    height: 1px;
    width: 80%;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) -34.75%, #e6e6e6 56.04%, rgb(255 255 255 / 0%) 147.46%);
  }

  .legend-wrapper {
    width: 90%;

    .item-wrapper {
      width: 100%;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .content {
      width: 100%;
      padding: 4px 12px;
      background-color: #f2f2f2;
      border-radius: 6px;
      overflow: hidden;

      .legend-item {
        font-size: 12px;

        .legend {
          display: inline-block;
          width: 8px;
          height: 8px;
        }
      }
    }

    .title {
      color: #666;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  .right-img {
    width: 98px;
    height: 223px;

    & > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
