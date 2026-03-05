<template>
  <div class="line-echarts w-[100%]">
    <Chart :options="options" height="100%" style="height: 220px; width: 100%" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { lineChartOptions } from './config';
  import { cloneDeep, merge } from 'lodash-es';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    color1: {
      type: String,
      default: '',
    },
    color2: {
      type: String,
      default: '',
    },
    nodeColor: {
      type: String,
      default: '',
    },
    chartData: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
      }),
    },
    needPercentSign: {
      type: Boolean,
      default: true,
    },
  });
  const options = ref({});

  const initChart = () => {
    options.value = merge(cloneDeep(lineChartOptions), {
      xAxis: {
        type: 'category',
        data: props.chartData.xAxisData,
      },
      yAxis: {
        type: 'value',
        // max: 100,
        // interval: 20,
        minInterval: 1,
        axisLabel: {
          formatter: props.needPercentSign ? '{value}%' : '{value}',
          show: true,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function (params) {
          let result = '';
          params.forEach(function (item) {
            result += item.marker + ` ${t('dict.OperationRateColumn.operationDate')}：` + item.name + '<br/>';
            if (props.needPercentSign) {
              result += item.marker + ` ${props.title}：` + item.value + '%<br/>';
            } else {
              result += item.marker + ` ${props.title}：` + item.value + '<br/>';
            }
          });
          return result;
        },
      },

      legend: {
        data: [props.title],
        orient: 'horizontal',
        left: 'center',
        bottom: '-6',
        itemWidth: 10,
        itemHeight: 10,
        icon: 'rect',
      },

      series: [
        {
          name: props.title,
          type: 'line',
          data: props.chartData.seriesData,
          smooth: true,
          symbol: 'emptyCircle', // 设置为空心圆
          symbolSize: 12, // 设置节点大小为 12
          itemStyle: {
            color: props.nodeColor, // 节点颜色
            borderWidth: 2,
          },
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置为顶部
            formatter: function (params) {
              // 标签内容格式化函数
              return props.needPercentSign ? params.value + '%' : params.value; // 返回节点值
            },
          },
          lineStyle: {
            width: 4, // 设置线条宽度为 4
            color: {
              type: 'linear', // 渐变类型为线性渐变
              x: 0, // 渐变起始位置 x 坐标
              y: 0, // 渐变起始位置 y 坐标
              x2: 0, // 渐变结束位置 x 坐标
              y2: 1, // 渐变起始位置 y 坐标
              colorStops: [
                {
                  offset: 0, // 渐变起始位置，从 0 开始
                  color: props.color1, // 渐变起始颜色
                },
                {
                  offset: 0.5, // 渐变结束位置，到 0.5 结束
                  color: props.color2, // 渐变结束颜色
                },
                {
                  offset: 1, // 渐变结束位置，到 1 结束
                  color: props.color1, // 渐变结束颜色
                },
              ],
            },
          },
        },
      ],
    });
  };

  watch(
    () => props.chartData,
    () => {
      initChart();
    },
    { deep: true, immediate: true },
  );
</script>
