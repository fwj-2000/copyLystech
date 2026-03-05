<template>
  <Chart ref="chartRef" :options="chartOptions" height="100%" width="100%" class="chart-wrapper" />
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { devicesErrorOptions } from '../config';
  import { Chart } from '/@/components/Chart';
  import { useDevices } from './hooks/useDevices';

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
  async function init() {
    const { getEquipmentStatusMap } = await useDevices();
    const equipmentFaultReasonData: any = await getEquipmentStatusMap('equipmentFaultReason');
    const { equipmentFaultReasonDataMap } = equipmentFaultReasonData;

    const xAxisData = props.data.map(item => equipmentFaultReasonDataMap[item.key] || '未知');
    const yAxisData = props.data.map(item => item.value);
    chartOptions.value = devicesErrorOptions({ xAxisData, yAxisData });
  }

  onMounted(async () => {
    init();
  });
  // 示例数据
  // const xAxisData = [100, 200, 300, 400, 500]; // 数值数据
  // const yAxisData = ['设备A', '设备B', '设备C', '设备D', '设备E']; // 类别数据
  // const chartOptions = devicesErrorOptions({ xAxisData, yAxisData });
</script>
