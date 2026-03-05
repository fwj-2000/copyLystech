<!-- 手工数据列表 -->
<template>
  <TableLayout />
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getfeeDraftPage, feeDraftPageExport } from '/@/api/dataAnalysis/fare';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-expense-draftPage' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-expense-draftPage-list',
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: getfeeDraftPage,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: feeDraftPageExport,
          listQuery: getFormParams(),
          exportOptions: columns.value,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal }] = useModal();
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
