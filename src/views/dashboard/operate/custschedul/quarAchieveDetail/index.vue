<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getQuarAchieveInterfaceDetail } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-custschedul-quarAchieveDetail' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-operate-custschedul-quarAchieveDetail-list',
    proxyConfig: {
      response: {
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `季度达成明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getQuarAchieveInterfaceDetail,
    },
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
