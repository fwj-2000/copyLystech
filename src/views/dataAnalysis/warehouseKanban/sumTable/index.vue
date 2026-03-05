<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import { getWarehouseSum } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'warehouseKanban-sumTable' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-warehouseKanban-sumTable-list',
    rowClassName: getRowClassNameFuncByGroupKey('title2'),
    customConfig: {
      // 动态日期列会随查询变化，禁用列顺序缓存，避免旧 sortData 造成乱序
      allowSort: false,
      storage: {
        resizable: true,
        sort: false,
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
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `汇总${startDim}-${endDim}`;
        return {
          filename,
        };
      },

      api: getWarehouseSum,
    },
  });
</script>

<style lang="less" scoped>
  // NOSONAR
</style>
