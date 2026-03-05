<!-- 手工数据列表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getProfitZmm010i } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-profit-zmm010i' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-zmm010i-list',
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
        const filename = `zmm010i_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getProfitZmm010i,
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
