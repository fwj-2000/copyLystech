<!-- 模切KPI页面 -->
<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { formOptions } from './config';
  import { getAllColumns } from '../config';
  import { getDiecutkpiMetricdetail } from '/@/api/dataAnalysis/financial';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import { sortByFieldOrder } from '/@/views/dataAnalysis/utils';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-mqkpi' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-mqkpi-list',
  });
  const { getParams } = useRouteParams();
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
        const filename = `模切KPI_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      getQueryExtraParams: () => {
        const { metric = '' } = getParams();
        return { metric };
      },
      beforeQuery: formParams => {
        columns.value = getAllColumns(formParams);
      },
      api: getDiecutkpiMetricdetail,
      formatFrontData(data) {
        const sortedList = [
          '模切BG',
          '平湖一厂',
          '平湖二厂',
          '平湖三厂',
          '平湖五厂',
          '平湖六厂',
          '平湖七厂',
          '平湖九厂',
          '苏州模切厂',
          '东台模切制二厂',
          '东台模切制三厂',
          '郑州模切厂',
          '成都模切厂',
          '越南模切厂',
          '黄江注塑',
        ];
        const res = sortByFieldOrder(data, 'factory', sortedList);
        return res;
      },
    },
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-cell) {
    height: 32px !important;
  }
</style>
