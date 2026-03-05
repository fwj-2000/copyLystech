<template>
  <VxeBasicTable :tableStyle="{ width: '100%' }" class="lydc-basic-table ant-table-cell">
    <template #batchCode="{ row }">
      <span class="table-a" @click="() => showDetail({ batchCode: row.batchCode, mainProcess: row.mainProcess })">
        {{ row.batchCode }}
      </span>
    </template>

    <template #currentNode="{ row }">
      <span v-if="row.currentNode" class="table-a" @click="() => showCurrentNode(row.id)">
        {{ t('common.detailText') }}
      </span>
    </template>
  </VxeBasicTable>

  <NodeModal @register="registercurrentNode" />

  <ExportModal @register="registerExportModal" />

  <Teleport to="#customerServiceFcRequirement">
    <DetailPopup @register="registerDetailPop" @reload="reload" />
  </Teleport>

  <TransferModal @register="registerTransferModal" @reload="reload" />

  <RejectModal @register="registerRejectModal" @reload="reload" />
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { vxeTableColumns, vxeTableFormSchema } from './config';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSalesForecast, transfer, rejectSalesForecast, exportSalesForecast, getNodeList } from '/@/api/business/salesForecast';
  import { MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';

  import { NodeModal, TransferModal, RejectModal } from '/@/components/CustomComponents';
  import DetailPopup from '../detail.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registercurrentNode, { openModal: opencurrentNodeModal }] = useModal();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const { createMessage, createConfirm } = useMessage();

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
        moduleCode: 'SalesForecastColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-salesForecast-requirement-pending-list',
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
      api: (params: any) => getSalesForecast(MODULE_TYPE_ENUM.待产需求, { status: '', ...params }),
      toolbarConfig: {
        export: false,
        print: false,
        buttons: [
          {
            content: t('common.calText'),
            visible: hasBtnP('btn_compute'),
            buttonRender: {
              name: 'AButton',
              // @ts-ignore
              props: { type: 'primary' },
              events: {
                click: handleCompute,
              },
            },
          },
          {
            content: t('common.rejectText'),
            visible: hasBtnP('btn_reject'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: handleReject,
              },
            },
          },
          {
            content: t('common.transfer'),
            visible: hasBtnP('btn_transfer'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: handleTransfer,
              },
            },
          },
          {
            content: t('common.batchExport'),
            visible: hasBtnP('btn_download'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: () => {
                  openExportModal(true, {
                    listQuery: {},
                    api: (query: any) => exportSalesForecast(MODULE_TYPE_ENUM.待产需求, { status: '', ...query }),
                    exportOptions: vxeTableColumns.slice(2),
                    nameProps: 'title',
                    idProps: 'field',
                    i18nConfig: {
                      moduleCode: 'SalesForecastColumn',
                    },
                  });
                },
              },
            },
          },
        ],
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
        moduleCode: 'SalesForecastColumn',
      },
    },
  });

  function showCurrentNode(id: string) {
    opencurrentNodeModal(true, {
      api: getNodeList,
      id: id,
    });
  }

  function showDetail(params: { batchCode?: string; selectedIds?: Array<string>; mainProcess?: string | number }) {
    openDetailPopup(true, { ...params, isCanEdit: true });
  }

  function handleTransfer() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    openTransferModal(true, {
      id: tableRef.grid.getCheckboxRecords() || [],
      submitCallback: ({ remark, transferUser }) => {
        return transfer({ ids: checkedList.map(item => item.id), transferRemark: remark, reviewUserId: transferUser });
      },
    });
  }

  function reload() {
    tableRef!.reload();
  }

  function handleCompute() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    if (new Set(checkedList.map(item => item.batchCode)).size > 1) {
      return createMessage.warning(t('common.selectSameVersionTip'));
    }
    showDetail({ selectedIds: checkedList.map(item => item.id) });
  }

  function handleReject() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.rejectSelectedTip'),
      onOk: () => {
        openRejectModal(true, {
          api: rejectSalesForecast,
          ids: checkedList.map(item => item.id),
        });
        return Promise.resolve();
      },
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: @primary-color;
    cursor: pointer;
  }
</style>
