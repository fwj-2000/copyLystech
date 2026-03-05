<!-- 补录数据分页   -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { formOptions, getAllColumns, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getHfmdata } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-hfmdata' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
    id: 'dataAnalysis-financial-hfmdata-list',
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
        const { startDim, endDim } = getFormParams();
        const filename = `补录数据_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getHfmdata,
    },
    toolbarConfig: {
      batchMenuItems,
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
