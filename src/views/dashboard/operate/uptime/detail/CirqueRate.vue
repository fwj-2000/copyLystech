<!-- 圆环图 -->
<template>
  <div class="w-[100%] h-[100%] chart-item">
    <Chart class="w-[100%] h-[100%]" :options="chartOptions" height="100%" width="100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { cirqueChartOption } from './config'; // 引入环形图数据
  import { Chart } from '/@/components/Chart';

  const chartOptions = ref(cirqueChartOption);
  const props = defineProps({
    info: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    optionInfo: {
      type: Object as PropType<any>,
      default: () => {},
    },
  });

  watch(
    () => props.info,
    () => {
      const options = {
        title: {
          text: props.optionInfo.title,
        },
        series: [
          {
            data: props.optionInfo.values.map(item => {
              const { label, valueKey, rateKey } = item;
              const value = props.info[valueKey] ?? 0;
              const rate = ((props.info[rateKey] ?? 0) * 100).toFixed(1);
              return {
                name: `{boldRed|${label}}{boldRed2| ${value}}{boldRed3| ${rate}%}`,
                value: props.info[item.valueKey] ?? 0,
              };
            }),
          },
        ],
      };
      console.log('options: ', options);
      chartOptions.value = merge(cloneDeep(cirqueChartOption), options);
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .chart-item {
    border-radius: 8px;
    border: 1px solid #fdfdfd;
    background: linear-gradient(90deg, #edf3ff 0%, rgb(255 255 255 / 0%) 122.73%);
  }
</style>
