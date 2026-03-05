<!-- 模切达成图表组件 -->
<template>
  <Chart ref="chartRef" key="normal" :options="options" width="100%" height="100%" style="width: 100%; height: 100%" />
</template>

<script lang="ts" setup>
  import { EChartsOption } from 'echarts';
  import { useGo } from '/@/hooks/web/usePage';
  import { Chart } from '/@/components/Chart';
  import { computed, inject, onMounted, ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { baseOptions } from './config';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import dayjs from 'dayjs';

  interface ChartInstance extends InstanceType<typeof Chart> {}

  const go = useGo();
  const DETAIL_URL = '/dashboard/operate/dieCutting/infoDetail';
  const props = defineProps({
    info: {} as any,
  });

  const chartRef = ref<ChartInstance | null>(null);

  onMounted(() => {
    // 给图表绑定点击事件
    bindChartClick(chartRef.value);
  });

  // 图表点击事件
  const bindChartClick = chartRef => {
    if (chartRef) {
      const instance = chartRef.getInstance();
      instance?.on('click', goDetail);
    }
  };
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goDetail = () => {
    const orgCode = props.info.OrgCode || 'MQ';
    const { date } = getSearchFormValue() as any;
    // 构造路由参数
    const url = `${DETAIL_URL}?${objectToQueryParams({
      orgCode,
      date: dayjs(date).format('YYYY-MM-DD'),
    })}`;
    go(url);
  };

  const options = computed(() => {
    const { BatchAchievementRate, QuantityAchievementRate } = props.info;
    const chartData = [
      {
        legend: '实际达成',
        data: [
          {
            value: formatValue(BatchAchievementRate),
            label: '批次达成率',
          },
          {
            value: formatValue(QuantityAchievementRate),
            label: '数量达成率',
          },
        ],
      },
      {
        legend: '目标达成',
        data: [
          {
            value: 100,
            label: '批次达成率',
          },
          {
            value: 100,
            label: '数量达成率',
          },
        ],
      },
    ];
    const handleOptions: EChartsOption = {
      legend: {
        data: chartData.map(item => item.legend),
      },
      xAxis: {
        data: chartData[0].data.map(item => item.label),
      },
      series: chartData.map(item => ({
        type: 'bar',
        name: item.legend,
        data: item.data.map(item => item.value),
      })),
    };

    return merge(cloneDeep(baseOptions), handleOptions);
  });

  // 格式化后台返回数据
  const formatValue = (value: string) => {
    return Number.parseFloat(value) || 0;
  };
</script>
