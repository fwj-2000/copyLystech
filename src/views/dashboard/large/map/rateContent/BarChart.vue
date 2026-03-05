<!-- 稼动率柱形图 -->
<template>
  <Chart ref="chartRef" :options="options" height="100%" style="height: 100%; width: 100%" />
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import { merge, cloneDeep } from 'lodash-es';
  import { barOptions } from './config';

  import { Chart } from '/@/components/Chart';
  import type { EChartsOption } from 'echarts';
  interface ChartInstance extends InstanceType<typeof Chart> {}

  interface IProps {
    info: Record<string, any>;
    metricKey: string;
  }
  const props = withDefaults(defineProps<IProps>(), {
    metricKey: '综合',
  });
  const emits = defineEmits(['openDialog']);
  const options = ref<EChartsOption>({});
  const chartRef = ref<ChartInstance | null>(null);

  // 给图表绑定事件
  const bindChartClick = chartRef => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', params => {
        const { name } = params;
        console.log('name: ', name);
        console.log('metricKey: ', props.metricKey);
        emits('openDialog', { name, metricKey: props.metricKey });
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
      const { mainColor, machineType, above80, below30, sixtyToEighty, thirtyToSixty } = props.info;
      const handleOptions = {
        color: [mainColor],
        title: {
          text: machineType,
        },
        xAxis: {
          data: ['低于30%', '30%-60%', '60%-80%', '80%以上'],
        },
        series: [
          {
            data: [below30, thirtyToSixty, sixtyToEighty, above80],
          },
        ],
      };
      options.value = merge(cloneDeep(barOptions), handleOptions);
    },
    { deep: true, immediate: true },
  );
</script>
