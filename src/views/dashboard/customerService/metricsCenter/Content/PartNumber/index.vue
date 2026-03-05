<!--  -->
<template>
  <MetricItem>
    <template #title>
      <div class="whitespace-nowrap">
        <span class="font-bold text-hover" @click="goPath('/dashboard/customerService/partNumber', { custprodno: extraFormValue.custprodno })"
          >终端客户料号</span
        >
        <span class="ml-[8px]">
          <a-select v-model:value="extraFormValue.custprodno" v-bind="selectAttrs" style="min-width: 164px">
            <a-select-option v-for="(option, oidx) in custprodnoOptions" :key="oidx" :value="option.value" :title="option.text">
              {{ option.text }}
            </a-select-option>
          </a-select>
        </span>
      </div>
    </template>
    <MetricContent @register="register">
      <div class="fc-border-sm flex h-[calc(100%-12px)]">
        <a-carousel class="w-[100%] h-[100%]" :autoplay="isAutoplay" @mouseover="isAutoplay = false" @mouseout="isAutoplay = true">
          <template #customPaging>
            <div class="w-[64px] h-[64px] bg-[red] dot-span"></div>
          </template>
          <div v-for="(item, idx) in charts" :key="idx" class="h-[100%]">
            <div class="w-[100%] h-[100%] flex">
              <div class="w-[50%] h-[100%] p-[12px]">
                <div class="w-[100%] h-[34px] flex justify-between items-start">
                  <span>{{ item.custprodnoName }}-金额</span>
                  <span>变化率：{{ item.priceChangeRate }}%</span>
                </div>
                <div class="w-[100%] h-[calc(100%-34px)]">
                  <Chart :options="item.options" height="100%" style="height: 100%; width: 100%" />
                </div>
              </div>
              <div class="w-[5%] flex">
                <div class="fc-split-v"></div>
              </div>
              <div class="w-[50%] h-[100%] p-[12px]">
                <div class="w-[100%] h-[34px] flex justify-between items-start">
                  <span>{{ item.custprodnoName }}-数量</span>
                  <span>变化率：{{ item.quantityChangeRate }}%</span>
                </div>
                <div class="w-[100%] h-[calc(100%-34px)]">
                  <Chart :options="item.options2" height="100%" style="height: 100%; width: 100%" />
                </div>
              </div>
            </div>
          </div>
        </a-carousel>
      </div>
    </MetricContent>
  </MetricItem>
</template>

<script lang="ts" setup>
  import { cloneDeep, isEqual, pick } from 'lodash-es';
  import { ref, reactive, unref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfccustprodnolist, getcustprodnobind } from '/@/api/dashbord/fc';
  import { getChartOptions } from './config';
  import { commonSelectAttrs } from '/@/views/dashboard/customerService/components/SearchForm/config';
  import { getLastDimensionNum, getMetricNameByDimension, getDimensionName, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import { Carousel as ACarousel } from 'ant-design-vue';
  import { Chart } from '/@/components/Chart';
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
  let lastFetchProductCategory = {};
  const isAutoplay = ref(true);
  const extraFormValue = reactive({
    custprodno: [],
  });
  const selectAttrs = {
    ...commonSelectAttrs,
    maxTagCount: 2,
    maxTagTextLength: 8,
    dropdownMatchSelectWidth: true,
  };
  const charts = ref<any[]>([]);
  const custprodnoOptions = ref<any[]>([]);

  const [register, { goPath, fetchData, getCommonParams }] = useMetricContent({
    isAutoFetch: false,
    immediateFetch: true,
    componentProps: props,
    fetchApi: fetchMth,
    getParams: commonParams => {
      return {
        ...commonParams,
        // 其他参数
        custprodno: (unref(extraFormValue).custprodno ?? []).join(';'),
      };
    },
    beforeFetch: () => {
      // 请求前清除值
      charts.value = [];
    },
    afterFetch: resData => {
      const dataInfo = removeWeekMonthYear(resData);
      charts.value = dataInfo.map(data => {
        const currentNum = data.Current;
        const { dimension } = props.searchFormValue;
        const lastDimensionNum = getLastDimensionNum({
          dimension,
          currentNum,
        });
        const currentMetricName = getMetricNameByDimension({
          dimension,
          value: currentNum,
        });
        const currentDimensionName = getDimensionName({
          type: 'current',
          dimension,
        });
        const xAxisData = [`${currentMetricName}(${lastDimensionNum}预测)`, `${currentMetricName}(${currentNum}${currentDimensionName})`];
        const maxTextLen = 10;
        const { CustprodnoName } = data;
        const custprodnoName = CustprodnoName.length < maxTextLen ? CustprodnoName : `${CustprodnoName.slice(0, maxTextLen)}...`;
        return {
          custprodnoName,
          quantityChangeRate: data.QuantityChangeRate,
          priceChangeRate: data.PriceChangeRate,
          options: getChartOptions({
            data: [data.PredictPrice, data.ActualPrice],
            options: {
              xAxis: {
                data: xAxisData,
              },
            },
          }),
          options2: getChartOptions({
            data: [data.PredictQuantity, data.ActualQuantity],
            colors: [
              {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#AEAEAE',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 255, 255, 0.45) ',
                  },
                ],
              },
              {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#3969D8',
                  },
                  {
                    offset: 1,
                    color: 'rgba(201, 216, 252, 0.10)',
                  },
                ],
              },
            ],
            options: {
              xAxis: {
                data: xAxisData,
              },
            },
          }),
        };
      });
    },
  });

  async function fetchMth(...args) {
    const requestParams = args;
    const params = pick(getCommonParams(), ['dimension', 'timeIndex', 'customerPerson', 'yearIndex', 'orgCode', 'batchNumber']);
    if (!isEqual(params, lastFetchProductCategory)) {
      lastFetchProductCategory = cloneDeep(params);
      await getcustprodnobind(params).then(res => {
        const resData = res.data as any;
        custprodnoOptions.value = resData.map(item => ({
          value: item.value,
          text: item.value,
        }));
        extraFormValue.custprodno = resData.slice(0, 3).map(item => item.value);
        requestParams[0] = {
          ...requestParams[0],
          custprodno: (unref(extraFormValue).custprodno ?? []).join(';'),
        };
      });
    }
    return getfccustprodnolist(...requestParams);
  }

  defineExpose({
    fetchData,
  });
</script>

<style lang="less" scoped>
  :deep(.slick-slider) {
    width: 100%;
    height: 100%;

    .slick-list {
      height: 100%;
    }

    .slick-track {
      height: 100%;
    }

    .slick-slide {
      height: 100%;

      & > div {
        height: 100%;
      }
    }
  }

  :deep(.slick-dots > .slick-active) {
    width: 16px !important;
  }

  :deep(.slick-dots) {
    bottom: -24px;
  }

  .dot-span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #bcbcbc;
  }

  :deep(.slick-active > .dot-span) {
    background-color: #fff;
    border: 1px solid #bcbcbc;
  }
</style>
