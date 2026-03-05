<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('dict.DrawingsReview.Status.1')">
            <BasicTable @register="waitRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_review'" @click="handleApprove('undo', -1, 'view')" type="primary">{{ t('common.audit') }} </a-button>
                <a-button v-auth="'btn_reject'" @click="handleReject" type="primary" ghost>{{ t('common.rejectText') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleWaitExport">{{ t('views.business.quota.export') }}</a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="getWaitActions(index)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.submitted')">
            <BasicTable @register="registerDoneTable">
              <template #tableTitle>
                <!--                <a-button v-auth="'btn_review'"-->
                <!--                          @click="handleReview"-->
                <!--                          type="primary"-->
                <!--                > 审核-->
                <!--                </a-button>-->
                <a-button v-auth="'btn_download'" @click="handleDoneExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="getDoneActions(index)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <ApplyPopup @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" @register="registerApplyPopup" />
    <Revocation
      @register="registerForm"
      @reload="
        () => {
          reloadTable(activeKey);
        }
      " />
    <RejectModal @register="registerRejectModal" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script setup lang="ts">
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { reactive, toRefs, unref } from 'vue';
  import {
    exportQuotationMade,
    exportQuotationTomake,
    getQuotationMadeList,
    rejectQuotation,
    reviewQuotation,
    transferQuotation,
    confirmTransferQuotation,
  } from '/@/api/engineering/quotatios';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, RejectModal, TransferModal } from '/@/components/CustomComponents';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPopup from '../quotationInit/components/ApplyPopup.vue';
  import { usePopup } from '/@/components/Popup';
  // import { STATUS_OPTIONS } from '/@/views/engineering/ecn/components/CONFIG';
  import Revocation from '../quotationInit/components/Revocation.vue';
  import { getDoneColumns, getFormConfig, getUndoColumns } from '/@/views/engineering/data/quotationInit/config';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { getNodeDetail, rejectEcn } from '/@/api/engineering/ecn';
  import { message } from 'ant-design-vue';

  defineOptions({ name: 'engineering-data-quotationReview' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const state = reactive({
    undoCacheList: [],
    doneCacheList: [],
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();

  const [
    waitRegisterTable,
    {
      getSelectRows: waitGetSelectRows,
      reload: waitReload,
      getSelectRowKeys: waitGetSelectRowKeys,
      clearSelectedRowKeys: waitClearSelectRow,
      getFetchParams: waitFetchParams,
    },
  ] = useTable({
    api: getQuotationMadeList,
    columns: getDoneColumns(),
    rowKey: 'id',
    bordered: true,
    useSearchForm: true,
    formConfig: getFormConfig(),
    beforeFetch: params => {
      params.dataFilter = 3;
      return params;
    },
    afterFetch: data => {
      state.undoCacheList = data;
      return data;
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 80,
      title: t('component.table.action'),
      dataIndex: 'action',
    },
    pagination: {
      pageSize: 100,
    },
    i18nConfig: {
      moduleCode: 'QuotationColumn',
    },
  });

  const [
    registerDoneTable,
    { reload: doneReload, clearSelectedRowKeys: clearDoneSelectRow, getSelectRows: getDoneSelectRows, getFetchParams: doneFetchParams },
  ] = useTable({
    api: getQuotationMadeList,
    columns: getDoneColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    tableSetting: {
      redo: false,
    },
    beforeFetch: params => {
      params.dataFilter = 4;
      return params;
    },
    afterFetch: data => {
      state.doneCacheList = data;
      return data;
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 80,
      title: t('component.table.action'),
      dataIndex: 'action',
    },
    pagination: {
      pageSize: 100,
    },
    i18nConfig: {
      moduleCode: 'QuotationColumn',
    },
  });
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerApplyPopup, { openPopup: openApplyPopup }] = usePopup();

  function reloadTable(e) {
    if (e == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }

  const handleReject = async () => {
    const idList = waitGetSelectRowKeys();
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectQuotation,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };

  function handleTransfer(id = '') {
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

  function handleUndoExport() {
    const exportColumns = cloneDeep(getUndoColumns());
    const index = exportColumns.findIndex(item => item.dataIndex === 'desensitizedDrawingsName');
    openExportModal(true, {
      api: exportQuotationTomake,
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function handleWaitExport() {
    const exportColumns = cloneDeep(getUndoColumns());
    const index = exportColumns.findIndex(item => item.dataIndex === 'desensitizedDrawingsName');
    openExportModal(true, {
      api: exportQuotationMade,
      listQuery: {
        dataFilter: 1,
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function handleDoneExport() {
    const exportColumns = cloneDeep(getUndoColumns());
    const index = exportColumns.findIndex(item => item.dataIndex === 'desensitizedDrawingsName');
    openExportModal(true, {
      api: exportQuotationMade,
      listQuery: {
        dataFilter: 2,
      },
      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'dataIndex',
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

  function handleReview() {
    const rowKeys = getDoneSelectRows();
    if (rowKeys.length <= 0) return createMessage.warning('请选择审核内容');
    reviewQuotation(rowKeys).then(({ code, msg }) => {
      if (code == 200) {
        createMessage.success(msg);
        reloadTable(state.activeKey);
      } else {
        createMessage.error(msg);
      }
    });
  }

  function handleApprove(type: 'undo' | 'done', index, mode) {
    let rows;
    const params = {
      index,
    };
    if (index == -1) {
      const datalist = waitGetSelectRows();
      params.index = 0;
      openApplyPopup(true, {
        cacheList: datalist,
        showReview: true,
        mode: 'view',
        index: 0,
        showReject: true,
        showSyncPrice: true,
      });
      waitClearSelectRow();
      return;
    }
    if (type === 'undo') {
      rows = waitGetSelectRows();
      params.cacheList = state.undoCacheList;
      params.showReject = true;
      params.isCommit = true;
    } else if (type === 'done') {
      rows = getDoneSelectRows();
      params.cacheList = state.doneCacheList;
    }
    if (rows.length <= 0 && index == -1) return createMessage.warning(t('dict.QuotationColumn.selectQuotationTip'));
    if (params.cacheList.length <= 0) return createMessage.warning(t('dict.QuotationColumn.selectEngineTip'));
    if (index == -1) {
      params.index = 0;
    }
    params.mode = mode;
    console.log(params, 'params-----');
    openApplyPopup(true, params);
  }

  function getWaitActions(index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        // auth: "btn_detail",
        onClick: handleApprove.bind(null, 'undo', index, 'view'),
      },
    ];
  }

  function getDoneActions(index): ActionItem[] {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: handleRevocation.bind(null, index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_detail',
        onClick: handleApprove.bind(null, 'done', index, 'view'),
      },
      // {
      //   icon: "icon-ym icon-ym-view",
      //   auth: "btn_edit",
      //   onClick: handleApprove.bind(null, "done", index, 'view')
      // }
    ];
  }

  function handleRevocation(index) {
    openFormModal(true, { ...state.doneCacheList[index] });
  }
</script>
