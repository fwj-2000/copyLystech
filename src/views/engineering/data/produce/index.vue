<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleSubmit">{{ t('common.quanlityReview') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_reject'" @click="handleReject"> {{ t('common.rejectText') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getunReviewActions(row, 'edit')" />
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getunReviewActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="refresh" />
    <DetailPopup @register="registerDetail" @reload="refresh" />
    <RejectModal @register="registerRejectModal" @reload="refresh" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { nextTick, reactive, toRefs } from 'vue';
  import { getUnReviewFormSchema, getUnReviewColumns } from './configVxe';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getEngineerInfoList, engineerBatchTransfer, exportExcel, reject, bulkwithdraw } from '/@/api/engineering/info';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './componentsBom/DetailPopup.vue';
  import { TransferModal, NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodelist } from '/@/api/business/quantitation';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'engineering-data-produce' });
  const { t } = useI18n();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);
  const tableConfig: any = {
    api: getEngineerInfoList,
    columns: getUnReviewColumns(),
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  };
  const [
    Grid,
    { reload: reloadTodo, getSelectRowKeys: getSelectRowKeysTodo, clearSelectedRowKeys: clearSelectedRowKeysTodo, getFetchParams: getFetchParamsTodo },
  ] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      collapsed: true,
      showCollapseButton: true,
      schema: getUnReviewFormSchema(),
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      ...tableConfig,
      id: 'engineering-data-produce-todo',
    },
  });
  const [
    GridDone,
    { reload: reloadDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone, getFetchParams: getFetchParamsDone },
  ] = useVbenVxeGrid({
    formOptions: {
      commonConfig: {
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      showCollapseButton: false,
      schema: getUnReviewFormSchema(),
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      ...tableConfig,
      id: 'engineering-data-produce-done',
    },
  });

  function refresh() {
    reload();
    clearSelectedRowKeys();
  }

  function reload() {
    if (state.activeKey == '1') {
      return reloadTodo();
    }
    return reloadDone();
  }
  function getFetchParams() {
    if (state.activeKey == '1') {
      return getFetchParamsTodo();
    }
    return getFetchParamsDone();
  }
  function getSelectRowKeys() {
    if (state.activeKey == '1') {
      return getSelectRowKeysTodo();
    }
    return getSelectRowKeysDone();
  }
  function clearSelectedRowKeys() {
    if (state.activeKey == '1') {
      return clearSelectedRowKeysTodo();
    }
    return clearSelectedRowKeysDone();
  }

  function getunReviewActions(record, mode: 'edit' | 'view' = 'view'): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleReview.bind(null, record.id, mode),
      },
    ];
  }
  function handleReview(id, mode?: 'edit' | 'view') {
    openDetail(true, {
      index: 0,
      type: mode || 'view',
      ids: [id],
      cacheList: [{ id }],
    });
  }

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.quantitativeApplyId,
    });
  }

  // 转办
  function handleTransfer() {
    const idList = getSelectRowKeys();
    if (!idList.length) return message.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      api: engineerBatchTransfer,
      beforeFetch: params => {
        return {
          ids: params.id,
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
        };
      },
    });
  }

  function handleUnReviewExport() {
    const exportColumns = getUnReviewColumns();
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
    });
  }

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: reject,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  }

  // 撤回
  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkwithdraw(idList);
    }
    message.info(t('common.selectText'));
  }

  function handleSubmit() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openDetail(true, {
        type: 'edit',
        index: 0,
        ids: idList,
        cacheList: idList.map(id => ({ id })),
      });
    }
    message.info(t('common.selectText'));
  }

  useRouteParams({ id: {}, type: {}, billNo: {} }, async params => {
    const { id, billNo, type } = params;
    if (id) {
      nextTick(() => {
        handleReview(id, type || 'edit');
      });
    } else if (billNo) {
      // 此时的id是 quantitativeApplyId
      let { data } = await getEngineerInfoList({ applyNo: billNo });
      if (data.list?.length == 0) return;
      //待办跳转
      nextTick(() => {
        openDetail(true, {
          type: 'edit',
          index: 0,
          ids: [data.list[0].id],
          cacheList: data.list[0],
        });
      });
    }
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
