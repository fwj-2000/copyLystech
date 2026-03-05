<template>
  <Chart ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { todayActivationOptions } from '../config';
  import { Chart } from '/@/components/Chart';
  import { getDayvgoperationratelist } from '/@/api/equipment/operationrate';

  interface IProps {
    data: any[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
  });
  const chartOptions = ref<any>({});

  watch(
    () => props.data,
    () => {
      init();
    },
  );
  function init(data: any[] = props.data) {
    const keys = data.map(item => item.key);
    const xAxisData = keys;
    const yAxisData = data.map(item => item.value);
    chartOptions.value = todayActivationOptions({ xAxisData, yAxisData });
  }

  async function getDayvgoperationratelistFn(params): Promise<void> {
    const { code, data } = await getDayvgoperationratelist(params);
    if (code === 200) {
      init(data);
    }
  }

  onMounted(() => {
    init();
  });

  defineExpose({
    getDayvgoperationratelistFn,
  });
</script>
