<!-- VMI库存对照表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { getInventoryVmiCompareCode } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';

  defineOptions({ name: 'dataAnalysis-financial-inventory-comparisonTable' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
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
        const filename = `VMI库存对照_${dateUtil().format('YYYY-MM-DD')}`;
        return {
          filename,
        };
      },
      api: getInventoryVmiCompareCode,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
