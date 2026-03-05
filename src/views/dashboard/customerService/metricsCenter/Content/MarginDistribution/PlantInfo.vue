<!-- 厂区余量信息 -->
<template>
  <div class="w-[100%] h-[100%] overflow-y-scroll no-scrollbar text-[rgba(26,26,26,0.6)]">
    <!-- 单厂排名 -->
    <div v-for="(item, idx) in props.data" :key="idx" :class="['w-[100%] h-[74px] flex items-start justify-start', { 'mb-[8px]': getShowPadding(idx) }]">
      <div class="w-[38px] h-[100%] mr-[6px] flex justify-start">
        {{ item.factoryName }}
      </div>
      <div v-if="getShowPadding(idx)" class="w-[1px] h-[calc(100%+8px)] bg-[#E6E6E6]"> </div>
      <div v-else class="w-[1px] h-[100%] bg-[#E6E6E6]"> </div>
      <div class="w-[100%] h-[100%] flex-shrink-1">
        <div class="w-[100%] h-[100%] flex flex-col justify-start bg-[rgba(0,0,0,0.02)]">
          <div class="w-[100%]">
            <div class="w-[100%] py-[6px] px-2">
              <div class="w-[100%] flex justify-between text-[12px]">
                <span>{{ getMetricName(item.lastNum) }}</span>
                <span class="text-[#1a1a1a]"> {{ thousandsFormat(item.lastValue) }}</span>
              </div>
            </div>
            <div class="w-[100%] h-[10px]">
              <ProcessBar bgClass="process-grey" :value="getProcessValue(item.lastValue, [item.lastValue, item.currentValue])" />
            </div>
          </div>
          <div class="w-[100%]">
            <div class="w-[100%] py-[6px] px-2">
              <div class="w-[100%] flex justify-between text-[12px]">
                <div>
                  <span>{{ getMetricName(item.currentNum) }}</span>
                  <span class="ml-4">
                    <span>变化率</span>
                    <span class="font-bold text-[#1a1a1a] ml-1">
                      {{ item.changeRate }}
                    </span>
                  </span>
                </div>
                <span class="text-[#1a1a1a]">{{ thousandsFormat(item.currentValue) }}</span>
              </div>
            </div>
            <div class="w-[100%] h-[10px]">
              <ProcessBar bgClass="process-yellow" :value="getProcessValue(item.currentValue, [item.lastValue, item.currentValue])" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 单厂排名 end -->
  </div>
</template>

<script lang="ts" setup>
  import { thousandsFormat } from '/@/utils/lydc';
  import { getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import ProcessBar from '/@/views/dashboard/customerService/metricsCenter/Content/Accuracy/ProcessBar.vue';
  import { ETimeDimension } from '/@/views/dashboard/customerService/types';

  const props = defineProps({
    data: {
      type: Array as PropType<Record<string, any>>,
      default: () => [],
    },
    dimension: {
      type: String as PropType<ETimeDimension>,
      default: ETimeDimension.WEEK,
    },
  });

  const getShowPadding = (idx: string) => {
    return Number.parseInt(idx, 10) < props.data.length - 1;
  };

  // 获取进度条百分比
  const getProcessValue = (value: number, allValues) => {
    const maxValue = Math.max(...allValues);
    return Number.parseInt((value / maxValue) * 100, 10);
  };

  const getMetricName = (value: any) => {
    const metricName = getMetricNameByDimension({
      dimension: props.dimension,
      value: value ?? 0,
    });
    return metricName;
  };
</script>
