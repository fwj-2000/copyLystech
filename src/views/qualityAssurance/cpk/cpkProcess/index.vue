<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { waitGetColumns, waitGetSchema } from './config';
  import {
    postCPKArchive,
    postCPKCancelArchive,
    postCpkDetail,
    postCpkExportProgress,
    postCpkProgress,
    postCpkReject,
    postCpkRemind,
    postCpkTransfer,
    postPushToSap,
  } from '/@/api/qualityAssurance/cpk';
  import { usePopup } from '/@/components/Popup';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AttachList from '/@/views/qualityAssurance/cpk/cpkUploadReport/components/AttachList.vue';
  import { NodeModal, RejectModal, TransferModal } from '/@/components/CustomComponents';
  import Revocation from '../cpkUploadReport/components/Revocation.vue';
  import ReviewPopup from './components/ReviewPopup.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import PushRecords from './components/PushRecords.vue';

  defineOptions({ name: 'qualityAssurance-cpk-cpkProcess' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerUploadPopup, { openPopup: openUploadPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerAttach, { openModal: openAttachModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerReviewPopup, { openPopup: openReviewPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerPushRecords, { openModal: openPushRecords }] = useModal();

  const { createMessage } = useMessage();

  const state = reactive<Record<string, any>>({
    activeKey: '1',
    waitCacheList: [],
    doneCacheList: [],
    index: 0,
  });

  const { activeKey } = toRefs(state);

  const [
    Wait,
    {
      reload: waitReload,
      getSelectRowKeys: waitGetSelectRowKeys,
      setLoading: waitSetLoading,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      getSelectRows: waitGetSelectRows,
      getFetchParams: waitGetFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-reivew-list-wait',
      columns: waitGetColumns(),
      api: postCpkProgress,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 1,
        };
      },
    },
  });

  const [Done, doneGrid] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-reivew-list-done',
      columns: waitGetColumns(),
      api: postCpkProgress,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 2,
        };
      },
    },
  });

  const {
    reload: doneReload,
    getSelectRowKeys: doneGetSelectRowKeys,
    setLoading: doneSetLoading,
    clearSelectedRowKeys: doneClearSelectedRowKeys,
    getSelectRows: doneGetSelectRows,
    getFetchParams: doneGetFetchParams,
  } = doneGrid;

  function reloadTable() {
    if (state.activeKey == 1) {
      waitReload();
    } else if (state.activeKey == 2) {
      doneReload();
    }
  }

  function handleUpload() {
    const rows = waitGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openUploadPopup(true, rows);
  }

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  function handleAttachmentModal(row) {
    postCpkDetail([row.id]).then(({ code, data }) => {
      if (code !== 200) return;
      openAttachModal(true, {
        ...data,
        mode: 'view',
      });
    });
  }

  function handleProcess() {
    const rows = waitGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    postCpkRemind(rows.map(item => item.id)).then(({ code, msg }) => {
      if (code !== 200) return createMessage.error(msg);
      createMessage.success(msg);
      reloadTable();
    });
  }

  function handleTransfer(id = '') {
    const idList = waitGetSelectRows();
    if (!idList.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const r = await postCpkTransfer({
      list: waitGetSelectRows().map(item => item.id),
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  function handleReject() {
    const rows = waitGetSelectRows();
    if (rows.length === 0) return createMessage.warning(t('dict.Common.pleaseSelectTheDataToBeRejected'));
    return openRejectModal(true, {
      api: postCpkReject,
      ids: rows,
    });
  }

  function handleRevocation() {
    const rows = doneGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openFormModal(true, {
      id: rows.map(item => item.id),
    });
  }

  //导出
  async function handleExport(dataFilter) {
    openExportModal(true, {
      api: postCpkExportProgress,
      listQuery: {
        ...(dataFilter == 1 ? await waitGetFetchParams() : await doneGetFetchParams()),
        dataFilter,
      },
      exportOptions: waitGetColumns(),
      nameProps: 'title',
      idProps: 'field',
      // i18nConfig: {
      //   moduleCode: 'FactorySapColumn',
      // },
    });
  }

  function handlePushRecords(row) {
    openPushRecords(true, {
      woId: row.woId,
    });
  }

  function handlePushSAP(tag) {
    let rows;
    if (tag === 'wait') {
      rows = waitGetSelectRowKeys();
    } else {
      rows = doneGetSelectRowKeys();
    }
    postPushToSap(rows).then(({ code, msg }) => {
      if (code == 200) {
        doneReload();
        createMessage.success(msg);
      }
    });
  }

  function handleDataArchiving() {
    const rowKeys = doneGetSelectRows().map(item => item.id);
    if (isEmpty(rowKeys)) return createMessage.warning(t('common.selectText'));
    postCPKArchive(rowKeys).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
      }
    });
  }

  function handleCancelDataArchiving() {
    const rowKeys = doneGetSelectRows().map(item => item.id);
    if (isEmpty(rowKeys)) return createMessage.warning(t('common.selectText'));
    postCPKCancelArchive(rowKeys).then(({ code, msg }) => {
      if (code == 200) {
        doneReload();
        createMessage.success(msg);
      }
    });
  }

  function handleQuerydDataArched() {
    doneGrid.grid.commitProxy('query', {
      archive: 2,
    });
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_urgeHandle'" type="primary" @click="handleProcess">{{ t('dict.CPK.urgeHandle') }} </a-button>
                  <!--                  <a-button v-auth="'btn_urgeHandle'" type="primary" ghost @click="handlePushRecords">{{ t('dict.CPK.pushRecords') }}</a-button>-->
                  <a-button v-auth="'btn_download'" @click="handleExport('1')">{{ t('common.batchExport') }} </a-button>
                  <a-button v-auth="'btn_pushSAP'" @click="handlePushSAP('wait')">{{ t('dict.CPKColumn.pushSAP') }} </a-button>

                  <!--                  <a-button v-auth="'btn_pushSAP'" @click="handlePushSAP('wait')">{{ t('dict.CPKColumn.pushSAP') }} </a-button>-->
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #attachment="{ row }">
                <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <span class="table-a" @click="handlePushRecords(row)">{{ t('dict.CPK.pushRecords') }}</span>
              </template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')" class="h-full">
            <Done>
              <template #expand-before>
                <a-button v-auth="'btn_dataArchived'" class="mx-10px" type="primary" ghost @click="handleQuerydDataArched"
                  >{{ t('dict.CPKColumns.dataArchived') }}
                </a-button>
              </template>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_urgeHandle'" type="primary" @click="handleRevocation">{{ t('common.revoke') }} </a-button>
                  <a-button v-auth="'btn_download'" @click="handleExport('2')">{{ t('common.batchExport') }} </a-button>
                  <a-button v-auth="'btn_pushSAP'" @click="handlePushSAP('done')">{{ t('dict.CPKColumn.pushSAP') }} </a-button>
                  <a-button v-auth="'btn_dataArchiving'" @click="handleDataArchiving"> {{ t('dict.CPKColumns.dataArchiving') }} </a-button>
                  <a-button v-auth="'btn_cancelDataArchiving'" @click="handleCancelDataArchiving">{{ t('dict.CPKColumns.cancelDataArchiving') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #attachment="{ row }">
                <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <span class="table-a" @click="handlePushRecords(row)">{{ t('dict.CPK.pushRecords') }}</span>
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ReviewPopup @register="registerReviewPopup" @reload="reloadTable" @close="reloadTable" />
    <Revocation @register="registerForm" @reload="reloadTable" />
    <PushRecords @register="registerPushRecords" />
    <AttachList @register="registerAttach" @refresh="reloadTable" @reload="reloadTable" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <RejectModal @register="registerRejectModal" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
