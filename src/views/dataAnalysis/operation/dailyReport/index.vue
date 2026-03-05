<!-- 手工数据列表 -->
<template>
  <TableLayout>
    <template #customCell="{ row, column }">
      <CellComponent :row="row" :column="column" :formParams="formParams"></CellComponent>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWeeklyreport } from '/@/api/dataAnalysis/operation';

  import CellComponent from './components/CellComponent.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

  defineOptions({ name: 'dataAnalysis-operation-dailyReport' });

  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: ({ row }) => {
      const { category, metric } = row;
      return category.includes('汇总') || metric.includes('汇总') ? 'bg-yellow' : '';
    },
    proxyConfig: {
      response: {
        list: 'data.list',
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
      isFrontPagination: true,
      customFieldOptions,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startTime, endTime, startDim, endDim, dimension } = getFormParams();
        if (dimension === ETimeDimension.DAY) {
          return {
            filename: `运营日报_${startTime.format('YYYY-MM-DD')}-${endTime.format('YYYY-MM-DD')}`,
          };
        }
        return {
          filename: `运营日报_${startDim}-${endDim}`,
        };
      },
      api: getWeeklyreport,
    },
  });

  const formParams = computed(() => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams?.() ?? {};
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
