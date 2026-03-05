<!--  -->
<template>
  <Chart :options="options" height="100%" width="100%" style="width: 100%; height: 100%" />
</template>

<script lang="ts" setup>
  import { cloneDeep, merge } from 'lodash-es';
  import { Options } from './config';
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
      const handleOptions = {
        series: [
          {
            data: props.chartInfo.map((item: any) => ({
              value: item.DownTimes,
              name: item.Reason,
            })),
          },
        ],
      };
      options.value = merge(cloneDeep(Options), handleOptions);
    },
  );
</script>
