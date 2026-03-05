<!--  -->
<template>
  <MetricItem class="relative">
    <template #title>
      <slot name="title">
        <div class="flex justify-between">
          <span class="font-bold text-hover" @click="goPath('/dashboard/customerService/forecastDemand')">预测需求记录/实际出货</span>
          <a-popover placement="right">
            <template #content> 点击查看操作指引 </template>
            <img :src="vectorSvg" style="margin: 0 0 1px 4px" @click="showInstructions = true" />
          </a-popover>
        </div>
      </slot>
    </template>
    <MetricContent @register="register">
      <div class="flex h-[calc(100%+8px)] mt-[-8px]">
        <PredictChart :infoData="infoData" />
      </div>
    </MetricContent>
    <!-- 操作指引 -->
    <div
      v-if="showInstructions"
      @click="showInstructions = false"
      class="absolute top-0 left-0 w-[100%] h-[100%] z-2 bg-[rgba(0,0,0,0.4)] flex flex-col center">
      <div class="flex mb-[-36px]">
        <img :src="arrowImg" class="w-[160px] h-[78px]" />
        <img :src="arrowImg" class="w-[160px] h-[78px]" style="transform: scaleX(-1)" />
      </div>
      <div style="transform: rotateZ(15deg)">
        <img :src="handImg" class="w-[94px] h-[125px] hand" />
      </div>
      <p class="text-[#fff] mt-[24px]">左右拖动可显示更多</p>
    </div>
  </MetricItem>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcpredictionandcurrentlist } from '/@/api/dashbord/fc';

  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import PredictChart from './PredictChart.vue';
  import handImg from '/@/assets/images/dashbord/hand.png';
  import arrowImg from '/@/assets/images/dashbord/arrow.png';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

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
  const showInstructions = ref(false);
  const infoData = ref<any>({});
  const [register, { goPath, fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcpredictionandcurrentlist,
    getParams: commonParams => ({
      ...commonParams,
      dimension: 'week',
      timeIndex: props.searchFormValue.date.week(),
    }),
    beforeFetch: () => {
      // 请求前清除值
      infoData.value = {};
    },
    afterFetch: resData => {
      infoData.value = resData;
    },
  });

  defineExpose({
    fetchData,
  });
</script>

<style lang="less" scoped>
  .hand {
    transform-origin: 80% 100%;
    animation: slide 1s ease-in-out infinite alternate;
  }
  @keyframes slide {
    from {
      transform: rotateZ(-15deg);
    }

    to {
      transform: rotateZ(15deg);
    }
  }
</style>
