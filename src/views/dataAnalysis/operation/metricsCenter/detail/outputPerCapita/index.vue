<!-- 原因分析页面 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';

  import type { VxeGridProps } from 'vxe-table';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getPercapitapage } from '/@/api/dataAnalysis/operation';

  defineOptions({ name: 'dataAnalysis-operation-metricsCenter-detail-outputPerCapita' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {},
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `人均产值明细_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getPercapitapage,
    },
  });
</script>
