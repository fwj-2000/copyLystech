<!-- 结单率车间维度明细 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAllColumns, formOptions } from './config';
  import { closeOrderRateDimens } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  defineOptions({ name: 'dataAnalysis-financial-inventory-workshop' });

  const columns = ref(getAllColumns());
  const getRowClassNameMth = getRowClassNameFuncByGroupKey('WorkShop');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameMth,
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
        const filename = `结单率车间明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: closeOrderRateDimens,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
