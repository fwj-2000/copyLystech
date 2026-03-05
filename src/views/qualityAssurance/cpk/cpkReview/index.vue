<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { waitGetColumns, waitGetSchema } from './config';
  import { getCpkData, postCpkDetail, postCpkExportExcel, postCpkReject, postCpkTransfer } from '/@/api/qualityAssurance/cpk';
  import { usePopup } from '/@/components/Popup';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AttachList from '/@/views/qualityAssurance/cpk/cpkUploadReport/components/AttachList.vue';
  import Revocation from '../cpkUploadReport/components/Revocation.vue';
  import ReviewPopup from './components/ReviewPopup.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { NodeModal, TransferModal, RejectModal } from '/@/components/CustomComponents';

  defineOptions({ name: 'qualityAssurance-cpk-cpkReview' });
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
      api: getCpkData,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'id',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 3,
        };
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
      },
    },
  });

  const [
    Done,
    {
      reload: doneReload,
      getSelectRowKeys: doneGetSelectRowKeys,
      setLoading: doneSetLoading,
      clearSelectedRowKeys: doneClearSelectedRowKeys,
      getSelectRows: doneGetSelectRows,
      getFetchParams: doneGetFetchParams,
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
      id: 'qualityAssurance-cpk-review-list-done',
      columns: waitGetColumns(),
      api: getCpkData,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'id',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 4,
        };
      },
      afterFetch: data => {
        state.doneCacheList = data.list;
      },
    },
  });

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
      openAttachModal(
        true,
        data.map(item => ({ ...item, mode: 'view' })),
      );
    });
  }

  function handleApprove() {
    const rows = waitGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    // 需要判断节点状态，如果选择的数据中有EPM节点，并且有其他节点，那么不允许打开
    const EPMQPMList = rows.filter(item => item.currentNode.includes('EPMQPM'));
    if (EPMQPMList.length === 0) {
      // 没有EPM节点，直接打开审核弹窗
      waitSetLoading(true);
      postCpkDetail(rows.map(item => item.id))
        .then(({ code, data }) => {
          if (code !== 200) return;
          openAttachModal(
            true,
            data.map(item => ({ ...item, mode: 'review' })),
          );
        })
        .finally(() => {
          waitSetLoading(false);
        });
    } else if (EPMQPMList.length === rows.length) {
      postCpkDetail(rows.map(item => item.id))
        .then(({ code, data }) => {
          if (code !== 200) return;
          openReviewPopup(true, data);
        })
        .finally(() => {
          waitSetLoading(false);
        });
      // 只有EPM节点，打开EPM PopUp
    } else {
      // 混杂，不让打开
      return createMessage.warning(t('dict.CPKColumn.validateSelectRows'));
    }
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
    const rows = waitGetSelectRowKeys();
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
      api: postCpkExportExcel,
      listQuery: {
        ...(dataFilter == 3 ? await waitGetFetchParams() : await doneGetFetchParams()),
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

  useRouteParams({ id: {}, billNo: {} }, params => {
    if (!params.id) return;
    postCpkDetail([params.id]).then(({ code, data }) => {
      if (code == 200) {
        console.log(data);
        const EPMQPMList = data.filter(item => item.currentNode.includes('EPMQPM'));
        if (isEmpty(EPMQPMList)) {
          openAttachModal(
            true,
            data.map(item => ({ ...item, mode: 'review' })),
          );
        } else {
          openReviewPopup(true, data);
        }
      }
    });
  });
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
                  <a-button v-auth="'btn_review'" type="primary" @click="handleApprove">{{ t('common.audit') }} </a-button>
                  <a-button v-auth="'btn_reject'" type="primary" @click="handleReject" ghost>{{ t('common.rejectText') }} </a-button>
                  <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('common.transfer') }}</a-button>
                  <a-button v-auth="'btn_download'" @click="handleExport('3')">{{ t('common.batchExport') }}</a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #attachment="{ row }">
                <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }"> 11</template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')" class="h-full">
            <Done>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_recall'" type="primary" @click="handleRevocation">撤回</a-button>
                  <a-button v-auth="'btn_download'" @click="handleExport('4')">{{ t('common.batchExport') }}</a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #attachment="{ row }">
                <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ReviewPopup @register="registerReviewPopup" @reload="reloadTable" />
    <Revocation @register="registerForm" @reload="reloadTable" />
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
