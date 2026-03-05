<!-- 报废库龄 -->
<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-inventory-worthlesslib' });
  import { reactive, ref } from 'vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorthlesslibraryage } from '/@/api/dataAnalysis/financial';

  import { formOptions, getAllColumns } from './config';

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-worthlesslib-list',
  });
  const columns = ref(getAllColumns());
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
        const filename = `报废库龄_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getWorthlesslibraryage,
    },
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
