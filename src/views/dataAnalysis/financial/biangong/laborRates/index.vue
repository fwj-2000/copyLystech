<!-- 六码维度页面 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { getAllColumns, formOptions, filterOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';

  import type { VxeGridProps } from 'vxe-table';
  import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import { getFeeTypeList } from '/@/api/dashbord/feeTypeRestore';

  defineOptions({ name: 'dataAnalysis-financial-biangong-laborRates' });

  const allFilterOptions = ref<TFormItemOption[]>(filterOptions);
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
      filterOptions: allFilterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `工费率_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getFeeTypeList,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });
</script>
