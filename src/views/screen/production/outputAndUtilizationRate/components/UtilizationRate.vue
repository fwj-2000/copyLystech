<!-- 稼动率&良率图表 -->
<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { rateChartConfig } from './config';

  interface IProps {
    dataList: any[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    dataList: () => [],
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);
  setOptions(rateChartConfig);

  watch(
    () => props.dataList,
    value => {
      getInstance()?.setOption(
        {
          xAxis: {
            data: value.map((item: any) => item.MachineNum),
          },
          series: [
            {
              data: value.map((item: any) => item.UtilizationRate),
            },
            {
              data: value.map((item: any) => item.YieldRate),
            },
          ],
        },
        {
          notMerge: false,
          lazyUpdate: true,
        },
      );
    },
    { deep: true },
  );
</script>
