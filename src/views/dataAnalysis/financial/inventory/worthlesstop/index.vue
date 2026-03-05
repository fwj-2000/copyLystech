<!-- 报废TOP -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorthlesstTop, getPositionParam } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-inventory-worthlesstop' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-worthlesstop-list',
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
        const filename = `报废TOP_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getWorthlesstTop,
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
  @import url('/@/views/dataAnalysis/style.less');
</style>
