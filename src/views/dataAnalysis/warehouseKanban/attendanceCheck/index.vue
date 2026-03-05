<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getAttendancedetail } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'warehouseKanban-attendanceCheck' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-warehouseKanban-attendanceCheck-list',
    rowClassName: getRowClassNameFuncByGroupKey('title1'),
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
        const filename = `分仓考勤-${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getAttendancedetail,
    },
  });
</script>

<style lang="less" scoped></style>
