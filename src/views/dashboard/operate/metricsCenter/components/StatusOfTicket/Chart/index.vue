<!-- 图表内容 -->
<template>
  <div class="charts-container flex row">
    <div class="left-chart-container">
      <Chart :options="options" height="100%" style="height: 100%;width: 100%" />
    </div>
    <div class="center-chart-container">
      <highcharts ref="highChart" :options="pieOptions" style="height: 80%;width: 100%;" />
      <!-- <bgSvg class="bg" /> -->
      <div class="value-list flex ct-between">
        <div v-for="(item, idx) in valueList" :key="idx" class="item">
          <span :class="`legend legend${idx} mr-8px`" />
          <span class="name mr-6px">{{ item.name }}:</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="right-chart-container">
      <Chart :options="numOptions" height="100%" style="width: 100%;height: 100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { cloneDeep, merge } from 'lodash-es';
// 挪用制程良率的图表配置
import { chartOptions, highlightColor } from '/@/views/dashboard/operate/metricsCenter/components/ProcessYield/Chart/config';
import { colorStyle, basePieOptions, baseNumOptions } from './config';

import { Chart } from '/@/components/Chart';
import ringBgSvg from '/@/assets/svg/report/ring_bg.svg'

import type { EChartsOption } from 'echarts';
import * as Highchart from 'highcharts';
const emits = defineEmits(['updateValues']);

const props = defineProps<{
  info: any;
}>();

let pieOptions = {}; // highchart配置不能用响应式数据
const options = ref<EChartsOption>({});
const numOptions = ref<EChartsOption>({});
const valueList = ref<any[]>([{
  name: '结单率',
  value: '78%',
}, {
  name: '逾期率',
  value: '78%',
}]);
const highChart = ref<HTMLElement | null | undefined>();
let chartBg: Highchart.SVGElement | null = null;

// 初始化左边的图表
const initLeftChart = () => {
  const { normal, high } = colorStyle;
  const colors = [normal, high];
  const data = [52, 24];
  const handleOptions: EChartsOption = {
    grid: {
      right: 12,
      top: 24,
      bottom: 0,
    },
    xAxis: {
      data: ['结单', '在制'],
    },
    yAxis: {
      max: 100,
    },
    series: [
      {
        data: data.map((item, idx) => ({
          value: item === 0 ? null : 0,
          itemStyle: {
            color: (colors[idx] || normal).foot,
          },
        }))
      },
      {
        data: data.map((item, idx) => ({
          value: item === 0 ? null : item,
          itemStyle: {
            color: (colors[idx] || normal).head,
          },
        }))
      },
      {
        data: data.map(item => ({
          value: item,
          itemStyle: {
            color: highlightColor,
          }
        }))
      },
      {
        data: data.map((item, idx) => ({
          value: item,
          itemStyle: {
            color: (colors[idx] || normal).bar,
          }
        }))
      },
    ]
  };
  options.value = merge(cloneDeep(chartOptions), handleOptions);
}


// highchart 高低错落反转
const renderHandle = async () => {
  await nextTick();
  const chart = (highChart?.value as any).chart as Highchart.Chart;
  const points = chart?.series[0].points;
  points.forEach((p) => {
    p.graphic?.attr({
      translateY: 27
    });
  });
  // 绘制背景图片
  // 移除现有的背景图片
  if (chartBg) {
    chartBg?.destroy();
  }
  const width = chart.chartWidth * 0.8;
  const height = width * 0.38;
  chartBg = chart.renderer.image(
    ringBgSvg, // 图片路径
    chart.chartWidth * 0.1, // x坐标
    chart.chartHeight - height, // y坐标
    width, // 图片宽度
    height // 图片高度
  ).add();
}

// 监听组件数据变化，重绘图表
watch(
  () => props.info,
  () => {
    const handleOptions = {}; // 处理过后填充的数据
    initLeftChart();
    numOptions.value = merge(cloneDeep(baseNumOptions), handleOptions);
    pieOptions = merge(cloneDeep(basePieOptions), {
      chart: {
        events: {
          render: renderHandle
        }
      }
    });
  },
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.charts-container {
  width: 100%;
  height: 100%;
  padding-bottom: 12px;

  .left-chart-container {
    width: 30%;
    height: 100%;
  }

  .center-chart-container {
    position: relative;
    width: 40%;
    height: 100%;

    .value-list {
      width: 80%;
      height: 20%;
      margin-left: 10%;

      align-items: flex-end;

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
            background: #5493ED;
          }

          &.legend1 {
            border: 1px solid #B4B4B4;
            background: #F0F4F5;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .right-chart-container {
    width: 40%;
    height: 100%;
  }
}
</style>
