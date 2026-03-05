<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-16px">
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="init">查询</a-button>
          </template>
        </SearchForm>
        <div class="flex flex-wrap w-full" style="height: calc(100% - 64px)">
          <div class="border-l mb-13px" style="width: calc(50% - 7.5px)">
            <div class="title-box flex flex-row justify-start align-center">
              <div class="left-box">
                <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                <span class="font-bold" style="line-height: 16px">项目直通良率</span>
              </div>
              <!--              <div class="right-box">更新时间: 2025-7-7 12:00:00</div>-->
            </div>
            <div class="pl-16px pr-16px h-full w-full">
              <Chart height="calc(100% - 40px)" style="height: 100%; width: 100%" :options="projectDailyYieldOptions" />
            </div>
          </div>
          <div class="border-r mb-13px" style="width: calc(50% - 7.5px)">
            <div class="title-box flex flex-row justify-start align-center">
              <div class="left-box">
                <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                <span class="font-bold flex" style="line-height: 16px">
                  <p>加权平均良率达成</p>
                  <a-popover placement="right">
                    <template #content>
                      <p>说明：权重为各项目最终工站的投入数占比</p>
                    </template>
                    <img :src="vectorSvg" width="18px" class="ml-8px" />
                  </a-popover>
                </span>
              </div>
              <!--              <div class="right-box">更新时间: 2025-7-7 12:00:00</div>-->
            </div>
            <div class="w-full flex h-[calc(100%-40px)]">
              <div class="h-full w-[40%]">
                <Chart height="calc(100%)" class="h-full w-full" :options="weightedAvgTarYield" />
              </div>
              <div class="h-full w-[60%]">
                <SvgChart :process="yieldAchievementRateProcess" />
              </div>
            </div>
          </div>
          <div class="border-l" style="width: calc(50% - 7.5px)">
            <div class="title-box flex flex-row justify-start align-center">
              <div class="left-box">
                <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                <span class="font-bold" style="line-height: 16px">关键工序良率</span>
              </div>
              <!--              <div class="right-box">更新时间: 2025-7-7 12:00:00</div>-->
            </div>
            <Chart
              ref="keyProcessChartRef"
              :options="keyProcessesYield"
              height="calc(100% - 40px)"
              style="height: 100%; width: 100%"
              @mouseover="stopScroll"
              @mouseout="() => startScroll()" />
          </div>
          <div class="border-r" style="width: calc(50% - 7.5px)">
            <div class="title-box flex flex-row justify-start align-center">
              <div class="left-box">
                <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                <span class="font-bold" style="line-height: 16px">Top Issue Pareto</span>
              </div>
              <!--              <div class="right-box">更新时间: 2025-7-7 12:00:00</div>-->
            </div>
            <Chart :options="topIssuePareto" height="calc(100% - 40px)" style="height: 100%; width: 100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import { Chart } from '/@/components/Chart';
  import { onMounted, ref, toRaw, nextTick } from 'vue';
  import type { EChartsOption } from 'echarts';
  import { merge } from 'lodash-es';
  import { commonOptions, getBaseProjectDailyYieldOptions, getKeyProcessesYield, getTopIssuePareto, getWeightedYieldOptions } from './config';
  // import SvgChart from './SvgChart.vue';
  import SvgChart from './Svg.vue';
  // import SvgChart from './test.vue';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { manmachineratioTrend } from '/@/api/dashbord/operate';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useChartAutoScroll } from './hooks/useChartAutoScroll';
  defineOptions({ name: 'dashboard-vc-overview' });

  const [register, { searchFormValue, searchLoading, api }] = useSearchForm({
    formOptions: commonOptions,
  });
  // 1. 定义 Chart 组件的 ref
  const keyProcessChartRef = ref(null);
  // 2. 使用 Hook，设定窗口大小为 8
  const { start: startScroll, stop: stopScroll } = useChartAutoScroll(keyProcessChartRef, {
    windowSize: 8,
    interval: 2000,
  });

  const projectDailyYieldOptions = ref<EChartsOption>({});
  const weightedAvgTarYield = ref<EChartsOption>({});

  const yieldAchievementRateProcess = ref(0);

  const keyProcessesYield = ref<EChartsOption>({});

  // Top Issue Pareto
  const topIssuePareto = ref<EChartsOption>({});

  async function init() {
    await nextTick();
    await nextTick();

    const params = {
      ...api.getFormParams(),
      dimension: searchFormValue.value.dimension === 'date' ? 'day' : searchFormValue.value.dimension,
    };

    manmachineratioTrend(params).then(({ code, data }) => {
      if (code == 200) {
        const { dailyYieldRate, criticalProcessRate, badItemRate, achievementRate, weightedAvgYield, weightedTargetYield } = data;
        // 左上角 dailyYieldRate
        projectDailyYieldOptions.value = initProjectDailyYield(dailyYieldRate);
        weightedAvgTarYield.value = initWeighted(weightedAvgYield, weightedTargetYield);
        // 右上角 achievementRate
        yieldAchievementRateProcess.value = Number.parseFloat((achievementRate * 100).toFixed(1));
        // 左下角 criticalProcessRate
        keyProcessesYield.value = initKeyProcessesYield(criticalProcessRate);
        // 右下角
        topIssuePareto.value = initTopIssuePareto(badItemRate);
        nextTick(() => {
          const dataLen = data.criticalProcessRate?.length || 0;
          startScroll(dataLen);
        });
      }
    });

    // keyProcessesYield.value = initKeyProcessesYield();
    // topIssuePareto.value = initTopIssuePareto();
  }

  function initWeighted(weightedAvgYield, weightedTargetYield) {
    weightedAvgYield = Number.parseFloat((weightedAvgYield * 100).toFixed(1));
    weightedTargetYield = Number.parseFloat((weightedTargetYield * 100).toFixed(1));

    return merge({}, getWeightedYieldOptions(), {
      xAxis: {
        data: ['加权目标良率', '加权平均良率'],
      },
      series: [{ data: [weightedTargetYield, weightedAvgYield] }],
    });
  }
  function initProjectDailyYield(data) {
    const xAxis: string[] = [];
    const directYieldRate: number[] = [];
    const targetYieldRate: number[] = [];
    data.forEach(item => {
      xAxis.push(item.project);
      directYieldRate.push(Number.parseFloat((item.directYieldRate * 100).toFixed(1)));
      targetYieldRate.push(item.targetYieldRate);
    });
    return merge({}, getBaseProjectDailyYieldOptions(), {
      xAxis: {
        data: xAxis,
      },
      series: [
        { data: directYieldRate },
        // { data: targetYieldRate.length == 1 ? targetYieldRate.push(targetYieldRate[0]) : targetYieldRate }
        { data: targetYieldRate },
      ],
    });
  }

  function initKeyProcessesYield(data) {
    const axisLabelValue = [];
    const seriesData = [];
    // 1. 创建一个 Map 用来存储 "工序名称" -> "良率数值" 的对应关系
    const rateMap = new Map();

    data?.forEach(item => {
      const rateVal = (item.rate * 100).toFixed(1);

      axisLabelValue.push(item.criticalProcess);
      seriesData.push(rateVal);

      // 存入 Map
      rateMap.set(item.criticalProcess, rateVal);
    });
    console.log('===========', seriesData);
    console.log(axisLabelValue, 'axisLabelValueaxisLabelValueaxisLabelValue');
    return merge({}, getKeyProcessesYield(), {
      xAxis: {
        min: Math.min(...seriesData) - 10 >= 0 ? Math.min(...seriesData) - 10 : 0, //取最小值 减10
      },
      yAxis: [
        {
          data: axisLabelValue,
        },
        {
          data: axisLabelValue,
          axisLabel: {
            // 2. 修改 formatter：不使用 index，而是通过 name (value) 去 Map 里找值
            formatter: function (name) {
              // name 就是 '裁大网' 等工序名称
              const rate = rateMap.get(name);
              return (rate || 0.0) + '%';
            },
            // formatter: function (value, index) {
            //   return seriesData[index] + '%';
            // },
          },
        },
      ],
      series: [
        {
          data: seriesData,
        },
      ],
      dataZoom: [
        {
          startValue: 0,
          endValue: 7,
          // end: ((8 / seriesData.length) * 100).toFixed(1) - 0.01,
        },
      ],
    });
  }

  function initTopIssuePareto(data) {
    const xAxis = [];
    const series = [];
    const rate = [];
    const rateRadio = [];
    data.forEach(item => {
      xAxis.push(item.badItem + '\n' + `${Number.parseFloat((item.rateRadio * 100).toFixed(1))}%`);
      series.push(item.number);
      rate.push(Number.parseFloat((item.rate * 100).toFixed(1)));
      // rateRadio.push(parseFloat((item.rateRadio * 100).toFixed(1)));
    });
    return merge({}, getTopIssuePareto(), {
      xAxis: {
        data: xAxis,
      },
      series: [
        { data: series },
        {
          data: rate,
        },
        // {
        //   data: rateRadio,
        // },
      ],
      dataZoom: [
        {
          end: ((8 / data.length) * 100).toFixed(1) - 0.01,
        },
      ],
    });
  }
  onMounted(() => {
    init();
  });
</script>
<style lang="less" scoped>
  @import url('./styles.less');

  :deep(.dashboard-common-search-header .search-form) {
    padding: 0 !important;
  }
</style>
