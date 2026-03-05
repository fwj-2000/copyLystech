<!-- 工单明细 -->
<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <!-- 导出 -->
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useModal } from '/@/components/Modal';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getWorkorderpage, ExportWorkOrder } from '/@/api/dataAnalysis/warehouseKanban';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'warehouseKanban-workOrderDetails' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'warehouseKanban-workOrderDetails-list',
    proxyConfig: {
      response: {
        result: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: getWorkorderpage,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: ExportWorkOrder,
          listQuery: getFormParams(),
          exportOptions: columns.value,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
