<!-- 手工数据列表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getProfitZif168 } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-profit-zif168' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-zif168-list',
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
        const { startDim, endDim } = getFormParams();
        const filename = `zif168_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getProfitZif168,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .amount-header {
      background-color: #fcf5ed;
    }

    .quantity-header {
      background-color: #d4e0fb;
    }
  }
</style>
