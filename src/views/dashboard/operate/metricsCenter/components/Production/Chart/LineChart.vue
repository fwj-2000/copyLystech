<!-- 产销折线图 -->
<template>
  <Chart ref="chartRef1" :options="props.monthOptions" height="100%" style="height: 50%; width: 100%" />
  <Chart ref="chartRef2" :options="props.options" height="100%" style="height: 50%; width: 100%" />
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  import { Chart } from '/@/components/Chart';

  const props = defineProps<{
    options: any;
    monthOptions?: any;
  }>();

  interface ChartInstance extends InstanceType<typeof Chart> {}
  const chartRef1 = ref<ChartInstance | null>(null);
  const chartRef2 = ref<ChartInstance | null>(null);

  onMounted(() => {
    // 监听图例选中状态更改事件
    if (chartRef1?.value) {
      const instance = chartRef1.value.getInstance();
      instance &&
        instance.on('legendselectchanged', (params: any) => {
          // 联动图例更改
          const instance2 = chartRef2?.value && chartRef2?.value.getInstance();
          Object.keys(params.selected).forEach(key => {
            if (instance2) {
              const type = params.selected[key] ? 'legendSelect' : 'legendUnSelect';
              instance2.dispatchAction({
                type,
                name: key,
              });
            }
          });
        });
    }
  });
</script>
