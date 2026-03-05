<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <ExportModal @register="registerExportModal" />
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getChuQinDetail, ExportChuQinDetail } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  defineOptions({ name: 'warehouseKanban-attendIndDetail' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'warehouseKanban-attendIndDetail-list',
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
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      api: getChuQinDetail,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: ExportChuQinDetail,
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
