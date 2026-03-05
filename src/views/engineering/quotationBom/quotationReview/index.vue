<!--
 * @Author: wenzhenjin
 * @Date: 2025-05-20 14:25:17
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-09-05 11:26:30
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\quotationReview\index.vue
-->
<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, unref, nextTick, defineAsyncComponent } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { TableAction } from '/@/components/Table';

  import { useVbenVxeGrid, VxeTableGridOptions } from '/@/adapter/vxe-table';
  import { VxeGridProps } from '/@/effects/plugins/vxe-table/types';
  import { getQuotationMadeList, exportQuotationMade, confirmTransferQuotation } from '/@/api/engineering/quotatios';
  import { waitGetColumns, waitGetFormConfig, doneGetFormConfig, doneGetColumns } from '/@/views/engineering/quotationBom/makeQuotation/use-wait-grid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  const DetailPopup = defineAsyncComponent(() => import('../components/DetailPopup.vue'));
  const ExportModal = defineAsyncComponent(() => import('/@/components/ExportModal/index.vue'));
  const NodeModal = defineAsyncComponent(() => import('/@/components/CustomComponents/src/quality/NodeModal.vue'));
  const TransferModal = defineAsyncComponent(() => import('/@/components/CustomComponents/src/TransferModal.vue'));
  const Revocation = defineAsyncComponent(() => import('/@/views/engineering/data/quotationInit/components/Revocation.vue'));

  defineOptions({ name: 'engineering-quotationBom-quotationReview' });

  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();

  enum TabKeyEnum {
    WAIT = '1',
    DONE = '2',
  }

  enum DataFilterEnum {
    WAIT = 3,
    DONE = 4,
  }

  const activeKey = ref(TabKeyEnum.WAIT);
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

  const [Wait, waitGridApi] = useVbenVxeGrid(
    createVxeGridOptions('engineering-quotationBom-quotationReview-list-wait', waitGetColumns(), getQuotationMadeList, waitGetFormConfig(), {
      beforeFetch: params => {
        params.dataFilter = DataFilterEnum.WAIT;
        return params;
      },
      afterFetch: data => {
        waitCacheList.value = data.list;
      },
    }),
  );
  const { getSelectRows: waitGetSelectRows, reload: waitReload, getSelectRowKeys: waitGetSelectRowKeys, getFetchParams: waitGetFetchParams } = waitGridApi;

  const [Done, doneGridApi] = useVbenVxeGrid(
    createVxeGridOptions('engineering-quotationBom-quotationReview-list-done', doneGetColumns(), getQuotationMadeList, doneGetFormConfig(), {
      beforeFetch: params => {
        params.dataFilter = DataFilterEnum.DONE;
        return params;
      },
      afterFetch: data => {
        doneCacheList.value = data.list;
      },
    }),
  );
  const { reload: doneReload, getFetchParams: doneGetFetchParams } = doneGridApi;

  async function reloadTable() {
    await nextTick();
    const reloadMap = {
      [TabKeyEnum.WAIT]: waitReload,
      [TabKeyEnum.DONE]: doneReload,
    };
    reloadMap[activeKey.value]?.();
  }

  function waitGetTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        // auth: 'btn_detail',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: () => handleApprove(TabKeyEnum.WAIT, index),
      },
    ];
  }

  function handleApprove(source, index, mode = 'edit') {
    if (source === TabKeyEnum.WAIT) {
      // 待提交
      openDetailPopup(true, {
        index: index <= 0 ? 0 : index,
        mode: ModeTypeEnum.EDIT,
        showSubmit: true,
        showDialog: true,
        cacheList: index < 0 ? waitGetSelectRows() : waitCacheList.value,
        showSyncPrice: true,
        showReject: true,
        isReview: true,
      });
    } else if (source === TabKeyEnum.DONE) {
      // 已提交
      openDetailPopup(true, {
        index: index,
        mode: ModeTypeEnum.VIEW,
        cacheList: doneCacheList.value,
        showSyncPrice: true,
      });
    }
  }

  function doneGetAction(record, index) {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: () => handleRevocation(index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_detail',
        onClick: () => handleApprove(TabKeyEnum.DONE, index, 'view'),
      },
    ];
  }

  async function handleExport(dataFilter: DataFilterEnum) {
    const isWait = dataFilter === DataFilterEnum.WAIT;
    const params = isWait ? await waitGetFetchParams() : await doneGetFetchParams();
    const columns = isWait ? waitGetColumns() : doneGetColumns();

    openExportModal(true, {
      api: exportQuotationMade,
      listQuery: {
        dataFilter,
        ...params,
      },
      exportOptions: columns,
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

  function handleRevocation(index) {
    openFormModal(true, { ...doneCacheList.value[index] });
  }

  function handleTransfer() {
    const idList = waitGetSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await confirmTransferQuotation({
      list: id,
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };
</script>
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane :key="TabKeyEnum.WAIT" :tab="t('dict.Flow.BillStatus.1')">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_review'" @click="handleApprove(TabKeyEnum.WAIT, -1, 'view')" type="primary">{{ t('common.audit') }} </a-button>
                  <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                  <a-button v-auth="'btn_download'" @click="handleExport(DataFilterEnum.WAIT)">{{ t('views.business.quota.export') }}</a-button>
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
                  <a-button v-auth="'btn_download'" @click="handleExport(DataFilterEnum.DONE)">{{ t('views.business.quota.export') }} </a-button>
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
    <TransferModal @register="registerTransferModal" @reload="reloadTable" />
    <DetailPopup @register="registerDetailPopup" @reload="reloadTable" />
    <Revocation @register="registerForm" @reload="reloadTable" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
