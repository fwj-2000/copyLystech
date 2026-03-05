<!-- 图表内容 -->
<template>
  <div class="charts-container flex row">
    <div class="left-chart-container flex ct-between">
      <Chart :options="options" height="100%" style="height: 100%; width: 68%" />
      <Chart :options="options2" height="100%" style="height: 100%; width: 30%" />
    </div>
    <div class="center-chart-container flex">
      <percentageChart style="width: 75%; height: 80%" v-bind="percentageInfo"></percentageChart>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions } from './config';

  import { Chart } from '/@/components/Chart';
  import percentageChart from './percentageChart.vue';

  import type { EChartsOption } from 'echarts';
  const emits = defineEmits(['updateValues']);

  const props = defineProps<{
    info: any;
    listData?: any;
  }>();

  const options = ref<EChartsOption>({});
  const options2 = ref<EChartsOption>({});

  const percentageInfo = computed(() => {
    return {
      sjclzb: props.info.sjclzb,
      bzclzb: props.info.bzclzb,
    };
  });

  // 初始化左边的图表
  const initLeftChart = () => {
    const leftValue = Number.parseFloat(props.info?.sjshl || 0);
    const rightValue = Number.parseFloat(props.info?.bzshl || 0);
    options.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: ['实际损耗率', '标准损耗率'],
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
                position: leftValue >= 0 ? 'top' : 'bottom',
              },
            },
            {
              value: rightValue,
              label: {
                position: rightValue >= 0 ? 'top' : 'bottom',
              },
              symbol:
                'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAGCAYAAAAc2cSCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADFSURBVHgBhVA5DoQwEHMg4Si4JFr+/xbeQEcDEg3iEnc2jjbb7kjWSHN47BHXdemu67AsC6Zpwn3fMDWbGVprKKUs4ji2KIoCeZ5D1HWtOSSEwL8gkYsgCCCHYUCeZUjSFFEU2aLv+/A87zf4vi+e57HYtg3ruqJtW0jKm+YZ+3FASQlllp1MEvHaYXqcYz7P04J10TSN7vse+77biw7SENEKwUWCCpjZr6oKQn+NjOMIWqAkEhHOJ58UhiGSJEFZlvZZjA9EVH0wvi6I2AAAAABJRU5ErkJggg==',
            },
          ],
        },
      ],
    });
    // 损耗超损额
    const { shsse = 0 } = props.info;
    const value = Number.parseFloat(shsse);
    // 计算最大值和最小值
    const allValues = (props?.listData || []).map(item => item.shsse);
    const maxValue = Math.max(...allValues, value);
    options2.value = merge(cloneDeep(chartOptions), {
      xAxis: {
        data: ['损耗超损额'],
      },
      yAxis: {
        max: maxValue * 1.1,
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          label: {
            formatter: '{c}(万元)',
          },
          data: [
            {
              value: Number.parseFloat(props.info?.shsse || 0),
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
      initLeftChart();
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .charts-container {
    width: 100%;
    height: 100%;
    padding-bottom: 12px;

    .left-chart-container {
      width: 50%;
      height: 100%;
    }

    .center-chart-container {
      position: relative;
      width: 50%;
      height: 100%;

      .value-list {
        width: 90%;
        padding: 6px 8px;
        margin-left: 5%;
        margin-top: 12px;
        align-items: center;
        background-color: #eee;
        border-radius: 4px;

        .item {
          color: #666;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;

          &:last-child {
            margin-top: 0;
          }

          .legend {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 2px;

            &.legend0 {
              background: #5493ed;
            }

            &.legend1 {
              border: 1px solid #b4b4b4;
              background: #f0f4f5;
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }
</style>
