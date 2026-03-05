<!-- 工单维度页面 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <ToolBarAction />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, onMounted, computed } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { filterKeyMap, filterOptions } from '../config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimensionWorknopage, getDimensionSearchparameter } from '/@/api/dataAnalysis/financial';

  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

  defineOptions({ name: 'dataAnalysis-financial-biangong-ticketDimension' });

  const allFilterOptions = ref<TFormItemOption[]>(filterOptions);
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-ticketDimension-list',
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
        const filename = `底稿维度_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getDimensionWorknopage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });

  onMounted(() => {
    const { state, getFormParams } = api.searchFormApi;

    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange],
      () => {
        if (state.searchLoading) return;
        getDimensionSearchparameterInfo(getFormParams());
      },
      {
        deep: true,
        immediate: false,
      },
    );
  });

  // 获取查询参数信息
  function getDimensionSearchparameterInfo(params) {
    return getDimensionSearchparameter(params).then(({ data }) => {
      allFilterOptions.value = allFilterOptions.value.map(item => {
        return {
          ...item,
          default: params[item.key] || item.default,
          options: (data[filterKeyMap[item.key]] ?? []).map(item => ({
            text: item,
            value: item,
          })),
        };
      });
    });
  }
</script>
