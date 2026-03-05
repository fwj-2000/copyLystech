<!-- 图表内容 -->
<template>
  <div class="charts-container flex row">
    <div class="border mr-8px flex" style="width: 30%; height: 100%">
      <Chart :options="options1" height="100%" style="height: 100%; width: 70%" />
      <Chart :options="options2" height="100%" style="height: 100%; width: 30%" />
    </div>
    <div class="border flex" style="width: 30%; height: 100%">
      <Chart :options="options3" height="100%" style="height: 100%; width: 70%" />
      <Chart :options="options4" height="100%" style="height: 100%; width: 30%" />
    </div>
    <Chart :options="options5" height="100%" style="height: 100%; width: 29%" />
    <Chart :options="options6" height="100%" style="height: 100%; width: 9%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep, isEmpty, merge } from 'lodash-es';
  import { chartOptions, baseNumOptions } from './config';

  import { Chart } from '/@/components/Chart';

  import type { EChartsOption } from 'echarts';
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    info: any;
    listData?: any;
  }>();

  const options1 = ref<EChartsOption>({});
  const options2 = ref<EChartsOption>({});
  const options3 = ref<EChartsOption>({});
  const options4 = ref<EChartsOption>({});
  const options5 = ref<EChartsOption>({});
  const options6 = ref<EChartsOption>({});

  // 初始化图表1
  const initOptions1 = () => {
    options1.value = merge(cloneDeep(baseNumOptions), {
      grid: {
        left: 16,
        right: 0,
      },
      xAxis: {
        data: ['标准效率', '实际效率'],
      },
      yAxis: {
        show: true,
        name: '模切',
      },
      series: [
        {
          itemStyle: {
            color: {
              colorStops: [
                {
                  offset: 0,
                  color: '#5ABCFE',
                },
                {
                  offset: 1,
                  color: 'rgba(255, 255, 255, 0.45) ',
                },
              ],
            },
          },
          data: [
            {
              value: props.info.bzmqxlkh,
              label: {
                formatter: '{c}K/H',
              },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#AEAEAE',
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, 0.45) ',
                    },
                  ],
                },
              },
            },
            {
              value: props.info.sjmqxlkh,
              label: {
                formatter: '{c}K/H',
              },
            },
          ],
        },
      ],
    });
    options2.value = merge(cloneDeep(baseNumOptions), {
      grid: {
        left: 16,
        right: 16,
      },
      xAxis: {
        data: ['效率达成'],
      },
      yAxis: {
        show: true,
        ...(Number.parseFloat(props.info.mqxldc) < 100 ? { max: 100 } : {}),
      },
      series: [
        {
          itemStyle: {
            color: {
              colorStops: [
                {
                  offset: 0,
                  color: '#5ABCFE',
                },
                {
                  offset: 1,
                  color: 'rgba(255, 255, 255, 0.45) ',
                },
              ],
            },
          },
          data: [
            {
              value: Number.parseFloat(props.info.mqxldc),
            },
          ],
        },
      ],
    });
  };

  // 初始化图表2
  const initOptions3 = () => {
    options3.value = merge(cloneDeep(baseNumOptions), {
      xAxis: {
        data: ['标准效率', '实际效率'],
      },
      yAxis: {
        show: true,
        name: '手工',
      },
      series: [
        {
          data: [
            {
              value: props.info.bzsgxlkh,
              label: {
                formatter: '{c}K/H',
              },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#AEAEAE',
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, 0.45) ',
                    },
                  ],
                },
              },
            },
            {
              value: props.info.sjsgxlkh,
              label: {
                formatter: '{c}K/H',
              },
            },
          ],
        },
      ],
    });
    options4.value = merge(cloneDeep(baseNumOptions), {
      xAxis: {
        data: ['效率达成'],
      },
      yAxis: {
        show: true,
        ...(Number.parseFloat(props.info.sgxldc) < 100 ? { max: 100 } : {}),
      },
      series: [
        {
          data: [
            {
              value: Number.parseFloat(props.info.sgxldc),
            },
          ],
        },
      ],
    });
  };

  // 初始化图表3
  const initOptions5 = () => {
    const leftValue = Number.parseFloat(props.info?.sjrgzb || 0);
    const rightValue = Number.parseFloat(props.info?.bzrgzb || 0);
    options5.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: ['实际人工占比', '标准人工占比'],
      },
      series: [
        {
          label: {
            formatter: '{c}%',
          },
          data: [
            {
              value: leftValue,
              label: {
                position: leftValue > 0 ? 'top' : 'bottom',
              },
              symbol:
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVHgBNVBBTsMwEJx13NBKQNJeoLeIA1e48wJeAU/gCfwAjoiPcO0TeABI7ZE2TRqUkIrEHtapWHnssa3ZnV3hU5Z6hzu43yuhvxb4lJ5TkCmGICGmgkEJRCuaaEkzWkRjWYh/vSkYx6mAgD9AgsZzOPQS1BJW4Ih0C7znymL5NZWzOXg+B05OgfEEjCxgZFBq5SEvnAO6TvBdQvI18fmRWXQ9ZLOm9B2QzIB0JgoOfKpwHijWQL0FtrmgzMlio3kNrLu4fHTx0T2MycRaiFffTSMSqu1/qKYFTU3uW9Coo0THcZxUUVs/H/rSaN8est7ajEYyE5tEh5b+/6nvne9dpR3sRl3zPrl9WYb3PyzbffBiDGw3AAAAAElFTkSuQmCC',
            },
            {
              value: rightValue,
              label: {
                position: rightValue > 0 ? 'top' : 'bottom',
              },
              symbol:
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBhVA5DoQwEHMg4Si4JFr+/xbeQEcDEg3iEnc2jjbb7kjWSHN47BHXdemu67AsC6Zpwn3fMDWbGVprKKUs4ji2KIoCeZ5D1HWtOSSEwL8gkYsgCCCHYUCeZUjSFFEU2aLv+/A87zf4vi+e57HYtg3ruqJtW0jKm+YZ+3FASQlllp1MEvHaYXqcYz7P04J10TSN7vse+77biw7SENEKwUWCCpjZr6oKQn+NjOMIWqAkEhHOJ58UhiGSJEFZlvZZjA9EVH0wvi6I2AAAAABJRU5ErkJggg==',
            },
          ],
        },
      ],
    });
  };

  // 初始化图表4
  const initOptions6 = () => {
    const { rgsse = 0 } = props.info;
    const value = Number.parseFloat(rgsse);
    // 计算最大值和最小值
    const allValues = (props?.listData || []).map(item => Number.parseFloat(item.rgsse));
    const minValue = Math.min(...allValues, value);
    const maxValue = Math.max(...allValues, value);
    options6.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: ['人工损失额'],
      },
      yAxis: {
        max: maxValue * 1.1,
        min: isEmpty(allValues) ? 0 : minValue * 1.1,
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          data: [
            {
              value,
              label: {
                position: value >= 0 ? 'top' : 'bottom',
                formatter: '{c}万',
              },
            },
          ],
        },
      ],
    });
  };

  // 监听组件数据变化，重绘图表
  watch(
    () => props.info,
    () => {
      initOptions1();
      initOptions3();
      initOptions5();
      initOptions6();
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .charts-container {
    width: 100%;
    height: 100%;
    padding-bottom: 12px;

    .border {
      border-radius: 4px;
      border: 1px solid #dbdbdb;
    }
  }
</style>
