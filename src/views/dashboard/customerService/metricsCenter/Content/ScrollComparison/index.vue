<!-- FC滚动对比 -->
<template>
  <MetricItem>
    <template #title>
      <div class="flex justify-between">
        <div class="flex text-hover font-bold" @click="goPath('/dashboard/customerService/scrollComparison')">FC滚动对比 </div>
        <!-- 图标 -->
        <img :src="chartSvg" class="zoom-icon" @click="goPath('/dashboard/customerService/scrollComparison/trend')" />
      </div>
    </template>
    <MetricContent @register="register">
      <div class="flex flex-col justify-start h-[100%]">
        <div class="w-[100%] h-[24px] flex justify-between items-center">
          <div class="w-[188px] flex-shrink-0 text-[rgba(26,26,26,0.7)]">
            {{ lastWeekPredictTotalTitle }}
          </div>
          <div class="w-[100%] flex-shrink-1">
            <WeekProcess
              class="w-[100%]"
              v-bind="{
                rate: lastWeekPredictProcess,
                color: EProcessColor.GREY,
              }" />
          </div>
          <div class="w-[80px] text-right">
            {{ infoData.lastWeekPredictTotal }}
          </div>
        </div>
        <div class="w-[100%] h-[24px] flex justify-between items-center">
          <div class="w-[188px] flex-shrink-0 text-[rgba(26,26,26,0.7)]">
            {{ currentWeekPredictTotalTitle }}
          </div>
          <div class="w-[100%] flex-shrink-1">
            <WeekProcess
              class="w-[100%]"
              v-bind="{
                rate: currentWeekPredictProcess,
                color: EProcessColor.BLUE,
              }" />
          </div>
          <div class="w-[80px] text-right">
            {{ infoData.currentWeekPredictTotal }}
          </div>
        </div>
        <!-- 图表 -->
        <div class="w-[100%] h-[100%] pt-[6px] flex-shrink-1">
          <div class="w-[100%] h-[100%] flex gap-[12px]">
            <div class="w-[40%] h-[100%] fc-border-sm">
              <BarChart />
            </div>
            <div class="w-[30%] h-[100%] fc-border-sm overflow-hidden">
              <PieChart :data="pieChartData1" title="变化率分布" @click-legend="valueParams => showDetailModal(valueParams, ESpreadSearchType.CHANGE_RATE)" />
            </div>
            <div class="w-[30%] h-[100%] fc-border-sm overflow-hidden">
              <PieChart :data="pieChartData2" title="数量分布" @click-legend="valueParams => showDetailModal(valueParams, ESpreadSearchType.QUANTITY)" />
            </div>
          </div>
        </div>
      </div>
    </MetricContent>
  </MetricItem>
  <a-modal v-model:open="isModalOpen" v-bind="modalAttrs">
    <template #title></template>
    <DetailTable :search-params="searchParams" />
  </a-modal>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, computed, provide } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcrollvslist, getfcrollvschangelist } from '/@/api/dashbord/fc';

  import DetailTable from './DetailTable.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import WeekProcess from './WeekProcess.vue';
  import BarChart from './BarChart.vue';
  import PieChart from './PieChart.vue';
  import { EProcessColor, ESpreadSearchType } from './types';

  const props = defineProps({
    searchFormValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    searchLoading: {
      type: Boolean,
      default: false,
    },
  });
  const defaultInfoData = {
    weekNum1: '',
    weekNum2: '',
    weekNum3: '',
    weekNum4: '',
    lastWeekPredictTotal: 0,
    currentWeekPredictTotal: 0,
    lastWeekPredictQuantity1: '',
    lastWeekPredictQuantity2: '',
    lastWeekPredictQuantity3: '',
    lastWeekPredictQuantity4: '',
    currentWeekActualQuantity: '',
    currentWeekPredictQuantity1: '',
    currentWeekPredictQuantity2: '',
    currentWeekPredictQuantity3: '',
  };
  const infoData = ref(defaultInfoData);
  const isModalOpen = ref(false);
  const searchParams = ref<Record<string, any>>({});
  const fcRollVslistRequestController = ref<Nullable<AbortController>>(null);
  const fcrollVsChangelistRequestController = ref<Nullable<AbortController>>(null);
  const modalAttrs = {
    width: '80vw',
    bodyStyle: {
      margin: '12px -12px -12px -12px',
    },
    footer: null,
  };
  provide('getInfoData', () => infoData.value); // 提供给子孙组件使用
  const [register, { goPath, getCommonParams, fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: fetchMth,
  });
  const pieChartData1 = ref<any[]>([]);
  const pieChartData2 = ref<any[]>([]);

  const lastWeekPredictTotalTitle = computed(() => {
    const { weekNum1, weekNum4 } = infoData.value;
    const current = dayjs().tz().week(Number.parseInt(weekNum1, 10));
    const lastWeek = current.subtract(1, 'week').week();
    return `WK${lastWeek}四周（${weekNum1}-${weekNum4}）`;
  }); // 上周预测四周标题
  const lastWeekPredictProcess = computed(() => {
    const { lastWeekPredictTotal, currentWeekPredictTotal } = infoData.value;
    const lastValue = Number.parseInt(lastWeekPredictTotal, 10);
    const currentValue = Number.parseInt(currentWeekPredictTotal, 10);
    return (lastValue / Math.max(lastValue, currentValue)) * 100;
  }); // 上周预测四周进度条
  const currentWeekPredictTotalTitle = computed(() => {
    const { weekNum1, weekNum4 } = infoData.value;
    return `WK${weekNum1}四周（${weekNum1}实际出货-${weekNum4}）`;
  }); // 本周实际出货+三周预测标题
  const currentWeekPredictProcess = computed(() => {
    const { lastWeekPredictTotal, currentWeekPredictTotal } = infoData.value;
    const lastValue = Number.parseInt(lastWeekPredictTotal, 10);
    const currentValue = Number.parseInt(currentWeekPredictTotal, 10);
    return (currentValue / Math.max(lastValue, currentValue)) * 100;
  }); // 本周实际出货+三周预测进度条

  const beforeFetch = () => {
    // 请求前清空之前的数据
    infoData.value = defaultInfoData;
  };
  // 滚动对比处理
  const afterFetch = resData => {
    infoData.value.lastWeekPredictTotal = Number.parseInt(resData.LastWeekTotal, 10) || 0;
    infoData.value.currentWeekPredictTotal = Number.parseInt(resData.CurrentWeekTotal, 10) || 0;
    infoData.value.weekNum1 = resData.WeekNum1 || '0';
    infoData.value.weekNum2 = resData.WeekNum2 || '0';
    infoData.value.weekNum3 = resData.WeekNum3 || '0';
    infoData.value.weekNum4 = resData.WeekNum4 || '0';
    infoData.value.lastWeekPredictQuantity1 = resData.LastWeekPredictQuantity1 || '0';
    infoData.value.lastWeekPredictQuantity2 = resData.LastWeekPredictQuantity2 || '0';
    infoData.value.lastWeekPredictQuantity3 = resData.LastWeekPredictQuantity3 || '0';
    infoData.value.lastWeekPredictQuantity4 = resData.LastWeekPredictQuantity4 || '0';
    infoData.value.currentWeekActualQuantity = resData.CurrentWeekActualQuantity || '0';
    infoData.value.currentWeekPredictQuantity1 = resData.CurrentWeekPredictQuantity1 || '0';
    infoData.value.currentWeekPredictQuantity2 = resData.CurrentWeekPredictQuantity2 || '0';
    infoData.value.currentWeekPredictQuantity3 = resData.CurrentWeekPredictQuantity3 || '0';
  };
  // 变化率&&数量分布
  const afterFetch2 = resData => {
    pieChartData1.value = [
      { color: '#EFC56C', text: '0~30%', value: resData.ChangeRate1 },
      { color: '#588DB9', text: '-30~0%', value: resData.MinusChangeRate1 },
      { color: '#E08D73', text: '30~60%', value: resData.ChangeRate2 },
      { color: '#EFC56C', text: '-60~-30%', value: resData.MinusChangeRate2 },
      { color: '#58A7B9', text: '60~100%', value: resData.ChangeRate3 },
      { color: '#9346F2', text: '-60~-100%', value: resData.MinusChangeRate3 },
      { color: '#20B787', text: '100~以上', value: resData.ChangeRate4 },
      { color: '#46AAF2', text: '-100%~以下', value: resData.MinusChangeRate4 },
    ];
    pieChartData2.value = [
      { color: '#EFC56C', text: '0~30%', value: resData.MiddleCount1 },
      { color: '#588DB9', text: '30~60%', value: resData.MiddleCount2 },
      { color: '#E08D73', text: '60~100%', value: resData.MiddleCount3 },
      { color: '#EFC56C', text: '100%~以上', value: resData.MiddleCount4 },
    ];
  };

  const getFcRollVsList = params => {
    if (fcRollVslistRequestController.value) {
      fcRollVslistRequestController.value.abort();
      fcRollVslistRequestController.value = null;
    }
    fcRollVslistRequestController.value = new AbortController();
    return getfcrollvslist(params, {
      signal: fcRollVslistRequestController.value?.signal,
    });
  };

  const getFcrollVsChangelist = params => {
    if (fcrollVsChangelistRequestController.value) {
      fcrollVsChangelistRequestController.value.abort();
      fcrollVsChangelistRequestController.value = null;
    }
    fcrollVsChangelistRequestController.value = new AbortController();
    return getfcrollvschangelist(params, {
      signal: fcrollVsChangelistRequestController.value?.signal,
    });
  };

  function fetchMth() {
    beforeFetch();
    const params = getCommonParams();
    return new Promise(async (resolve, reject) => {
      const [res1, res2] = await Promise.allSettled([getFcRollVsList(params), getFcrollVsChangelist(params)]);
      if (res1.status === 'rejected') {
        reject(res1.reason);
        return;
      }
      const resData1 = res1.value.data as any;
      afterFetch(resData1);
      resolve(res1.value); // 记得将结果resolve，处理加载状态

      if (res2.status !== 'rejected') {
        const resData2 = res2.value.data as any;
        afterFetch2(resData2);
      }
    });
  }

  const showDetailModal = ({ min, max }, spreadSearchType) => {
    searchParams.value = {
      ...getCommonParams(),
      spreadSearchType,
      intervalMin: min,
      intervalMax: max,
    };
    isModalOpen.value = true;
  };
  defineExpose({
    fetchData,
  });
</script>
