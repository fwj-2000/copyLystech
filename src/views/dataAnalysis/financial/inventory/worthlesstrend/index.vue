<!-- 报废趋势 -->
<template>
  <TableLayout></TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-inventory-worthlesstrend' });
  import { isEmpty } from 'lodash-es';
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorthlesstrend, getPositionParam } from '/@/api/dataAnalysis/financial';

  import { formOptions, getAllColumns } from './config';

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-worthlesstrend-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.List',
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
      footerFiled: 'data.Total',
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `报废趋势_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getWorthlesstrend,
    },
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
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim, dimension } = getFormParams();
    getPositionParam({
      orgCode,
      dimension,
      startDim,
      endDim,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'position');
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

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
