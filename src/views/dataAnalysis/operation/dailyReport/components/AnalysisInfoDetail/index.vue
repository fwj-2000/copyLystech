<!-- 三阶明细页 -->
<template>
  <div class="h-[600px] mt-27px">
    <BaseVxeTable @register="register"> </BaseVxeTable>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { commonColumns, timeUtilizationRateColumns } from './config';
  import { useBaseVxeTable } from '/@/views/dataAnalysis/components/BaseVxeTable/useBaseVxeTable';
  import { getProblemDetail } from '/@/api/dataAnalysis/operation';

  import BaseVxeTable from '/@/views/dataAnalysis/components/BaseVxeTable/index.vue';
  const props = withDefaults(
    defineProps<{
      info: any;
    }>(),
    {
      info: {},
    },
  );
  const columns = computed(() => {
    const { metric } = props.info;
    switch (metric) {
      case '时间稼动率':
        return timeUtilizationRateColumns;
      default:
        return commonColumns;
    }
  });

  const [register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue: ref({}),
    columns: columns,
    attrs: {
      autoResize: false,
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        zoom: false,
        custom: false,
      },
      proxyConfig: {
        response: {
          list: 'data.list',
        },
      },
    },
    getParams: () => {
      return props.info;
    },
    api: getProblemDetail,
  });

  watch(
    () => props.info,
    () => {
      reloadData({});
    },
    {
      deep: true,
    },
  );
</script>
