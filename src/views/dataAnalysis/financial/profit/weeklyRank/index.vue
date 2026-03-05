<!-- 周损益 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarRight>
      <span> 取数时间</span>
      <a-popover placement="right">
        <template #content>
          <p>周三更新周损益，11号更新月损益</p>
        </template>
        <img :src="vectorSvg" width="18px" class="ml-8px" />
      </a-popover>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-profit-weeklyRank' });
  import { reactive, ref, computed } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { getWeekRank } from '/@/api/dataAnalysis/financial';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-weeklyRank-list',
    rowClassName: ({ row }) => {
      if (row.project === '净利润') {
        return 'bg-yellow';
      }
      return '';
    },
    exportConfig: {
      mode: 'current',
      modes: ['current'],
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
      customFieldOptions,
      isFrontPagination: true,
      beforeQuery: () => {
        const { state } = api.searchFormApi;
        columns.value = getAllColumns({ dateRange: state.searchFormValue.dateDim });
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `周损益排名${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getWeekRank,
    },
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .text-red {
      color: red;
    }
  }
  //  公共表头padding
  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
