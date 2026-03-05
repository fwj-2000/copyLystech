<!-- 人工效率分析_页面 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction :searchFormValue="searchFormValue" />
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { ref, reactive, watch, onMounted, computed } from 'vue';
  import { getAllColumns, formOptions, filterKeyMap } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getlaborEfficiency, getDimensionWordNoSearchparameter } from '/@/api/dataAnalysis/financial';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';
  import ToolBarAction from './ToolBarAction.vue';
  import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-biangong-laborEfficiency' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameFuncByGroupKey('category'),
    id: 'dataAnalysis-financial-biangong-laborEfficiency-list',
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: true,
    },
  });
  const filterOptions = ref<TFormItemOption[]>([]);

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `人工效率分析_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getlaborEfficiency,
    },
  });
  const searchFormValue = computed(() => {
    const { searchFormValue } = api.searchFormApi.state;
    return searchFormValue;
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange, () => state.searchFormValue.dimension],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { immediate: true, deep: true },
    );
    watch(
      [() => state.formOptions],
      () => {
        const { formOptions = [] } = api.searchFormApi.state;
        // const params = getParams();
        const dimensionOptions = (formOptions.find(item => item.key === 'dimensionType') as any)?.options || [];
        filterOptions.value = dimensionOptions.map(({ text: label, value: dimensionType }) => {
          return {
            label,
            type: EFormItemType.INPUT,
            default: '',
            key: filterKeyMap[dimensionType] ?? dimensionType, //接口反的字段不能直接当入参用 只能手动匹配
          };
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim } = getFormParams();
    getDimensionWordNoSearchparameter({
      orgCode,
      startDim,
      endDim,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'workNoType');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }
</script>
