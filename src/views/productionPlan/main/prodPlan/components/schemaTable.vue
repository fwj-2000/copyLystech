<template>
  <Grid>
    <template #toolbar-actions></template>
  </Grid>
</template>

<script lang="ts" setup>
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMoidBillList, exportMoldLedger } from '/@/api/warehouse/moIdBill';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { tabsOptions,  getFormConfig } from './config';

  const [registerExportModal, { openModal: openExportModal }] = useModal(); // 导出弹窗

  const { createMessage, createConfirm } = useMessage();

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      api: getMoidBillList,
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
      showIndexColumn: true,
    },
  });

  const { getSelectRows, getSelectRowKeys, getFetchParams, reload } = gridApi;

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    openExportModal(true, {
      listQuery: { ...params },
      api: exportMoldLedger,
      // exportOptions: handleColumn(tabsOptions[props.type].columns),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
    });
  };
</script>
