<!-- 手工数据列表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getmanualdatapage } from '/@/api/dataAnalysis/fare';
  import { getAllColumns, formOptions, batchMenuItems } from './config';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-expense-manualData' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
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
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startTime, endTime } = getFormParams();
        const filename = `费用手工数据_${startTime}-${endTime}`;
        return {
          filename,
        };
      },
      api: getmanualdatapage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
