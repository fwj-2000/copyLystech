<!-- 稼动率柱形图 -->
<template>
  <div class="absolute top-0 left-0 z-2 flex justify-between flex-center pt-6px text-[15px] font-bold">
    <!-- <div class="text-[#fff]"> 停机原因分析 </div> -->
  </div>
  <div class="w-[100%] h-[100%] flex-1">
    <div class="w-[100%] h-[100%] flex center">
      <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { merge, cloneDeep, isEmpty } from 'lodash-es';
  import { ringPieOptions } from './config';

  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';

  interface IProps {
    metricKey: string;
    dataInfo: Record<string, any>[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    metricKey: '综合',
  });
  const options = ref<EChartsOption>({});
  const isEmptyData = ref(false);

  const setChartOptions = data => {
    const seriesData = data
      .filter(item => item.keys)
      .map(item => ({
        value: item.values,
        name: item.keys,
      }));
    if (isEmpty(seriesData)) {
      isEmptyData.value = true;
      return;
    }
    const handleOptions = {
      series: [
        {
          data: seriesData,
        },
      ],
    };
    options.value = merge(cloneDeep(ringPieOptions), handleOptions);
  };

  // 监听组件数据变化，重绘图表
  watch(
    () => props.dataInfo,
    () => {
      setChartOptions(props.dataInfo);
    },
    { deep: true, immediate: true },
  );
</script>
