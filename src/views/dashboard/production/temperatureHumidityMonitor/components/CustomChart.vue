<template>
  <Chart :options="state.chartConfig" ref="customChartRef" height="300px" />
</template>

<script setup lang="ts">
  import { reactive, toRefs, onMounted, watch } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { chartOptions } from './config';
  import { cloneDeep, merge } from 'lodash-es';

  const props = defineProps({
    options: {
      type: Object,
      default: () => {}
    }
  })

  const state = reactive({
    chartConfig: cloneDeep(chartOptions),
  })

  const setOptions = (options) => {
        
    const { TempUpper, TempLower, HumiLower, HumiUpper, RecordDates, Temperature, Humidity } = toRefs(options);;

    const markLineData = [
      {
        data: Temperature.value,
        position: 'start',
        unit: '℃',
        list: [
          { name: '温度下限', value: TempLower.value, type: 'min' },
          { name: '温度上限', value: TempUpper.value, type: 'max' },
        ],
      },
      {
        data: Humidity.value,
        position: 'end',
        unit: '%',
        list: [
          { name: '湿度下限', value: HumiLower.value, type: 'min' },
          { name: '湿度上限', value: HumiUpper.value, type: 'max' },
      ],
      }
    ];
    const visualMapData = [
      {
        min: TempLower.value,
        max: TempUpper.value,
        color: 'red',
        type: 'min',
      },
      {
        min: HumiLower.value,
        max: HumiUpper.value,
        color: 'red',
        type: 'max',
      },
    ];

    const tempChart = {
      xAxis: {
        data: RecordDates.value
      },
      series: markLineData.map((item) => {
        return {
          type: 'line',
          data: item.data,
          markLine: {
            data: item.list.map((i) => {
              return {
                name: i.name,
                yAxis: i.value,
                label: {
                  position: item.position,
                  fontSize: 12,
                  type: i.type,
                  formatter: `${i.name}${i.value}${item.unit}`,
                },
              };
            }),
          },
        };
      }),
      visualMap: visualMapData.map(c => {
        return {
          pieces: [
            {
              gt: c.min, // 设置最小值
              lte: c.max, // 设置最大值
            },
          ],
          outOfRange: {
            color: c.color, // 设置超出部分的颜色
          },
        };
      })
    }

    state.chartConfig = merge(state.chartConfig, tempChart)
  }

  watch(
    () => props.options,
    () => {
      console.log(props.options, 'update-chart-options')
      setOptions(props.options);
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    setOptions(props.options);
  });
</script>
