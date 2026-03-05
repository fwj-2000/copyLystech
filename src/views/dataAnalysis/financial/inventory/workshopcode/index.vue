<!-- 车间维护 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';

  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorkshopcodeList } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-inventory-workshopcode' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      // isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { date } = getFormParams();
        const filename = `车间维护_${date}}`;
        return {
          filename,
        };
      },
      api: getWorkshopcodeList,
    },
    toolbarConfig: {
      batchMenuItems,
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
