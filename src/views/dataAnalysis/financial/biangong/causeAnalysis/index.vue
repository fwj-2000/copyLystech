<!-- 原因分析页面 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { getAllColumns, formOptions } from './config';

  import type { VxeGridProps } from 'vxe-table';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getAnalysisPage } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-biangong-causeAnalysis' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });

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
        const filename = `原因分析_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getAnalysisPage,
    },
  });
</script>
