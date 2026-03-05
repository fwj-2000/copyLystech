<template>
  <div class="utilization-rate h-[100%] p-[12px]">
    <div class="summary">
      <span class="title">{{ t('dict.CommonCol.aggregation') }}：</span>
      <span class="value">{{ chartData.utilizationRateSum }}%</span>
    </div>
    <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { merge } from 'lodash-es';

  const { t } = useI18n();

  const options = ref({});

  const props = defineProps({
    chartData: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
        efficiencyRate: 0,
        pccStandardRate: 0,
        utilizationRateSum: 0,
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const showData = () => {
    // 渲染数据
  };

  const initChart = () => {
    return {
      // 设置间距
      grid: {
        left: '10',
        right: '10',
        bottom: '10',
        top: '20',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        // data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      },
      yAxis: {
        type: 'value',
        max: 100,
        interval: 10,
        axisLabel: {
          formatter: '{value}%',
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
            result += item.marker + item.name + '<br/>';
            result += item.marker + item.value + '%<br/>';
          });
          return result;
        },
      },
      series: [
        {
          type: 'line',
          // data: [28, 28, 38, 50, 58, 40, 20],
          smooth: true,
          symbol: 'emptyCircle', // 设置为空心圆
          symbolSize: 12, // 设置节点大小为 12
          itemStyle: {
            color: '#4B7BEC', // 节点颜色
            borderWidth: 2,
          },
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置为顶部
            formatter: function (params) {
              // 标签内容格式化函数
              return params.value + '%'; // 返回节点值
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
                  color: '#4B7BEC', // 渐变起始颜色
                },
                {
                  offset: 0.5, // 渐变结束位置，到 0.5 结束
                  color: '#5EBEFF', // 渐变结束颜色
                },
                {
                  offset: 1, // 渐变结束位置，到 1 结束
                  color: '#4B7BEC', // 渐变结束颜色
                },
              ],
            },
          },
          // 标准线
          markLine: {
            silent: true,
            symbol: 'none',
            label: {
              position: 'middle',
              formatter: '{b}',
            },
            data: [
              {
                name: t('dict.CommonCol.standardEfficiency'),
                // yAxis: 90,
                lineStyle: {
                  color: '#00B42A',
                  type: 'solid',
                },
                label: {
                  position: 'insideEndTop',
                  formatter: '{c}%',
                  color: '#00B42A',
                },
              },
            ],
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
          dataBackground: {
            areaStyle: {
              color: 'rgba(0,0,0,0.03)',
            },
          },
          // 底部缩放配置
          selectedDataBackground: {
            areaStyle: {
              color: 'rgba(0,0,0,0.1)',
            },
            lineStyle: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
          borderColor: '#FFF',
          fillerColor: 'rgba(33,33,33, 0.01)',
          moveHandleStyle: {
            opacity: 0,
          },
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
          handleStyle: {
            borderWidth: 0,
          },
        },
      ],
    };
  };

  function setChartOption() {
    options.value = merge({}, initChart(), {
      xAxis: {
        data: props.chartData.xAxisData,
      },
      series: [
        {
          data: props.chartData.seriesData,
          markLine: {
            data: [
              {
                yAxis: props.chartData.targetTieldRate,
              },
            ],
          },
        },
      ],
    });
  }

  watch(
    () => props.chartData,
    () => {
      setChartOption();
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    // initChart();
  });
</script>
<style lang="less" scoped>
  .utilization-rate {
    display: flex;
    flex-direction: column;

    .summary {
      .value {
        font-size: 18px;
        color: #ff7b00;
        font-weight: 500;
      }
    }
  }
</style>
