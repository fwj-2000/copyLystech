<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getIncomereport } from '/@/api/dataAnalysis/revenue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'dataAnalysis-financial-revenue-report' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-revenue-report-list',
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `营收报表${startDim}-${endDim}`;
        return {
          filename,
        };
      },

      api: getIncomereport,
    },
    toolbarConfig: {},
  });
</script>

<style lang="less" scoped></style>
