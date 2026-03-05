<!-- 人机比 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { formOptions, getAllColumns } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { manmachineratioSummary } from '/@/api/dashbord/operate';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  defineOptions({ name: 'dashboard-operate-humanMachine' });
  // let spanFields: string[] = ['index1', 'index2'];
  const getRowClassName = getRowClassNameFuncByGroupKey('index1');
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-operate-humanMachine-list',
    rowClassName: getRowClassName,
    // rowStyle: getRowStyle,
    // spanMethod({ column, row }) {
    //   // console.log('column', column.field, row);
    //   // console.log('column', column);
    //   if (spanFields.includes(column.field)) {
    //     if (spanFields[0] === column.field && row.index1 == row.index2) {
    //       return { rowspan: 1, colspan: spanFields.length };
    //     }
    //     // return { rowspan: 0, colspan: 0 };
    //   }
    // },
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
        const filename = `人机比_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: manmachineratioSummary,
    },
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
