<!-- 时间稼动率组件  -->
<template>
  <div class="compo-container flex">
    <!-- 图表 -->
    <div class="w-[60%] chart-wrapper">
      <Chart ref="chartRef" :options="state.options" height="100%" style="height: 100%; width: 100%" />
    </div>

    <div class="split-h"></div>
    <div class="w-[40%] h-[100%] flex flex-col justify-evenly py-8px">
      <!-- 平板&圆刀 -->
      <div class="info-wrapper flex flex-col justify-evenly items-center items-start">
        <div class="progress-wrapper flex column">
          <p
            class="title text-hover flex justify-between"
            @click="goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', { machineType: '平板' })">
            <span>平板</span>
            <span>{{ props.info.pbJDL }}</span>
          </p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${props.info.pbJDL || '0%'}` }"></div>
          </div>
        </div>
        <div class="progress-wrapper flex column">
          <p
            class="title text-hover flex justify-between"
            @click="goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', { machineType: '圆刀' })">
            <span>圆刀</span>
            <span>{{ props.info.ydJDL }}</span>
          </p>
          <div class="progress-bar">
            <div class="progress process2" :style="{ width: `${props.info.ydJDL || '0%'}` }"></div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="split"></div>
      <!-- NUD&非NUD -->
      <div class="info-wrapper flex flex-col justify-evenly items-start">
        <div class="progress-wrapper flex column">
          <p class="title text-hover flex justify-between" @click="goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', { isNUD: true })">
            <span>NUD</span>
            <span>{{ props.info.NudJDL }}</span>
          </p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${props.info.NudJDL || '0%'}` }"></div>
          </div>
        </div>
        <div class="progress-wrapper flex column">
          <p class="title text-hover flex justify-between" @click="goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', { isNUD: false })">
            <span>非NUD</span>
            <span>{{ props.info.NoNudJDL }}</span>
          </p>
          <div class="progress-bar">
            <div class="progress process2" :style="{ width: `${props.info.NoNudJDL || '0%'}` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch, inject, onMounted, ref } from 'vue';
  import { cloneDeep, merge } from 'lodash-es';
  import { chartOptions, colorStyle, colorStyle2, highlightColor } from './config';

  const go = useGo();
  import { Chart } from '/@/components/Chart';
  import { SearchFormValueType } from '../../../../types';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '../../../utils';
  import dayjs from 'dayjs';

  interface ChartInstance extends InstanceType<typeof Chart> {}
  const props = defineProps<{
    info: any;
    extraParams: any;
  }>();

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
        goPage('/dashboard/operate/oee/detail/timeUtilizationRateAbnormal', { range: e.dataIndex + 1 });
      });
    }
  };
  onMounted(() => {
    bindChartClick(chartRef);
  });

  const getSearchFormValue = inject('getSearchFormValue', () => ({}));

  // 打开新标签页
  const goPage = (path, params = {}) => {
    if (!path) return;
    const { orgCode = '', date = dayjs().tz().subtract(1, 'day') } = getSearchFormValue() as SearchFormValueType;
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode,
      startTime: date.unix() * 1000,
      endTime: date.unix() * 1000,
      isNPI: props.extraParams.isContain === '否' ? 'false' : '',
      ...params,
    })}`;
    go(url);
  };

  watch(
    () => props.info,
    newInfo => {
      const { Lower30, From30To60, From60To80, Upper80 } = newInfo;
      const data = [
        {
          value: Lower30,
          colorStyle: colorStyle2,
        },
        {
          value: From30To60,
          colorStyle: colorStyle,
        },
        {
          value: From60To80,
          colorStyle: colorStyle,
        },
        {
          value: Upper80,
          colorStyle: colorStyle,
        },
      ];
      const handleOptions = {
        xAxis: {
          data: ['低于30%', '30-60%', '60-80%', '80%以上'],
        },
        series: [
          {
            data: data.map(item => ({
              value: item.value === 0 ? null : 0,
              itemStyle: {
                color: item.colorStyle.foot,
              },
            })),
          },
          {
            data: data.map(item => ({
              value: item.value === 0 ? null : item.value,
              itemStyle: {
                color: item.colorStyle.head,
              },
            })),
          },
          {
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                color: highlightColor,
              },
            })),
          },
          {
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                color: item.colorStyle.bar,
              },
            })),
          },
        ],
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
      height: 50%;
      background: linear-gradient(0deg, rgb(255 255 255 / 0%) -22.03%, #e6e6e6 51.69%, rgb(255 255 255 / 0%) 136.44%);
    }
  }
</style>
