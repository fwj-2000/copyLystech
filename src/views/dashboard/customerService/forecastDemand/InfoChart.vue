<!-- 表格 -->
<template>
  <div class="w-[100%] h-[100%] fc-shadow">
    <ForecastDemandRecords ref="componentRef" :searchFormValue="props.searchFormValue" :searchLoading="props.searchLoading">
      <template #title>
        <span class="font-bold">预测需求记录/实际出货</span>
      </template>
    </ForecastDemandRecords>
  </div>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import ForecastDemandRecords from '/@/views/dashboard/customerService/metricsCenter/Content/ForecastDemandRecords/index.vue';

  const componentRef = ref<InstanceType<typeof ForecastDemandRecords>>();
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

  watch(
    [() => props.searchFormValue, () => props.searchLoading],
    () => {
      const { searchLoading } = props;
      if (searchLoading) return; // 搜索条件还在加载中，不发起请求
      componentRef?.value && componentRef?.value?.fetchData();
    },
    {
      deep: true,
      immediate: false,
    },
  );
</script>
