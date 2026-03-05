<template>
  <div class="overview-Content">
    <div class="section-head">
      <div class="left">
        <div class="subtitle">
          <span class="bar"></span>
          <span>{{ t('common.demandTrend') }}</span>
          <span>{{ console.log(props) }}</span>
        </div>
        <div class="legend">
          <MetricSegment v-model="currentKey" />
        </div>
      </div>
      <div class="time">{{ t('common.updateTime') }}: {{ updateTime }}</div>
    </div>
    <div class="section-body">
      <Chart ref="chartRef" class="trend-chart" height="100%" width="100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue';
  import type { EChartsOption } from 'echarts';
  import { Chart } from '/@/components/Chart';
  import { useI18n } from '/@/hooks/web/useI18n';
  import MetricSegment from './MetricSegment.vue';

  const props = defineProps<{
    weekList: string[];
    applyAreaList: number[];
    complianceRateList: number[];
    replyAreaList: number[];
    updateTime: string;
  }>();

  const currentKey = ref('area');

  const { t } = useI18n();
  const chartRef = ref<InstanceType<typeof Chart> | null>(null);
  const visibleMap = ref({
    initiated: true,
    inProgress: true,
    over: true,
    close: true,
  });

  function toggle(key: keyof typeof visibleMap.value) {
    visibleMap.value[key] = !visibleMap.value[key];
  }

  const chartOptions = computed<EChartsOption>(() => {
    const weekData = Array.isArray(props.weekList) ? props.weekList : [];
    const safe = (value?: number[]) => (Array.isArray(value) ? value : []);
    const yAxisConfig: any = { type: 'value', splitLine: { lineStyle: { color: '#eee' } } };

    let series, data;
    if (currentKey.value === 'area') {
      const maxArea = Math.max(-Infinity, ...safe(props.applyAreaList), ...safe(props.replyAreaList));
      if (isFinite(maxArea) && maxArea > 0) {
        if (maxArea <= 100) {
          yAxisConfig.max = Math.ceil(maxArea / 10) * 10;
        } else {
          yAxisConfig.max = Math.ceil(maxArea / 100) * 100;
        }
      }
      series = [
        {
          name: t('dict.application.area'),
          type: 'line',
          smooth: false,
          data: safe(props.applyAreaList),
          showSymbol: visibleMap.value.initiated,
          symbol: 'circle',
          symbolSize: 6,
          z: 40,
          lineStyle: { width: 2, color: '#91d5ff', opacity: visibleMap.value.initiated ? 1 : 0 },
          itemStyle: { color: '#fff', borderColor: '#91d5ff', borderWidth: 2, opacity: visibleMap.value.initiated ? 1 : 0 },
          tooltip: { show: visibleMap.value.initiated },
          emphasis: { lineStyle: { width: 3.5 }, z: 100 },
        },
        {
          name: t('dict.SampleApplyColumn.replyArea'),
          type: 'line',
          smooth: false,
          data: safe(props.replyAreaList),
          showSymbol: visibleMap.value.inProgress,
          symbol: 'circle',
          symbolSize: 6,
          z: 30,
          lineStyle: { width: 2, color: '#1890ff', opacity: visibleMap.value.inProgress ? 1 : 0 },
          itemStyle: { color: '#fff', borderColor: '#1890ff', borderWidth: 2, opacity: visibleMap.value.inProgress ? 1 : 0 },
          tooltip: { show: visibleMap.value.inProgress },
          emphasis: { lineStyle: { width: 3.5 }, z: 100 },
        },
      ];
      data = [t('dict.application.area'), t('dict.SampleApplyColumn.replyArea')];
    } else if (currentKey.value === 'rate') {
      const maxRate = Math.max(-Infinity, ...safe(props.complianceRateList));
      if (isFinite(maxRate) && maxRate > 0) {
        const roundedMax = Math.ceil(maxRate / 10) * 10;
        yAxisConfig.max = Math.max(roundedMax, 100);
      } else {
        yAxisConfig.max = 100;
      }
      series = [
        {
          name: t('dict.SampleApplyColumn.complianceRate'),
          type: 'line',
          smooth: false,
          data: safe(props.complianceRateList),
          showSymbol: visibleMap.value.over,
          symbol: 'circle',
          symbolSize: 6,
          z: 20,
          lineStyle: { width: 2, color: '#ff7875', opacity: visibleMap.value.over ? 1 : 0 },
          itemStyle: { color: '#fff', borderColor: '#ff7875', borderWidth: 2, opacity: visibleMap.value.over ? 1 : 0 },
          tooltip: { show: visibleMap.value.over },
          emphasis: { lineStyle: { width: 3.5 }, z: 100 },
        },
      ];
      data = [t('dict.SampleApplyColumn.complianceRate')];
    }

    return {
      animation: true,
      animationDuration: 600,
      animationDurationUpdate: 500,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let result = params[0].name + '<br/>'; // This is the x-axis label (week)
          params.forEach(function (item) {
            if (item.seriesName === t('dict.SampleApplyColumn.complianceRate')) {
              result += item.marker + item.seriesName + ': ' + item.value + '%<br/>';
            } else {
              result += item.marker + item.seriesName + ': ' + item.value + '<br/>';
            }
          });
          return result;
        },
      },
      emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
      grid: [
        { left: '2%', right: '6%', top: '12%', bottom: 40, containLabel: true },
        { left: '2%', right: '6%', height: 14, bottom: 20 },
      ],
      legend: {
        data,
        icon: 'circle',
        right: '2%',
        itemWidth: 8, // Set item width to make it smaller
        itemHeight: 8, // Set item height to make it smaller
        itemStyle: {
          // borderWidth: 0
        },
      },
      xAxis: [
        {
          type: 'category',
          data: weekData,
          boundaryGap: false,
          axisTick: { alignWithLabel: true },
          axisLabel: { interval: 0 },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: weekData,
          boundaryGap: false,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      yAxis: [
        yAxisConfig,
        {
          type: 'value',
          gridIndex: 1,
          min: 0,
          max: 100,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          yAxisIndex: [0], // 指定控制哪个 y 轴
        },
        {
          type: 'slider',
          dataBackground: {
            areaStyle: {
              color: 'rgba(0,0,0,0.03)',
            },
          },
          selectedDataBackground: {
            areaStyle: {
              color: 'rgba(255, 123, 0, 1)',
            },
            lineStyle: {
              color: 'rgba(255, 153, 0, 0.5)',
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
      series,
    };
  });

  watch(
    chartOptions,
    option => {
      nextTick(() => {
        console.log(option, 'optionoptionoptionoption');
        chartRef.value?.setOptions(option, true);
      });
    },
    { deep: true, immediate: true },
  );
</script>
<style scoped>
  .overview-Content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, rgb(255 237 229 / 100%), rgb(255 248 245 / 100%) 100%);
    padding: 8px 12px;
    height: 40px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .subtitle {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 14px;
  }

  .subtitle .bar {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #fa8c16;
    margin-right: 6px;
    border-radius: 2px;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
  }

  .legend .item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s ease;
  }

  .legend .item::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .color1::before {
    background: #91d5ff;
  }

  .color2::before {
    background: #1890ff;
  }

  .color3::before {
    background: #ff7875;
  }

  .color4::before {
    background: #52c41a;
  }

  /* Gray legend only; line visibility follows visibleMap */
  .legend .item.inactive {
    opacity: 0.4;
    text-decoration: line-through;
  }

  .time {
    font-size: 13px;
    color: #555;
    margin-right: 12px;
  }

  .section-body {
    height: calc(100% - 40px);
    border: 1px solid #f0f0f0;
    border-top: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .trend-chart {
    width: 100%;
    height: 100%;
  }
</style>
