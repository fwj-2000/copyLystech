<script lang="ts" setup>
  import { nextTick, onMounted, ref, watch } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { getLineOptions } from '/@/views/dashboard/vc/MILManage/config';
  import { merge } from 'lodash-es';

  const props = defineProps({
    options: {
      type: Object as PropType<any>,
      default: {},
    },
  });

  const chartsRef = ref(null);

  watch(
    () => props.options,
    async newVal => {
      await nextTick();
      const xAxis: string[] = [];
      const data = [];
      const quantity: number[] = [];
      newVal.forEach(v => {
        xAxis.push(v.keys);
        // xAxis.push(v.keys + '\n' + `${parseFloat((v.values * 100).toFixed(1))}%`);
        data.push((v.values * 100).toFixed(1));
        quantity.push(v.quantity);
      });

      const minValue = Math.min(...data);
      const minTick = Math.floor(minValue / 10) * 10;
      chartsRef.value?.setOptions(
        merge({}, getLineOptions(), {
          xAxis: {
            data: xAxis,
          },
          yAxis: [
            {},
            {
              min: minValue,
              max: Math.ceil(Math.max(...data) / 10) * 10,
              axisLabel: {
                show: true,
                formatter: function (value) {
                  // 只显示最小整十数的刻度
                  if (value === minValue) {
                    return minTick;
                  }
                  return '';
                },
              },
            },
          ],
          series: [
            {
              data: quantity,
            },
            {
              data,
            },
          ],
        }),
      );
    },
    { immediate: true },
  );

  onMounted(() => {
    console.log('onMounted');
  });

  // watch(props.options, newVal => {
  //   console.log("🚀 ~  ~ newVal: ", newVal);
  //   // getLineOptions
  //   // chartsRef.setOptions(merge({}, getLineOptions(), newVal))
  // });
</script>

<template>
  <Chart height="85px" style="height: 100%; width: 100%" ref="chartsRef" />
</template>
