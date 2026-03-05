<!-- 厂区余量分布 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem>
      <template #title>
        <span class="font-bold"> 厂区余量分布 </span>
      </template>
      <MetricContent @register="register">
        <div class="w-[100%] h-[100%] flex justify-start gap-row-3">
          <!-- 金额 -->
          <div class="w-[50%] h-[100%] px-3 py-2 fc-border-sm">
            <div class="w-[100%] h-[16px] flex justify-between items-start">
              <div class="flex justify-start">
                <img :src="outputImg" class="w-[18px] h-[18px] mr-[4px]" />
                <span class="font-bold text-hover" @click="goPath('/dashboard/customerService/marginDistribution/amount')">金额</span>
              </div>
              <div v-if="!isAmountDataEmpty">
                <span> 变化率：</span>
                <span class="font-bold">{{ amountInfo?.changeRate }}</span>
              </div>
            </div>
            <emptyData v-if="isAmountDataEmpty" />
            <template v-else>
              <div class="w-[100%] h-[36px] flex justify-between">
                <DistributionInfo :info="amountInfo" :dimension="props.searchFormValue.dimension" />
              </div>
              <div class="w-[100%] h-[calc(100%-52px)]"> <PlantInfo :data="amountData" :dimension="props.searchFormValue.dimension" /> </div
            ></template>
          </div>
          <!-- 数量 -->
          <div class="w-[50%] h-[100%] px-3 py-2 fc-border-sm">
            <div class="w-[100%] h-[16px] flex justify-between items-start">
              <div class="flex justify-start">
                <img :src="numberImg" class="w-[18px] h-[18px] mr-[4px]" />
                <span class="font-bold text-hover" @click="goPath('/dashboard/customerService/marginDistribution/quantity')">数量</span>
              </div>
              <div v-if="!isQuantityDataEmpty">
                <span> 变化率：</span>
                <span class="font-bold">{{ quantityInfo?.changeRate }}</span>
              </div>
            </div>
            <emptyData v-if="isQuantityDataEmpty" />
            <template v-else>
              <div class="w-[100%] h-[36px] flex justify-between">
                <DistributionInfo :info="quantityInfo" :dimension="props.searchFormValue.dimension" />
              </div>
              <div class="w-[100%] h-[calc(100%-52px)]">
                <PlantInfo :data="quantityData" :dimension="props.searchFormValue.dimension" />
              </div>
            </template>
          </div>
        </div>
      </MetricContent>
    </MetricItem>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcfactorymarginlist } from '/@/api/dashbord/fc';
  import { removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import PlantInfo from './PlantInfo.vue';
  import DistributionInfo from './DistributionInfo.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import outputImg from '/@/assets/icons/fc/output.png';
  import numberImg from '/@/assets/icons/fc/number.png';

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

  interface IBaseInfo {
    lastNum: number;
    currentNum: number;
    lastValue: number;
    currentValue: number;
    changeRate: string;
  }
  interface IPlantInfoData extends IBaseInfo {
    factoryName: string;
  }

  const amountInfo = ref<IBaseInfo>();
  const amountData = ref<IPlantInfoData[]>([]);
  const quantityInfo = ref<IBaseInfo>();
  const quantityData = ref<IPlantInfoData[]>([]);
  const isAmountDataEmpty = computed(() => isEmpty(amountData.value));
  const isQuantityDataEmpty = computed(() => isEmpty(quantityData.value));

  const [register, { goPath, fetchData }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcfactorymarginlist,
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      // 金额
      const amountList = dataInfo.FactoryPrice ?? {};
      amountInfo.value = {
        lastNum: dataInfo.LastNum,
        currentNum: dataInfo.CurrentNum,
        lastValue: Number.parseInt(dataInfo.LastMarginPriceCount, 10),
        currentValue: Number.parseInt(dataInfo.CurrentMarginPriceCount, 10),
        changeRate: `${Number.parseFloat(dataInfo.ChangeRatePrice).toFixed(1)}%`,
      };
      amountData.value = Object.values(amountList).map((item: any) => {
        return {
          factoryName: item.FactoryName,
          lastNum: item.LastNum,
          currentNum: item.CurrentNum,
          lastValue: Number.parseInt(item.LastPriceCount, 10),
          currentValue: Number.parseInt(item.CurrentPriceCount, 10),
          changeRate: `${Number.parseFloat(item.ChangeRatePrice).toFixed(1)}%`,
        };
      });
      // 数量
      const quantityList = dataInfo.FactoryCount ?? {};
      quantityInfo.value = {
        lastNum: dataInfo.LastNum,
        currentNum: dataInfo.CurrentNum,
        lastValue: Number.parseInt(dataInfo.LastMarginQuantityCount, 10),
        currentValue: Number.parseInt(dataInfo.CurrentMarginQuantityCount, 10),
        changeRate: `${Number.parseFloat(dataInfo.ChangeRateCount).toFixed(1)}%`,
      };
      quantityData.value = Object.values(quantityList).map((item: any) => {
        return {
          factoryName: item.FactoryName,
          lastNum: item.LastNum,
          currentNum: item.CurrentNum,
          lastValue: Number.parseInt(item.LastQuantityCount, 10),
          currentValue: Number.parseInt(item.CurrentQuantityCount, 10),
          changeRate: `${Number.parseFloat(item.ChangeRateCount).toFixed(1)}%`,
        };
      });
    },
  });
  defineExpose({
    fetchData,
  });
</script>

<style lang="less" scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
</style>
