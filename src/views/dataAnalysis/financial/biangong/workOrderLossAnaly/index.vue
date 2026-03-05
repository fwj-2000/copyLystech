<!-- 工单损耗分析_页面 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-biangong-workOrderLossAnaly' });
  import { ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, getSyncColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorkOrderLossAnalysis, getWorkOrderLossAnalysisOption, exportWorkOrderLossAnalysis } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const allFilterOptions = ref<TFormItemOption[]>(filterOptions);
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-workOrderLossAnaly-list',

    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
    cellClassName: ({ row }) => {
      if (row.materialFactory === '合计') return 'bg-yellow font-weight-bold';
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
      footerFiled: 'data.total',
      api: async params => {
        const res = await getWorkOrderLossAnalysis({ ...params });
        const allColumns = res.data.hide ? getSyncColumns() : getAllColumns();
        columns.value = allColumns;
        return res;
      },
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        const gridInstance = api.getGridInstance();
        const proxyInfo = gridInstance?.getProxyInfo();
        const { currentPage, pageSize } = proxyInfo?.pager || {};
        openExportModal(true, {
          listQuery: { ...getFormParams(), currentPage, pageSize },
          exportOptions: columns.value.filter(item => item.type !== 'seq'),
          api: exportWorkOrderLossAnalysis,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });

  onMounted(async () => {
    const { state, getFormParams } = api.searchFormApi;
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange],
      () => {
        if (state.searchLoading) return;
        const { orgCode, startDim, endDim, dimension } = getFormParams();
        getDimensionSearchparameterInfo({ orgCode, startDim, endDim, dimension });
      },
      {
        deep: true,
        immediate: false,
      },
    );
  });
  // 获取查询参数信息
  function getDimensionSearchparameterInfo(params) {
    const { state, setState } = api.searchFormApi;

    return getWorkOrderLossAnalysisOption(params).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'auart');
      if (state.formOptions[keyIdx]) {
        const options = data['auart'].map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
      Object.keys(data).forEach(key => {
        const filterIndex = filterOptions.findIndex(item => item.key === key);
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
