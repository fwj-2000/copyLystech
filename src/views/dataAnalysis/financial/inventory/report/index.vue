<!-- 库存在制报表 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getRowStyle } from './utils';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { getInventorySummary } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-inventory-report' });

  const getRowClassName = getRowClassNameFuncByGroupKey('Title1');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassName,
    rowStyle: getRowStyle,
    id: 'dataAnalysis-financial-inventory-report-list',
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
        const filename = `库存在制报表_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getInventorySummary,
    },
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
