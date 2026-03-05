<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getChuQinDay } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'warehouseKanban-attendInd' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-warehouseKanban-attendInd-list',
    proxyConfig: {
      response: {
        total: 'data.pagination.total',
        list: 'data.list',
      },
    },
  });

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
        const filename = `出勤指标-${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getChuQinDay,
    },
  });
</script>

<style lang="less" scoped></style>
