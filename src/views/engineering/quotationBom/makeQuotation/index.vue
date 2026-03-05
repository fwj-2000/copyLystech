<!--
 * @Author: wenzhenjin
 * @Date: 2025-04-01 08:53:11
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-08-05 08:54:53
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\makeQuotation\index.vue
-->
<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, unref, defineAsyncComponent } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid, VxeTableGridOptions } from '/@/adapter/vxe-table';
  import { VxeGridProps } from '/@/effects/plugins/vxe-table/types';
  import {
    getQuotationTomakeList,
    exportQuotationTomake,
    getQuotationMadeList,
    bulkDeleteQuotation,
    transferQuotation,
    exportQuotationMade,
  } from '/@/api/engineering/quotatios';
  import {
    getToMakeColumn,
    getToMakeSchema,
    waitGetColumns,
    waitGetFormConfig,
    doneGetFormConfig,
    doneGetColumns,
  } from '/@/views/engineering/quotationBom/makeQuotation/use-wait-grid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  const DetailPopup = defineAsyncComponent(() => import('../components/DetailPopup.vue'));
  const ExportModal = defineAsyncComponent(() => import('/@/components/ExportModal/index.vue'));
  const NodeModal = defineAsyncComponent(() => import('/@/components/CustomComponents/src/quality/NodeModal.vue'));
  const TransferModal = defineAsyncComponent(() => import('/@/components/CustomComponents/src/TransferModal.vue'));
  const Revocation = defineAsyncComponent(() => import('/@/views/engineering/data/quotationInit/components/Revocation.vue'));

  const { createMessage } = useMessage();
  const { t } = useI18n();

  defineOptions({ name: 'engineering-quotationBom-makeQuotation' });

  enum TabKeyEnum {
    TO_MAKE = '1',
    WAIT = '2',
    DONE = '3',
  }

  enum DataFilterEnum {
    WAIT = 1,
    DONE = 2,
  }

  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();

  const activeKey = ref(TabKeyEnum.TO_MAKE);
  const waitCacheList = ref<any[]>([]);
  const doneCacheList = ref<any[]>([]);

  // Shared configuration to reduce duplication
  const createVxeGridOptions = (id: string, columns: any[], api: any, schema: any, extraOptions: Partial<VxeTableGridOptions> = {}): VxeGridProps => {
    return {
      formOptions: {
        collapsed: true,
        showCollapseButton: true,
        submitOnChange: false,
        submitOnEnter: true,
        commonConfig: {
          componentProps: {},
          labelClass: 'w-0',
        },
        wrapperClass: 'grid grid-cols-5 gap-4',
        schema,
        i18nConfig: {
          moduleCode: 'QuotationColumn',
          transferRange: ['placeholder'],
        },
      },
      gridOptions: {
        id,
        columns: columns as any,
        api: api as any,
        showIndexColumn: true,
        i18nConfig: {
          moduleCode: 'QuotationColumn',
        },
        ...extraOptions,
      },
    };
  };

  const [ToMake, { getSelectRows: toMakeGetSelectRows, reload: toMakeReload, getFetchParams: toMakeFetchParams, getSelectRowKeys: toMakeGetSelectRowKeys }] =
    useVbenVxeGrid(createVxeGridOptions('engineering-quotationBom-makeQuotation-list-tomake', getToMakeColumn(), getQuotationTomakeList, getToMakeSchema()));

  const [Wait, { reload: waitReload, getFetchParams: waitGetFetchParams }] = useVbenVxeGrid(
    createVxeGridOptions('engineering-quotationBom-makeQuotation-list-wait', waitGetColumns(), getQuotationMadeList, waitGetFormConfig(), {
      beforeFetch: params => {
        params.dataFilter = DataFilterEnum.WAIT;
        return params;
      },
      afterFetch: data => {
        waitCacheList.value = data.list;
      },
    }),
  );

  const [Done, { reload: doneReload, getFetchParams: doneGetFetchParams }] = useVbenVxeGrid(
    createVxeGridOptions('engineering-quotationBom-makeQuotation-list-done', doneGetColumns(), getQuotationMadeList, doneGetFormConfig(), {
      beforeFetch: params => {
        params.dataFilter = DataFilterEnum.DONE;
        return params;
      },
      afterFetch: data => {
        doneCacheList.value = data.list;
      },
    }),
  );

  function reloadTable() {
    const reloadMap = {
      [TabKeyEnum.TO_MAKE]: toMakeReload,
      [TabKeyEnum.WAIT]: waitReload,
      [TabKeyEnum.DONE]: doneReload,
    };
    reloadMap[activeKey.value]?.();
  }

  function toMakeGetTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: () => handleToMake(record),
      },
    ];
  }

  function handleToMake(record: any = null) {
    // If record is null, we are handling a bulk action
    const isBulkAction = !record;

    let cacheList: any[] = [];
    if (isBulkAction) {
      const rows = toMakeGetSelectRows().map(item => ({ ...item, applyCode: '' }));
      if (rows.length <= 0) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForProduction'));
      cacheList = rows;
    } else {
      cacheList = [{ ...record, applyCode: '' }];
    }

    openDetailPopup(true, {
      index: 0,
      cacheList: cacheList,
      mode: ModeTypeEnum.EDIT,
      showSubmit: true,
      showDialog: true,
      doNotTemplate: true,
    });
  }

  function handleTransfer() {
    const idList = toMakeGetSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    return await transferQuotation({
      list: id,
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
  };

  async function handleUndoExport() {
    openExportModal(true, {
      api: exportQuotationTomake,
      listQuery: {
        ...(await toMakeFetchParams()),
      },
      exportOptions: getToMakeColumn(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function waitGetTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: () => handleApprove('wait', index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: () => onDelete(row.id),
        },
        tooltip: t('common.deleted'),
      },
    ];
  }

  function handleApprove(source: string, index: number) {
    const isWait = source === 'wait';
    openDetailPopup(true, {
      index,
      mode: isWait ? ModeTypeEnum.EDIT : ModeTypeEnum.VIEW,
      showSubmit: isWait,
      showDialog: isWait,
      cacheList: isWait ? waitCacheList.value : doneCacheList.value,
    });
  }

  function onDelete(id) {
    bulkDeleteQuotation([id]).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
      }
      reloadTable();
    });
  }

  async function handleWaitExport(dataFilter) {
    // Determine which params to use based on filter
    const fetchParams = dataFilter === DataFilterEnum.WAIT ? await waitGetFetchParams() : await doneGetFetchParams();
    openExportModal(true, {
      api: exportQuotationMade,
      listQuery: {
        dataFilter: dataFilter,
        ...fetchParams,
      },
      exportOptions: doneGetColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function doneGetAction(record, index) {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: () => handleRevocation(record),
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: () => handleApprove('done', index),
      },
    ];
  }

  function handleRevocation(record) {
    openFormModal(true, { ...record });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane :key="TabKeyEnum.TO_MAKE" :tab="t('common.waitMadeText')" class="h-full">
            <ToMake>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_edit'" type="primary" @click="handleToMake()">{{ t('dict.DrawingsReview.OriginType.2') }}</a-button>
                  <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                  <a-button v-auth="'btn_download'" @click="handleUndoExport">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template>
              <template #action="{ rowIndex, row }">
                <TableAction outside :actions="toMakeGetTableActions(row)" />
              </template>
            </ToMake>
          </a-tab-pane>
          <a-tab-pane :key="TabKeyEnum.WAIT" :tab="t('dict.Flow.BillStatus.1')">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleWaitExport(DataFilterEnum.WAIT)">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ rowIndex, row }">
                <TableAction outside :actions="waitGetTableActions(row, rowIndex)" />
              </template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane :key="TabKeyEnum.DONE" :tab="t('common.submitted')">
            <Done>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleWaitExport(DataFilterEnum.DONE)">{{ t('views.business.quota.export') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ rowIndex, row }">
                <TableAction outside :actions="doneGetAction(row, rowIndex)" />
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <Revocation @register="registerForm" @reload="reloadTable" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable" />
    <DetailPopup @register="registerDetailPopup" @reload="reloadTable" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
