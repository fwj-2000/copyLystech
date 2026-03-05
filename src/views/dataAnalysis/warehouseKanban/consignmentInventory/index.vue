<template>
  <TableLayout class="biangong-table-layout" />
  <ExportModal @register="registerExportModal" />
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getConsignmentInventory, ExportConsignmentInventory } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getAllColumns, formOptions } from './config';
  defineOptions({ name: 'warehouseKanban-consignmentInventory' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<Record<string, unknown>>>({
    id: 'warehouseKanban-consignmentInventory-list',
    proxyConfig: {
      response: {
        total: 'data.pagination.total',
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
      api: getConsignmentInventory,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: ExportConsignmentInventory,
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
