<template>
  <VxeBasicTable :tableStyle="{ width: '100%' }" class="box">
    <template #buttons>
      <a-button v-auth="'btn_download'" class="ml-3" @click="exportExecl"> {{ t('common.batchExport') }} </a-button>
    </template>
  </VxeBasicTable>

  <ExportModal @register="registerExportModal" />
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { vxeTableFormSchema } from '../../config';
  import { vxeTableColumns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSalesForecastHistory, exportSalesForecastHistory } from '/@/api/customerSerivce/salesForecast';

  import ExportModal from '/@/components/ExportModal/index.vue';

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const { t } = useI18n();

  const [VxeBasicTable] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: vxeTableFormSchema,
      i18nConfig: {
        moduleCode: 'SalesForecastHistoryColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-salesForecast-historicalData-integration-list',
      mouseConfig: {
        area: false, // 是否开启区域选取
        extension: false,
      },
      columns: vxeTableColumns,
      columnConfig: {
        resizable: true,
      },
      height: 'auto',
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      api: getSalesForecastHistory,
      toolbarConfig: {
        export: false,
        print: false,
        slots: { buttons: 'buttons' },
      },
      exportConfig: {
        excludeFields: ['checkbox'],
      },
      scrollY: {
        enabled: true,
        mode: 'wheel',
      },
      scrollX: {
        enabled: true,
      },
      i18nConfig: {
        moduleCode: 'SalesForecastHistoryColumn',
      },
    },
  });

  function exportExecl() {
    openExportModal(true, {
      listQuery: {},
      api: exportSalesForecastHistory,
      exportOptions: vxeTableColumns.slice(2),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SalesForecastHistoryColumn',
      },
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: @primary-color;
    cursor: pointer;
  }

  ::v-deep(.vxe-grid) {
    padding-top: 0;

    .vxe-grid--toolbar-wrapper .vxe-buttons--wrapper *:first-child {
      margin-left: 0;
    }
  }
</style>
