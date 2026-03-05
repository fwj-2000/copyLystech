<!-- 2阶明细页 -->
<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { getFcdetailbyitem } from '/@/api/dashbord/report';
  import type { VxeGridProps } from 'vxe-table';
  import { getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  const props = withDefaults(
    defineProps<{
      queryInfo: any;
    }>(),
    {
      queryInfo: {},
    },
  );
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-fcTrend-Infolist',
    toolbarConfig: {
      enabled: false,
    },
    proxyConfig: {
      response: {
        result: 'data.list.list',
        total: 'data.list.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      enabled: false,
      formOptions: [],
    },
    tableConfig: {
      columns,
      attrs,
      api: getFcdetailbyitem,
      getQueryExtraParams: () => {
        const params = props.queryInfo;
        return params;
      },
    },
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-grid--layout-body-wrapper) {
    height: 75vh;
  }
</style>
