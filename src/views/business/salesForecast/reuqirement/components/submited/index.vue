<template>
  <VxeBasicTable :tableStyle="{ width: '100%' }">
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

  <Teleport to="#businessFcRequirement">
    <DetailPopup @register="registerDetailPop" @reload="reload" />
  </Teleport>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { vxeTableColumns, vxeTableFormSchema } from './config';
  import { getSalesForecast, exportSalesForecast, getNodeList, withdrawSalesForecast } from '/@/api/business/salesForecast';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { MODULE_TYPE_ENUM } from '/@/views/business/salesForecast/config';

  import { NodeModal } from '/@/components/CustomComponents';
  import DetailPopup from './detail.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registercurrentNode, { openModal: opencurrentNodeModal }] = useModal();
  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
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
      id: 'business-salesForecast-reuqirement-submit-list',
      mouseConfig: {
        area: false, // 是否开启区域选取
        extension: false,
      },
      columns: vxeTableColumns,
      columnConfig: {
        resizable: true,
      },
      height: 'auto',
      api: (params: any) => getSalesForecast(MODULE_TYPE_ENUM.客户需求, { status: '', ...params }),
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        export: false,
        print: false,
        buttons: [
          {
            content: t('dict.SalesForecast.conversion'),
            visible: hasBtnP('btn_transform'),
            buttonRender: {
              name: 'AButton',
              props: {
                // @ts-ignore
                type: 'primary',
              },
              events: {
                click: handleTransform,
              },
            },
          },
          {
            content: t('common.revoke'),
            visible: hasBtnP('btn_recall'),
            buttonRender: {
              name: 'AButton',
              events: {
                click: handleWithdraw,
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
                    api: (query: any) => exportSalesForecast(MODULE_TYPE_ENUM.客户需求, { status: '', ...query }),
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
      scrollX: {
        enabled: true,
      },
      scrollY: {
        mode: 'wheel',
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

  function reload() {
    tableRef!.reload();
  }

  function handleTransform() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    const batchCodeSet = new Set(checkedList.map(item => item.batchCode));

    if (batchCodeSet.size > 1) {
      return createMessage.warning(t('common.selectSameVersionTip'));
    }
    showDetail({ selectedIds: checkedList.map(item => item.id) });
  }

  function handleWithdraw() {
    const checkedList = tableRef.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.withdrawSelectedData'),
      onOk: () => withdrawSalesForecast(checkedList.map(item => item.id)).catch(),
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: @primary-color;
    cursor: pointer;
  }
</style>
