<!-- 不良库存在制报表 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getBadInventorySummary } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-inventory-manage-reportBad' });

  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: ({ row }) => {
      const { Title1: metric } = row;
      return metric.includes('合计') ? 'bg-yellow font-weight-bold' : '';
    },
    id: 'dataAnalysis-financial-inventory-reportBad-list',
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
        const filename = `不良库存报表_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getBadInventorySummary,
    },
  });
</script>

<style lang="less" scoped>
  .biangong-table-layout {
    :deep(.vxe-header--column) {
      padding: 0 !important;

      // 合并 一级表头padding
      :deep(tr .col--group) {
        padding: 0 !important;
      }
    }
  }
</style>
