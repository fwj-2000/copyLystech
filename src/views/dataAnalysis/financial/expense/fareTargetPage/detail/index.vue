<!-- 费用目标 -->
<template>
  <TableLayout>
    <template #toolbarRight></template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { fareAnalyPage, updateTarget } from '/@/api/dataAnalysis/fare';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-expense-fareTargetPage-detail' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-expense-fareTargetPage-detail-list',
    proxyConfig: {
      response: {
        list: 'data.list',
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
      api: async params => {
        const { dimension, ...res } = params;
        return await fareAnalyPage(res);
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startTime, endTime } = getFormParams();
        const filename = `费用目标明细_${startTime}-${endTime}`;
        return {
          filename,
        };
      },
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
