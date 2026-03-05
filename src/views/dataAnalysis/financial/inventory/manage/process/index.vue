<!-- 制程不良_页面 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-inventory-manage-process' });
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getMilbadpropindex, getMilBadPropAuartDmparam } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  import { isEmpty } from 'lodash-es';

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-manage-process-list',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
      },
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      footerFiled: 'data.total',
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `制程不良_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getMilbadpropindex,
    },
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange, () => state.searchFormValue.dimension],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      {
        deep: true,
        immediate: true,
      },
    );
  });
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim, dimension } = getFormParams();
    getMilBadPropAuartDmparam({
      orgCode,
      startDim,
      endDim,
      dimension,
    }).then(({ data }) => {
      console.log('🚀 ~ getDimensionWordNoSearchparameterInfo ~ data:', data);
      const keyIdx = formOptions.findIndex(item => item.key === 'auartDm');
      if (state.formOptions[keyIdx]) {
        const options = Object.entries(data).map(([value, text]) => ({
          text,
          value,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }
</script>
<style lang="less" scoped>
  //  公共表头padding
  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
