<template>
  <TableLayout class="biangong-table-layout"></TableLayout>
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { VxeGridProps } from 'vxe-table';

  import { getIncomezsd032, ExportIncomezsd032 } from '/@/api/dataAnalysis/revenue';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';

  import { getAllColumns, formOptions } from './config';

  defineOptions({ name: 'dataAnalysis-financial-revenue-exSalesIncome' });
  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-revenue-exSalesIncome-list',
    filterConfig: {
      remote: true,
    },
    proxyConfig: {
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
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
      api: getIncomezsd032,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: ExportIncomezsd032,
          listQuery: { ...getFormParams() },
          exportOptions: columns.value.slice(1),
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
