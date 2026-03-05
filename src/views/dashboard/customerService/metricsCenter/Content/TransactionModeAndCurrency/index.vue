<!-- 交易模式&币种 -->
<template>
  <MetricItem title="交易模式&币种" @click-title="goPath('/dashboard/customerService/tradingMode')">
    <MetricContent @register="register">
      <div class="fc-border-sm flex gap-[12px] h-[100%]">
        <template v-if="isNotEmpty">
          <div class="w-[50%] h-[100%] overflow-hidden">
            <PieChart :data="pieChartData1" title="交易模式" @click-legend="value => showDetailModal({ key: 'vmiOrJit', value })" />
          </div>
          <div class="w-[50%] h-[100%]">
            <PieChart :data="pieChartData2" title="币别" @click-legend="value => showDetailModal({ key: 'tradeCurrency', value })" />
          </div>
        </template>
        <emptyData v-else></emptyData>
      </div>
    </MetricContent>
  </MetricItem>
  <a-modal v-model:open="isModalOpen" v-bind="modalAttrs">
    <template #title></template>
    <DetailTable :search-params="searchParams" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcvmiorjitandcurrencylist } from '/@/api/dashbord/fc';

  import DetailTable from './DetailTable.vue';
  import PieChart from './PieChart.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';

  const modalAttrs = {
    width: '80vw',
    bodyStyle: {
      margin: '12px -12px -12px -12px',
    },
    footer: null,
  };
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
  const isModalOpen = ref(false);
  const isNotEmpty = ref(false);
  const searchParams = ref<Record<string, any>>({});
  const pieChartData1 = ref<any[]>([]);
  const pieChartData2 = ref<any[]>([]);

  const [register, { goPath, fetchData, getCommonParams }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcvmiorjitandcurrencylist,
    beforeFetch: () => {
      // 请求前清除值
      pieChartData1.value = [];
      pieChartData2.value = [];
    },
    afterFetch: resData => {
      pieChartData1.value = [
        { color: '#4B7BEC', text: 'VMI', value: resData.VMICount },
        { color: '#46AAF2', text: 'JIT', value: resData.JITCount },
      ];
      pieChartData2.value = [
        { color: '#EFC56C', text: 'CNY', value: resData.CNYCount },
        { color: '#E08D73', text: 'USD', value: resData.USDCount },
      ];
      isNotEmpty.value = Object.values(resData).some(item => item !== 0);
    },
  });

  const showDetailModal = ({ key, value }) => {
    searchParams.value = {
      ...getCommonParams(),
      [key]: value,
    };
    isModalOpen.value = true;
  };

  defineExpose({
    fetchData,
  });
</script>
