<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  import { formOptions, getAllColumns, customFieldOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getQuarAchieveInterface } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-custschedul-quarAchieveInterface' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-operate-custschedul-quarAchieveInterface-list',
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      customFieldOptions,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `季度达成_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getQuarAchieveInterface,
    },
  });
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
