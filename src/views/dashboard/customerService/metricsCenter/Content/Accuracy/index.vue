<!-- FC准确率 -->
<template>
  <MetricItem>
    <template #title>
      <div class="flex justify-between">
        <div class="flex">
          <div class="mr-24px">
            <span class="mr-12px font-bold">FC准确率</span>
            <span v-if="`${infoData.fcAccuracy}`" class="font-bold">{{ infoData.fcAccuracy }}%</span>
          </div>
          <div v-if="infoData.vmiUseWeek" class="text-[14px]">
            <span>VMI可用周数：</span>
            <span>{{ infoData.vmiUseWeek }}</span>
            <span>周</span>
          </div>
        </div>
        <!-- 图标 -->
        <img :src="chartSvg" class="zoom-icon" @click="goPath('/dashboard/customerService/accuracy/trend')" />
      </div>
    </template>
    <MetricContent @register="register">
      <div class="h-[100%] flex gap-12px px-8px py-12px fc-border-sm">
        <!-- 左侧 -->
        <div class="w-[138px] h-[100%]">
          <div class="h-[24px] flex justify-start items-center">
            <span class="mr-[12px]">变化率</span>
            <img :src="decorateSvg2" class="h-[12px] mx-[-20px] mt-[2px]" />
            <span class="ml-[12px]" :style="`${parseInt(infoData.changeRate, 10) > 30 ? 'color:#E72525' : ''}`">{{ infoData.changeRate }}%</span>
          </div>
          <div class="h-[calc(100%-42px)]">
            <BarChart :data="barChartData" />
          </div>
          <div class="h-[18px] flex justify-evenly text-[13px] text-[#1A1A1A] opacity-60 text-center">
            <span>({{ lastNum }}预测)</span>
            <span>({{ infoData.currentNum }}当前)</span>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="w-[100%] h-[100%] flex-shrink-1 h-[100%] bg-[rgba(0,0,0,0.02)]">
          <div class="w-[100%] h-[100%] flex gap-12px px-[16px] py-[12px]">
            <!-- 客服 -->
            <div class="w-[50%] h-[100%]">
              <div class="font-bold h-[24px] text-hover" @click="goPath('/dashboard/customerService/accuracy/customer')">客服</div>
              <div class="w-[100%] h-[calc(100%-24px)] flex flex-col justify-between">
                <div v-for="(item, idx) in serviceStaffList" :key="idx" class="w-[100%]">
                  <div class="flex justify-between mb-[4px] text-[12px]">
                    <span>{{ item.name }}</span>
                    <span>{{ item.value }}%</span>
                  </div>
                  <div class="w-[100%] h-[10px]">
                    <ProcessBar :bgClass="item.bgClass" :value="item.process" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 客戶 -->
            <div class="w-[50%] h-[100%]">
              <div class="font-bold h-[24px] text-hover" @click="goPath('/dashboard/customerService/accuracy/client')">客戶</div>
              <div class="w-[100%] h-[calc(100%-24px)] flex flex-col justify-between">
                <div v-for="(item, idx) in customerList" :key="idx" class="w-[100%]">
                  <div class="flex justify-between mb-[4px] text-[12px]">
                    <span>{{ item.name }}</span>
                    <span>{{ item.value }}%</span>
                  </div>
                  <div class="w-[100%] h-[10px]">
                    <ProcessBar :bgClass="item.bgClass" :value="item.process" />
                  </div>
                </div>
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
  import { getfcdataaccuracylist } from '/@/api/dashbord/fc';
  import { getLastDimensionNum, getMetricNameByDimension, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import ProcessBar from './ProcessBar.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import BarChart from './BarChart.vue';
  import chartSvg from '/@/assets/svg/report/chart.svg';
  import decorateSvg2 from '/@/assets/svg/fc/decorate2.svg';

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
  // 客服
  const serviceStaffList = ref<any[]>([]);
  // 客户
  const customerList = ref<any[]>([]);
  const defaultInfoData = {
    fcAccuracy: '',
    vmiUseWeek: '',
    changeRate: '',
    currentNum: '',
  };
  const infoData = ref<any>(defaultInfoData);
  const barChartData = ref<any[]>([]);
  const lastNum = computed(() => {
    const { dimension } = props.searchFormValue;
    return getLastDimensionNum({
      dimension,
      currentNum: infoData.value.currentNum,
    });
  });

  const [register, { goPath, fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcdataaccuracylist,
    beforeFetch: () => {
      // 请求前清除值
      serviceStaffList.value = [];
      customerList.value = [];
      infoData.value = defaultInfoData;
      barChartData.value = [];
    },
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      const maxServiceQuantity = Math.max(...dataInfo.CustomerServicePerson.map((item: any) => item.CustomerServiceQuantity));
      serviceStaffList.value = dataInfo.CustomerServicePerson.map((item, idx) => {
        return {
          name: item.CustomerServiceName,
          value: Number.parseInt(item.CustomerServiceQuantity, 10),
          process: Number.parseInt((item.CustomerServiceQuantity / maxServiceQuantity) * 100, 10),
          bgClass: idx === 0 ? 'process-yellow' : 'process-blue',
        };
      });
      const maxClientQuantity = Math.max(...dataInfo.ClientPerson.map((item: any) => item.ClientQuantity));
      customerList.value = dataInfo.ClientPerson.map((item, idx) => {
        return {
          name: item.ClientName,
          value: Number.parseInt(item.ClientQuantity, 10),
          process: Number.parseInt((item.ClientQuantity / maxClientQuantity) * 100, 10),
          bgClass: idx === 0 ? 'process-yellow' : 'process-purple',
        };
      });
      infoData.value = {
        fcAccuracy: dataInfo.FCAccuracy,
        vmiUseWeek: Number.parseFloat(dataInfo.VMIUse).toFixed(1),
        changeRate: dataInfo.ChangeRate,
        currentNum: dataInfo.CurrentNum,
      };
      const { dimension } = props.searchFormValue;
      const currentMetricName = getMetricNameByDimension({
        dimension,
        value: infoData.value.currentNum,
      });
      barChartData.value = [
        { name: `${currentMetricName}`, value: Number.parseInt(dataInfo.PredictionNumQuantity, 10) },
        { name: `${currentMetricName}`, value: Number.parseInt(dataInfo.ActualNumQuantity, 10) },
      ];
    },
  });
  defineExpose({
    fetchData,
  });
</script>
