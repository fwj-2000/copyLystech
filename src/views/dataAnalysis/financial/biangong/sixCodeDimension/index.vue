<!-- 六码维度页面 -->
<template>
  <TableLayout class="biangong-table-layout"> </TableLayout>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { filterKeyMap, filterOptions } from '../config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimensionSixcodedi, getDimensionSearchparameter } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';
  import { ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

  defineOptions({ name: 'dataAnalysis-financial-biangong-sixCodeDimension' });

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
        const filename = `六码维度_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getDimensionSixcodedi,
    },
  });

  onMounted(() => {
    const { state, getFormParams } = api.searchFormApi;
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange],
      () => {
        if (state.searchLoading) return;
        getDimensionSearchparameterInfo({
          dimension: ETimeDimension.WEEK,
          ...getFormParams(),
        });
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
          options: (data[filterKeyMap[item.key]] ?? []).map(item => ({
            text: item,
            value: item,
          })),
        };
      });
    });
  }
</script>
