<!-- 库存计提汇总表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';

  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { getRowStyle } from './utils';

  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getInventoryJtje } from '/@/api/dataAnalysis/financial';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  defineOptions({ name: 'dataAnalysis-financial-inventory-provision' });

  const getRowClassName = getRowClassNameFuncByGroupKey('ProductType');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassName,
    rowStyle: getRowStyle,
    id: 'dataAnalysis-financial-inventory-provision-list',
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `库存计提汇总表_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getInventoryJtje,
    },
  });
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
