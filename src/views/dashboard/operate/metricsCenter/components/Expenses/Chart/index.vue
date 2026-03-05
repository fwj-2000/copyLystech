<!-- 費用图表 -->
<template>
  <div class="compo-container flex gap-12px">
    <div class="w-[40%] h-[100%] center flex-col">
      <div class="w-[100%] h-[70%] center">
        <SvgProcess
          style="width: 100%; height: 100%"
          class="mt-[-4px] mb-4px"
          v-bind="{
            proportion: props.info.proportion,
            orgCode: props.info.OrgCode,
          }" />
      </div>
      <!-- 图例 -->
      <div class="w-[100%] h-[30%] flex-1 flex column">
        <div class="w-[100%] h-[100%] flex all-center flex-col bg-[#f2f2f2] rounded-4px">
          <span class="font-bold text-16px"> {{ thousandsFormat((props.info.amount / 10000).toFixed(0)) }}万 </span>
          <span class="text-[#333] mt-4px flex">
            <div class="w-[8px] h-[8px] bg-[#46affb] mr-4px"></div>
            <span>费用金额</span>
          </span>
        </div>
      </div>
    </div>
    <!-- 柱狀圖 -->
    <div class="w-[100%] h-[100%] flex-1">
      <Chart ref="chartRef" :options="options" height="100%" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, watch, onMounted, inject } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions, getPictorialBarSeriesOptions, IMetricKeyListConfig } from './config';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

  import SvgProcess from './SvgProcess.vue';
  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';
  import { thousandsFormat } from '/@/utils/lydc';

  interface ChartInstance extends InstanceType<typeof Chart> {}

  const props = defineProps<{
    info: any;
    listData?: any;
  }>();

  const chartRef = ref<ChartInstance | null>(null);
  const { goPath } = useRouteParams();
  const getSearchFormValue = inject('getSearchFormValue', () => ({}));
  const metricKeyListConfig = ref<IMetricKeyListConfig[]>([
    {
      key: '变动制费',
      value: 0,
      name: '变动制费',
    },
    {
      key: '固定成本',
      value: 0,
      name: '固定成本',
    },
    {
      key: '研发费用',
      value: 0,
      name: '研发费用',
    },
    {
      key: '管理费用',
      value: 0,
      name: '管理费用',
    },
    {
      key: '销售费用',
      value: 0,
      name: '销售费用',
    },
  ]);

  const options = ref<EChartsOption>({});
  // 初始化左边的图表
  const initLeftChart = () => {
    const xAxisData = metricKeyListConfig.value.map(item => {
      return item.name;
    });
    metricKeyListConfig.value = metricKeyListConfig.value.map(item => ({
      ...item,
      value: Number.parseFloat((props.info?.[item.key] || 0).toFixed(1)),
    }));
    options.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: xAxisData,
      },
      series: [...getPictorialBarSeriesOptions(metricKeyListConfig.value)],
    });
  };

  // 给图表绑定事件
  const bindChartClick = chartRef => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', () => {
        const searchFormValue = getSearchFormValue() as any;
        const { orgCode, date = dayjs(), timeDimension } = searchFormValue;
        // 构造路由参数
        const url = `/dataAnalysis/financial/expense/detail`;
        const orgCodeValue = props.info.OrgCode || orgCode || '';
        const dimensionDate =
          timeDimension === 'week'
            ? {
                dimension: 'week',
                dateRange: [date.subtract(7, 'day').startOf('week'), date.endOf('week')],
              }
            : {
                dimension: 'month',
                dateRange: [date.subtract(1, 'month').startOf('month'), date.endOf('month')],
              };
        goPath(url, {
          ...(orgCodeValue ? { orgCode: orgCodeValue } : {}),
          ...dimensionDate,
        });
      });
    }
  };

  onMounted(() => {
    bindChartClick(chartRef);
  });
  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      initLeftChart();
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
</style>
