<!-- 时间稼动率组件  -->
<template>
  <div class="compo-container flex">
    <!-- 图表 -->
    <div class="w-[65%] chart-wrapper">
      <Chart ref="chartRef" :options="state.options" height="100%" style="height: 100%; width: 100%" />
    </div>
    <!-- 分割綫 -->
    <div class="split-h"></div>
    <!-- 稼动率/达成率图表 -->
    <div class="w-[35%] h-[100%] flex flex-col justify-evenly pb-4px">
      <div v-for="(item, idx) in rateSvgOptions" :key="idx" class="w-[100%] h-[30%] flex flex-center justify-evenly">
        <RateSvg :type="item.type" :value="props.info.rateInfo[item.field]" :tapMth="() => goDetail(item.routeParams)" class="h-[100%]" />
        <div class="w-[35px] text-11px">
          <p v-for="(text, tIdx) in item.textList" :key="tIdx" class="py-2px">
            {{ text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, watch, onMounted, ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { useGo } from '/@/hooks/web/usePage';
  import { chartOptions, metricKeyConfigList } from './config';
  import { convertWeekToDate, objectToQueryParams } from '../../../utils';

  import { Chart } from '/@/components/Chart';
  import { ERateSvgType } from './types';
  import RateSvg from './RateSvg.vue';
  import { getLineSeriiesOptions } from '/@/views/dashboard/utils';

  interface ChartInstance extends InstanceType<typeof Chart> {}

  const go = useGo();
  const props = defineProps<{
    info: any;
    extraParams: any;
    searchFormValue: any;
  }>();

  const rateSvgOptions = computed(() => {
    const { date } = props.searchFormValue;
    return [
      {
        type: ERateSvgType.NUD,
        field: 'IsNudRate',
        textList: ['NUD', '稼动率'],
        routeParams: { isNud: 'true' },
      },
      {
        type: ERateSvgType.NON_NUD,
        field: 'NoNudRate',
        textList: ['非NUD', '稼动率'],
        routeParams: { isNud: 'false' },
      },
      {
        type: ERateSvgType.DAILY_ACHIEVEMENT_RATE,
        field: 'AchievementRate',
        textList: [date.format('MM-DD'), '达成率'],
      },
    ];
  });

  const state = reactive({
    options: {},
  });
  // 给图表组件绑定点击事件
  const chartRef = ref<ChartInstance | null>(null);
  // 给图表绑定事件
  const bindChartClick = chartRef => {
    if (chartRef.value) {
      const instance = chartRef.value.getInstance();
      instance?.on('click', e => {
        const { line = {} } = e.data;
        const { start, end } = convertWeekToDate(line.TimeDate);
        goPage('/dashboard/operate/dieCuttingUtilizationRate', {
          startDate: start,
          endDate: end,
        });
        // 隐藏 tooltips
        instance?.dispatchAction({
          type: 'hideTip',
        });
      });
    }
  };
  onMounted(() => {
    bindChartClick(chartRef);
  });

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const { orgCode = '' } = props.searchFormValue;
    const { tag } = props.extraParams;
    const isNPIMap = {
      ALL: '',
      NPI: true,
      MP: false,
    };
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      isNpi: isNPIMap[tag],
      ...params,
    })}`;
    go(url);
  };

  const goDetail = params => {
    goPage('/dashboard/operate/dieCuttingUtilizationRate', {
      ...params,
      date: props.searchFormValue.date.format('YYYY-MM-DD'),
    });
  };

  watch(
    () => props.info,
    () => {
      const { lineInfo } = props.info;
      const allValues = metricKeyConfigList.reduce((pre, cur) => {
        const { key } = cur;
        const lineValues = lineInfo.map(item => Number.parseFloat(item[key])).filter(item => !Number.isNaN(item));
        return [...pre, ...lineValues];
      }, []);
      const minValue = Math.min(...allValues);
      const handleOptions = {
        xAxis: {
          data: lineInfo.map(item => item.TimeDate.slice(-4)),
        },
        yAxis: {
          min: Number.parseInt(minValue),
        },
        legend: {
          data: metricKeyConfigList.map(item => item.name),
        },
        series: metricKeyConfigList.map(item =>
          getLineSeriiesOptions({
            config: item,
            listData: lineInfo.map(line => ({
              value: line[item.key],
              line,
            })),
          }),
        ),
      };
      state.options = merge(cloneDeep(chartOptions), handleOptions);
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .compo-container {
    width: 100%;
    height: 100%;

    .info-wrapper {
      position: relative;
      width: 100%;
      height: calc(50% - 6px);
      font-size: 12px;
      padding: 12px 0 14px 8px;
      border-radius: 4px;

      .info {
        width: 100%;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .info-title {
        width: 48px;
        font-size: 14px;
      }

      .progress-wrapper {
        position: relative;
        width: 100%;

        .title {
          width: 100%;
        }
      }

      .progress-bar {
        position: relative;
        width: 100%;
        height: 4px;
        background-color: #ccc;
        overflow: hidden;
        text-align: end;

        .title {
          position: absolute;
          top: 0;
          z-index: 2;
        }

        .progress {
          height: 6px;
          background: linear-gradient(270deg, #76c6ff 2.52%, #0ea2ff 100%);
          transition: all 0.5s linear;
          border-radius: 0 2px 2px 0;

          &.process2 {
            background: linear-gradient(91deg, #3969d8 0.7%, #84a8ff 99.58%);
          }
        }
      }
    }

    .chart-wrapper {
      position: relative;
      z-index: 1;
      height: 100%;
    }

    .split {
      width: 60%;
      height: 1px;
      background: linear-gradient(90deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    }

    .split-h {
      width: 1px;
      height: 80%;
      background: linear-gradient(180deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    }
  }
</style>
