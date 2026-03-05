<!--  -->
<template>
  <Chart :options="options" height="100%" width="100%" style="width: 100%; height: 100%" />
</template>

<script lang="ts" setup>
  import { cloneDeep, merge } from 'lodash-es';
  import { Options2 } from './config';
  import { Chart } from '/@/components/Chart';
  import { ref, watch } from 'vue';

  const options = ref({});
  const props = defineProps({
    chartInfo: {
      type: Array,
      required: true,
    },
  });

  watch(
    () => props.chartInfo,
    () => {
      const info = (props.chartInfo as any[]).sort((a, b) => a['DownTimes'] - b['DownTimes']);
      const handleOptions = {
        yAxis: {
          data: info.map((item: any) => item.Reason),
        },
        series: [
          {
            data: info.map((item: any) => item.DownTimes),
          },
        ],
      };
      options.value = merge(cloneDeep(Options2), handleOptions);
    },
  );
</script>
