<!-- 底稿维度页面 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <ToolBarAction :formParams="formParams" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, batchMenuItems, syncGetColumns } from './config';
  import { filterKeyMap, filterOptions } from '../config';
  import { dimensionCommonFormOptions } from '/@/views/dataAnalysis/financial/config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimensionManuscriptpage, getDimensionSearchparameter } from '/@/api/dataAnalysis/financial';

  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

  defineOptions({ name: 'dataAnalysis-financial-biangong-papersDimension' });

  const allFilterOptions = ref<TFormItemOption[]>(filterOptions);

  const { query } = useRoute();
  const columns = ref(query.paramsId ? syncGetColumns() : getAllColumns());

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-papersDimension-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions: dimensionCommonFormOptions,
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
      api: getDimensionManuscriptpage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });

  const formParams = () => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams();
  };

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
    const { setState } = api.searchFormApi;

    return getDimensionSearchparameter(params).then(({ data }) => {
      Object.keys(data).forEach(key => {
        const filterIndex = filterOptions.findIndex(item => filterKeyMap[item.key] === key);
        if (filterIndex !== -1) {
          const newOptions = data[key].map(val => ({
            text: val,
            value: val,
          }));
          setState(`filterOptions.${filterIndex}.options`, newOptions);
        }
      });
    });
  }
</script>
