<template>
  <div class="efficiency h-[100%]">
    <div class="chart-box p-[12px]">
      <Chart :options="options" height="100%" style="height: 100%; width: 100%" />
    </div>
    <div class="rate-box">
      <img src="/@/assets/images/lockScreen/leftArrow.png" class="left-arrow" alt="" />
      <div class="rate-box-content">
        <div class="title">{{ t('dict.CommonCol.achievementRate') }}</div>
        <div class="rate">{{ props.chartData.currentProductionEfficiencyRate }}%</div>
        <div class="rate-chart">
          <Chart :options="rateOption" height="100%" style="height: 100%; width: 100%" />
        </div>
        <div class="mt-20px summary">{{ t('dict.CommonCol.aggregation') }}</div>
        <div class="legend">
          <div class="legend-item mb-4px">
            <div class="sign actual-sign"></div>
            <div class="legend-name">{{ t('dict.CommonCol.actualDieCutEfficiency') }}</div>
          </div>
          <div class="legend-item">
            <div class="sign standard-sign"></div>
            <div class="legend-name">{{ t('dict.CommonCol.standardDieCutEfficiency') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { merge } from 'lodash-es';

  const { t } = useI18n();

  const options = ref({});
  const rateOption = ref({});

  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
        efficiencyRate: 0,
        pccStandardRate: 0,
        currentProductionEfficiencyRate: 0,
        targetPccStandardRate: 0,
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  const initLeftChart = () => {
    return {
      // 设置间距
      grid: {
        left: '2',
        right: '2',
        bottom: '10',
        top: '10',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        // data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        axisLabel: {
          interval: 0, // 强制显示全部标签
          rotate: 45, // x轴文字倾斜角度
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          // y轴刻度线为虚线
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      // 鼠标划上去提示
      tooltip: {
        trigger: 'axis',
      },
      // 图例
      legend: {
        data: [t('dict.CommonCol.actualDieCutEfficiency')],
        orient: 'horizontal',
        left: 'center',
        bottom: '-6',
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
      },
      series: [
        {
          name: t('dict.CommonCol.actualDieCutEfficiency'),
          // data: [2814, 3814, 4814, 6814, 7200, 9000, 7300, 5300, 4000, 3200, 2000, 1000],
          type: 'bar', // 柱状图
          itemStyle: {
            color: '#ff7b00', // 柱子背景颜色
          },
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置为顶部
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
                // yAxis: 4600,
                lineStyle: {
                  color: '#00B42A',
                  type: 'solid',
                },
                label: {
                  position: 'insideEndTop',
                  formatter: '{b}\n {c}',
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

  const initRightChart = () => {
    return {
      grid: { left: 0, right: 0, top: '20', bottom: '0' }, // 无边距
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLabel: { show: false }, // 不显示文字
        data: [t('dict.CommonCol.actualDieCutEfficiency'), t('dict.CommonCol.standardDieCutEfficiency')], // 仅用于柱子顺序
      },
      yAxis: { show: false }, // 完全隐藏
      // 鼠标划上去提示
      tooltip: {
        trigger: 'axis',
      },
      series: [
        {
          type: 'bar',
          barWidth: '50%',
          // data: [
          //   { value: 3814, itemStyle: { color: 'rgba(56, 116, 255)' } }, // 深蓝
          //   { value: 2814, itemStyle: { color: 'rgba(94, 190, 255)' } }, // 浅蓝
          // ],
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置为顶部 },
          },
          emphasis: { itemStyle: { opacity: 0.9 } },
        },
      ],
    };
  };

  function setLeftChartOption() {
    options.value = merge({}, initLeftChart(), {
      xAxis: {
        data: props.chartData.xAxisData,
      },
      series: [
        {
          data: props.chartData.seriesData,
          markLine: {
            data: [
              {
                yAxis: props.chartData.targetPccStandardRate,
              },
            ],
          },
        },
      ],
    });
  }
  function setRightChartOption() {
    rateOption.value = merge({}, initRightChart(), {
      series: [
        {
          data: [
            { value: props.chartData.efficiencyRate, itemStyle: { color: 'rgba(56, 116, 255)' } }, // 深蓝
            { value: props.chartData.pccStandardRate, itemStyle: { color: 'rgba(94, 190, 255)' } }, // 浅蓝
          ],
        },
      ],
    });
  }

  watch(
    () => props.chartData,
    () => {
      setLeftChartOption();
      setRightChartOption();
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    // initChart();
  });
</script>
<style lang="less" scoped>
  .efficiency {
    display: flex;

    .chart-box {
      flex: 1;
    }

    .rate-box {
      width: 140px;
      display: flex;

      .left-arrow {
        height: 100%;
      }

      .rate-box-content {
        flex: 1;
        border: 1px solid #e9e9e9;
        border-left: 0;
        background: #f5f5f5;
        padding: 30px 0 14px;
        display: flex;
        flex-direction: column;

        .title {
          padding: 0 10px;
          color: #3d3d3d;
          font-size: 14px;
        }

        .rate {
          padding: 0 10px;
          color: #ff7b00;
          font-size: 20px;
          font-weight: 700;
          margin: 6px 0 12px;
        }

        .rate-chart {
          padding: 0 10px;
          flex: 1;
          border-bottom: 1px solid #e6e6e6;
        }

        .summary {
          margin: 8px 0 10px;
          color: '#000';
          font-size: 12px;
          opacity: 0.6;
          text-align: center;
        }

        .legend {
          padding: 0 2px;

          .legend-item {
            display: flex;
            align-items: center;
            justify-content: center;

            .sign {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 6px;
            }

            .actual-sign {
              background: rgb(56 116 255);
            }

            .standard-sign {
              background: rgb(94 190 255);
            }

            .legend-name {
              color: #666;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
</style>
