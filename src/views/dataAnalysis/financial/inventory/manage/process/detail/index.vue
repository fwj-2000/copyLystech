<!-- 制程不良明细_页面 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-inventory-manage-process-detail' });
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getMilbadproppage, getMilbadpropExport, getMilBadPropAuartDmparam } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { isEmpty } from 'lodash-es';

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-manage-process-detail-list',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: async params => {
        const res = await getMilbadproppage({ ...params });
        columns.value = res.data.flag ? getAllColumns().filter(item => item.field !== 'price') : getAllColumns();
        return res;
      },
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          listQuery: { ...getFormParams() },
          exportOptions: columns.value,
          api: getMilbadpropExport,
          nameProps: 'title',
          idProps: 'field',
        });
      },
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
      const keyIdx = formOptions.findIndex(item => item.key === 'auartDm');
      if (state.formOptions[keyIdx]) {
        const options = Object.entries(data).map(([value, text]) => ({
          text: value,
          value,
        }));
        console.log('🚀 ~ getDimensionWordNoSearchparameterInfo ~ options:', options);
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
