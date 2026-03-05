<!-- By产品线页面 -->
<template>
  <TableLayout>
    <template #toolbarLeft></template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  import type { VxeGridProps } from 'vxe-table';
  import { getAllColumns, formOptions } from './config';

  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getBomdiffreport } from '/@/api/dataAnalysis/financial';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'dataAnalysis-financial-biangong-bomDiffreport' });

  const { t } = useI18n();
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-bomDiffreport-list',
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `${t('routes.dataAnalysis-financial-biangong-bomDiffreport')}${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getBomdiffreport,
    },
  });
</script>
