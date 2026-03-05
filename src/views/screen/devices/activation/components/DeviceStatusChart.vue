<template>
  <Chart v-if="chartOptions" ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { devicesStatusOptions } from '../config';
  import { Chart } from '/@/components/Chart';
  import { useDevices } from './hooks/useDevices';
  import { equipmentStatusColorMap } from './const';

  const props = defineProps<{
    data: any[];
  }>();
  const chartOptions = ref<any>({});
  watch(
    () => props.data,
    () => {
      init();
    },
  );
  async function init() {
    if (!props.data?.length) return;
    const { getEquipmentStatusMap } = await useDevices();
    const equipmentStatusData: any = await getEquipmentStatusMap('UseStatus');
    const { equipmentStatusData: legendData, UseStatusDataMap } = equipmentStatusData;
    const chartData = props.data.map(item => {
      const color = equipmentStatusColorMap.find(color => color.value === item.key)?.color;
      return { value: item.value, name: UseStatusDataMap[item.key], itemStyle: { color } };
    });
    chartOptions.value = devicesStatusOptions({ legendData, chartData });
  }

  onMounted(async () => {
    init();
  });
</script>
