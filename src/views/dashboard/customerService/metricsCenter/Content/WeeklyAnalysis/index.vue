<!-- FC当周分析 -->
<template>
  <MetricItem :title="title" @click-title="goDetail()">
    <MetricContent @register="register">
      <div class="fc-border-sm flex h-[100%]">
        <div class="w-[100%] h-[100%] flex justify-between items-center p-12px">
          <div class="w-[50%] h-[100%] flex flex-col justify-between items-start pr-[18px]">
            <div class="w-[100%] mb-[12px] flex justify-start">
              <img :src="outputImg" class="w-[18px] h-[18px] mr-[4px]" />
              <span>金额（万）</span>
            </div>
            <div class="w-[100%]">
              <div class="mb-[-6px] flex justify-between">
                <div>{{ lastMetrcTitle }}</div>
                <div>{{ infoData.lastPrice }}</div>
              </div>
              <AmountProcess :rate="lastAmountRate" class="h-[44px] w-[100%]" />
            </div>
            <div class="w-[100%]">
              <div class="mb-[-6px] flex justify-between">
                <div>{{ currentMetrcTitle }}</div>
                <div>{{ infoData.currentPrice }}</div>
              </div>
              <AmountProcess
                class="h-[44px] w-[100%]"
                v-bind="{
                  rate: amountRate,
                  color: EAmountColor.YELLOW,
                }" />
            </div>
            <div class="w-[100%] mb-[16px]">
              <div class="mb-[-12px] flex justify-start items-center">
                <span>变化率</span>
                <img :src="decorateSvg" class="h-[14px] mt-[2px]" />
                <span :style="`${Math.abs(parseInt(infoData.changeRatePrice, 10)) > 30 ? 'color:#E72525' : ''}`">{{ infoData.changeRatePrice }}%</span>
              </div>
            </div>
          </div>
          <div class="fc-split-v flex-shrink-0"></div>
          <div class="w-[50%] h-[100%] flex flex-col justify-between items-start pl-[18px]">
            <div class="w-[100%] mb-[12px] flex justify-start">
              <img :src="numberImg" class="w-[18px] h-[18px] mr-[4px]" />
              <span>数量（K）</span>
            </div>
            <div class="w-[100%]">
              <div class="mb-[-6px] flex justify-between">
                <div>{{ lastMetrcTitle }}</div>
                <div>{{ infoData.lastQuantity }}</div>
              </div>
              <Process
                class="h-[44px] w-[100%]"
                v-bind="{
                  rate: lastNumRate,
                  color: ENumberColor.GREY,
                }" />
            </div>
            <div class="w-[100%]">
              <div class="mb-[-6px] flex justify-between">
                <div>{{ currentMetrcTitle }}</div>
                <div>{{ infoData.currentQuantity }}</div>
              </div>
              <Process class="h-[44px] w-[100%]" :rate="numRate" />
            </div>
            <div class="w-[100%] mb-[16px]">
              <div class="mb-[-12px] flex justify-start items-center">
                <span>变化率</span>
                <img :src="decorateSvg" class="h-[14px] mt-[2px]" />
                <span :style="`${parseInt(infoData.changeRateQuantity, 10) > 30 ? 'color:#E72525' : ''}`">{{ infoData.changeRateQuantity }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MetricContent>
  </MetricItem>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcdataanalysislist } from '/@/api/dashbord/fc';
  import { getMetricNameByDimension, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import { ENumberColor, EAmountColor } from './types';
  import outputImg from '/@/assets/icons/fc/output.png';
  import numberImg from '/@/assets/icons/fc/number.png';
  import decorateSvg from '/@/assets/svg/fc/decorate.svg';
  import Process from './Process.vue';
  import AmountProcess from './AmountProcess.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';

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
    currentNum: '',
    lastNum: '',
    currentPrice: '',
    currentQuantity: '',
    lastQuantity: '',
    lastPrice: '',
    changeRatePrice: '',
    changeRateQuantity: '',
  };
  const infoData = ref<{
    currentNum: string;
    lastNum: string;
    currentPrice: string | number;
    currentQuantity: string | number;
    lastQuantity: string | number;
    lastPrice: string | number;
    changeRatePrice: string | number;
    changeRateQuantity: string | number;
  }>(defaultInfoData);
  const title = computed(() => {
    const { dimension } = props.searchFormValue;
    const titleMap = {
      week: 'FC当周分析',
      month: 'FC当月分析',
      year: 'FC当年分析',
    };
    return titleMap[dimension] ?? 'FC分析';
  });
  const lastMetrcTitle = computed(() => {
    const { dimension } = props.searchFormValue;
    return getMetricNameByDimension({
      dimension,
      value: infoData.value.lastNum,
    });
  });
  const currentMetrcTitle = computed(() => {
    const { dimension } = props.searchFormValue;
    return getMetricNameByDimension({
      dimension,
      value: infoData.value.currentNum,
    });
  });
  const lastAmountRate = computed(() => {
    const { currentPrice, lastPrice } = infoData.value;
    const lastValue = Number.parseFloat(lastPrice);
    const currentValue = Number.parseFloat(currentPrice);
    return (lastValue / Math.max(lastValue, currentValue)) * 100;
  });
  const amountRate = computed(() => {
    const { currentPrice, lastPrice } = infoData.value;
    const lastValue = Number.parseFloat(lastPrice);
    const currentValue = Number.parseFloat(currentPrice);
    return (currentValue / Math.max(lastValue, currentValue)) * 100;
  });
  const lastNumRate = computed(() => {
    const { currentQuantity, lastQuantity } = infoData.value;
    const lastValue = Number.parseFloat(lastQuantity);
    const currentValue = Number.parseFloat(currentQuantity);
    return (lastValue / Math.max(lastValue, currentValue)) * 100;
  });
  const numRate = computed(() => {
    const { currentQuantity, lastQuantity } = infoData.value;
    const lastValue = Number.parseFloat(lastQuantity);
    const currentValue = Number.parseFloat(currentQuantity);
    return (currentValue / Math.max(lastValue, currentValue)) * 100;
  });

  const [register, { goPath, fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcdataanalysislist,
    beforeFetch: () => {
      // 请求前清除值
      infoData.value = defaultInfoData;
    },
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      infoData.value = {
        currentNum: dataInfo.CurrentNum,
        lastNum: dataInfo.LastNum,
        currentPrice: formatValue(dataInfo.CurrentPrice, 2),
        lastPrice: formatValue(dataInfo.LastPrice, 2),
        lastQuantity: formatValue(dataInfo.LastQuantity, 2),
        currentQuantity: formatValue(dataInfo.CurrentQuantity, 2),
        changeRatePrice: formatValue(dataInfo?.ChangeRatePrice, 1),
        changeRateQuantity: formatValue(dataInfo?.ChangeRateQuantity, 1),
      }; // 赋值到infoData中
    },
  });

  // 去详情页
  const goDetail = () => {
    // 构造路由参数
    const url = `/dashboard/customerService/weeklyAnalysis`;
    goPath(url);
  };

  function formatValue(value, digit = 1) {
    if (!value) {
      return 0;
    }
    return Number.parseFloat(value ?? 0).toFixed(digit);
  }

  defineExpose({
    fetchData,
  });
</script>
