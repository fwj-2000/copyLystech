<!-- 分切料头Top列表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getCutMaterialHeadMatnr } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-inventory-cutMaterialTop' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-cutMaterialTop-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.List',
      },
    },
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
      footerFiled: 'data.Total',
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `分切料头_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getCutMaterialHeadMatnr,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
