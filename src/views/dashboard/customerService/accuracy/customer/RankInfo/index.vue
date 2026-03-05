<!-- 排名榜 -->
<template>
  <div class="w-[100%] h-[100%] bg-[#fff] fc-shadow flex flex-col justify-start items-start">
    <MetricItem>
      <template #title>
        <span class="font-bold">周榜前5大，累计上榜次数</span>
      </template>
      <MetricContent @register="register">
        <div class="w-[100%] h-[100%] overflow-y-auto no-scrollbar">
          <div v-for="(item, idx) in customerList" :key="idx" class="w-[100%] mb-2">
            <div class="flex justify-between mb-[4px] text-[12px]">
              <span>{{ item.name }}</span>
              <span>{{ item.value }}</span>
            </div>
            <div class="w-[100%] h-[10px]">
              <ProcessBar :bgClass="item.bgClass" :value="item.process" />
            </div>
          </div>
        </div>
      </MetricContent>
    </MetricItem>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMetricContent } from '/@/views/dashboard/customerService/hooks/useMetricContent';
  import { getfcmonthandyeartopfive } from '/@/api/dashbord/fc';

  import ProcessBar from './ProcessBar.vue';
  import MetricItem from '/@/views/dashboard/customerService/components/Layout/MetricItem.vue';
  import MetricContent from '/@/views/dashboard/customerService/components/Layout/MetricContent.vue';

  // 客服列表
  const customerList = ref<any[]>([]);
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

  const [register] = useMetricContent({
    immediateFetch: true,
    componentProps: props,
    fetchApi: getfcmonthandyeartopfive,
    afterFetch: (resData: any) => {
      const sortedNameList = Object.keys(resData).sort((a, b) => resData[b] - resData[a]);
      const values = sortedNameList.map((name: any) => Number.parseFloat(resData[name] ?? 0));
      customerList.value = sortedNameList.map(name => {
        const max = Math.max(...values);
        return {
          name,
          value: resData[name],
          process: (Number.parseFloat(resData[name]) / max) * 100,
          bgClass: 'process-blue',
        };
      });
    },
  });
</script>
