<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.notMade')">
            <BasicTable @register="registerUndoTable">
              <template #tableTitle>
                <a-button v-auth="'btn_edit'" type="primary" @click="handleApprove('undo', -1)">{{ t('dict.DrawingsReview.OriginType.2') }}</a-button>
                <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleUndoExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getundoActions(index)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.DrawingsReview.Status.1')">
            <BasicTable @register="waitRegisterTable">
              <template #tableTitle>
                <!--                <a-button v-auth="'btn_edit'" type="primary" @click="handleApprove('undo', -1)">制作工程资料</a-button>-->
                <!--                <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleTransfer"> {{ t('common.transfer') }} </a-button>-->
                <a-button v-auth="'btn_download'" @click="handleWaitExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="waitGetActions(index)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.submitted')">
            <BasicTable @register="registerDoneTable">
              <template #tableTitle>
                <!--                <a-button v-auth="'btn_review'" @click="handleReview" type="primary"> 审核 </a-button>-->
                <a-button v-auth="'btn_download'" @click="handleDoneExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="getdoneActions(index)" />
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
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script setup lang="ts">
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { nextTick, reactive, toRefs, unref } from 'vue';
  import {
    bulkDeleteQuotation,
    exportQuotationMade,
    exportQuotationTomake,
    getQuotationMadeList,
    getQuotationTomakeList,
    reviewQuotation,
    transferQuotation,
  } from '/@/api/engineering/quotatios';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import Revocation from './components/Revocation.vue';
  import { getDoneColumns, getFormConfig, getUndoColumns, waitGetColumns } from './config';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { message } from 'ant-design-vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-data-quotationInit' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const state = reactive({
    undoCacheList: [],
    doneCacheList: [],
    waitCacheList: [],
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [
    registerUndoTable,
    {
      reload: originReload,
      clearSelectedRowKeys: clearUndoSelectRow,
      getSelectRows: undoGetSelectRows,
      getSelectRowKeys: getUndoSelectRows,
      getFetchParams: undoFetchParams,
    },
  ] = useTable({
    api: getQuotationTomakeList,
    columns: getUndoColumns(),
    rowKey: 'id',
    bordered: true,
    useSearchForm: true,
    formConfig: getFormConfig(),
    afterFetch: data => {
      state.undoCacheList = data;
      return data;
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 80,
      title: '操作',
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
    waitRegisterTable,
    { reload: waitReload, clearSelectedRowKeys: waitClearSelectRow, getSelectRows: waitGetSelectRows, getFetchParams: waitFetchParams },
  ] = useTable({
    api: getQuotationMadeList,
    columns: waitGetColumns(),
    rowKey: 'id',
    bordered: true,
    useSearchForm: true,
    formConfig: getFormConfig(),
    beforeFetch: params => {
      params.dataFilter = 1;
      return params;
    },
    afterFetch: data => {
      state.waitCacheList = data;
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
      params.dataFilter = 2;
      return params;
    },
    afterFetch: data => {
      state.doneCacheList = data;
      return data;
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 80,
      title: '操作',
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

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function reloadTable(e) {
    if (e == 1) {
      originReload();
    } else if (e == 2) {
      waitReload();
    } else {
      doneReload();
    }
  }

  function handleTransfer(id = '') {
    const idList = getUndoSelectRows();
    if (!idList.length) return createMessage.warning(t('common.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await transferQuotation({
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
      listQuery: {
        ...undoFetchParams(),
      },
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
        ...undoFetchParams(),
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
        ...undoFetchParams(),
      },

      exportOptions: exportColumns.toSpliced(index, 1),
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  // function handleReview() {
  //   const rowKeys = getDoneSelectRows();
  //   if (rowKeys.length <= 0) return createMessage.warning('请选择审核内容');
  //   reviewQuotation(rowKeys).then(({ code, msg }) => {
  //     if (code == 200) {
  //       createMessage.success(msg);
  //       reloadTable(state.activeKey);
  //     } else {
  //       createMessage.error(msg);
  //     }
  //   });
  // }

  function handleApprove(type: 'undo' | 'done' | 'wait', index, mode) {
    let rows;
    const params = {
      index,
    };
    if (type === 'undo') {
      rows = undoGetSelectRows();
      params.cacheList = state.undoCacheList;
      // params.showSyncPrice = true;
      // if(index == -1){
      //   params.cacheList = rows
      // }
    } else if (type === 'wait') {
      rows = waitGetSelectRows();
      params.cacheList = state.waitCacheList;
      params.showSyncPrice = true;
      params.mode = mode;
    } else if (type === 'done') {
      rows = getDoneSelectRows();
      params.cacheList = state.doneCacheList;
      params.mode = mode;
    }
    if (rows.length <= 0 && index == -1) return createMessage.warning(t('dict.QuotationColumn.selectQuotationTip'));
    if (params.cacheList.length <= 0) return createMessage.warning(t('dict.QuotationColumn.selectEngineTip'));
    if (index == -1) {
      params.index = 0;
    }
    if (rows.length > 0) {
      params.cacheList = rows;
    }
    console.log(params, 'params-----');
    openApplyPopup(true, params);
  }

  function getundoActions(index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: handleApprove.bind(null, 'undo', index),
      },
    ];
  }
  function waitGetActions(index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: handleApprove.bind(null, 'wait', index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, index),
        },
        auth: 'btn_remove',
      },
    ];
  }
  function getdoneActions(index): ActionItem[] {
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
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_edit',
        onClick: handleApprove.bind(null, 'done', index),
      },
    ];
  }
  function handleRevocation(index) {
    openFormModal(true, { ...state.doneCacheList[index] });
  }

  function onDelete(key: string | number) {
    const id = state.waitCacheList[key]?.id;
    bulkDeleteQuotation([id]).then(({ code, msg }) => {
      if (code === 200) {
        message.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }
  useRouteParams({ id: {} }, params => {
    if (params.id) {
      getQuotationTomakeList({ id: params.id }).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          openApplyPopup(true, { index: 0, cacheList: res.data.list });
        } else {
          getQuotationMadeList({ id: params.id, dataFilter: 1 }).then(res1 => {
            if (res1.data.list && res1.data.list.length > 0) {
              openApplyPopup(true, { index: 0, cacheList: res1.data.list });
            }
          });
        }
      });
    }
  });
</script>
