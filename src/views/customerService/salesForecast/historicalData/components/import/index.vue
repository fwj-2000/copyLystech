<template>
  <VxeBasicTable :tableStyle="{ width: '100%' }" class="box">
    <template #buttons>
      <a-button v-auth="'btn_edit'" type="primary" class="ml-3" @click="modify"> {{ t('common.updateText') }} </a-button>
      <vShowDropdown class="ml-3">
        <template #overlay>
          <button @click="batchImportOrExport({ key: BUTTON_ENUM.导入 })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
          <button @click="batchImportOrExport({ key: BUTTON_ENUM.导出 })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
        </template>
        <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
      </vShowDropdown>
      <a-button v-auth="'btn_remove'" class="ml-3" @click="batchDelete"> {{ t('common.batchDelText') }} </a-button>
    </template>

    <template #batchCode="{ row }">
      <span class="table-a" @click="() => modifyByBatchCode({ batchCode: row.batchCode })">
        {{ row.batchCode }}
      </span>
    </template>
  </VxeBasicTable>

  <ExportModal @register="registerExportModal" />

  <Teleport to="#customerServiceFcHistoricalData">
    <FormPopup @register="registerFormPop" @reload="reload" />
    <ImportModal @register="registerImportPop" @reload="reload" />
  </Teleport>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BUTTON_ENUM } from './config';
  import { vxeTableColumns, vxeTableFormSchema, FORM_TYPE_ENUM, getDynamicsColumns } from '../../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSalesForecastHistory, exportSalesForecastHistory, bulkDeleteSalesForecastHistory } from '/@/api/customerSerivce/salesForecast';
  import { omit } from 'lodash-es';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './batchImport.vue';
  import FormPopup from '../form.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerFormPop, { openPopup: openFormPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const { createConfirm, createMessage } = useMessage();

  const [VxeBasicTable, tableRef] = useVbenVxeGrid({
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
      id: 'customerService-salesForecast-historicalData-import-list',
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
      api: getTableData,
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

  async function batchImportOrExport({ key }: { key: string }) {
    if (key === BUTTON_ENUM.导入) {
      return openImportPopup(true, {
        importPreviewApi: () => Promise.resolve({}),
        importSaveApi: () => Promise.resolve({}),
        templateApi: () => Promise.resolve({}),
        previewColumn: tableRef.grid.getColumns().map(item => ({
          ...item,
          dataIndex: item.field,
        })),
        usePolling: false,
        pollingParams: {
          interval: 0,
        },
        i18nConfig: {
          moduleCode: 'SalesForecastHistoryColumn',
        },
      });
    } else if (key === BUTTON_ENUM.导出) {
      const params = await tableRef.getFetchParams();
      const { pager } = tableRef.grid.getProxyInfo()!;
      return openExportModal(true, {
        listQuery: { ...params, ...omit(pager, 'total') },
        api: exportSalesForecastHistory,
        exportOptions: tableRef.grid.getColumns().slice(2),
        nameProps: 'title',
        idProps: 'field',
        i18nConfig: {
          moduleCode: 'SalesForecastHistoryColumn',
        },
      });
    }
  }

  function reload() {
    tableRef!.reload();
  }

  function modify() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    openFormPopup(true, {
      type: FORM_TYPE_ENUM.编辑,
      list: checkedList,
    });
  }

  function modifyByBatchCode(params: { batchCode?: string }) {
    openFormPopup(true, { type: FORM_TYPE_ENUM.编辑, ...params });
  }

  async function getTableData(query: any) {
    return getSalesForecastHistory(query).then(res => {
      const { data } = res;
      if (Array.isArray(data?.list) && data.list.length > 0) {
        tableRef.reloadColumn([...vxeTableColumns, ...getDynamicsColumns(data.list[0].importDatas)]);
      }
      return res;
    });
  }

  function batchDelete() {
    const checkList = tableRef.grid.getCheckboxRecords();
    if (checkList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDeleteSalesForecastHistory(checkList.map(item => item.id))
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .catch(e => {
            console.warn('batch delete e:', e);
          })
          .finally(reload),
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }

  ::v-deep(.vxe-grid) {
    padding-top: 0;

    .vxe-grid--toolbar-wrapper .vxe-buttons--wrapper *:first-child {
      margin-left: 0;
    }
  }
</style>
