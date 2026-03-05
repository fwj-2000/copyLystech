<!-- 结单率明细 -->
<template>
  <TableLayout> </TableLayout>
  <!-- 导出 -->
  <ExportModal @register="registerExportModal" :dataType="1" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useModal } from '/@/components/Modal';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { closeRatePage, closeRateExportData } from '/@/api/dataAnalysis/financial';
  import { downloadByUrl } from '/@/utils/file/download';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-inventory-settlementRate' });

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-settlementRate-list',
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
      api: closeRatePage,
    },
    toolbarConfig: {
      baseExportMethod: () => {
        const { getFormParams } = api.searchFormApi;
        openExportModal(true, {
          api: closeRateExportData,
          listQuery: getFormParams(),
          exportOptions: columns.value,
          nameProps: 'title',
          idProps: 'field',
        });
      },
    },
  });
  // 关闭导出
  function exportAction(query) {
    closeRateExportData(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
