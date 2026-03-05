<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button v-auth="'btn_recommend'" type="primary" @click="handleSubmit">{{ t('dict.metarail.recommend') }}</a-button>
                <a-button type="primary" ghost v-auth="'btn_reject'" @click="handleReject"> {{ t('common.rejectText') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
                <!-- <a-button @click="handleNotSeek"> {{ t('common.notFoundMetarail') }} </a-button> -->
                <a-button v-auth="'btn_sendEmail'" @click="handleEmail"> {{ t('common.sendEmail') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridTodo>
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
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton>
                <a-button type="primary" ghost v-auth="'btn_recommend'" @click="handleRecommendAgain">
                  {{ t('common.addRecommend') }}
                </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <RejectModal @register="registerRejectModal" @reload="refresh" />
    <DetailPopup @register="registerDetail" @reload="refresh" />
    <RemarkModal @register="registerRemarkModal" @reload="refresh"></RemarkModal>
    <EmailPopup @register="registerEmailPopup" @reload="clearSelectedRowKeys"></EmailPopup>
    <TransferModal @register="registerTransferModal" @reload="refresh"></TransferModal>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, nextTick } from 'vue';
  import { schemaList, columns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getNewMaterial, exportNewMaterialExcel, recallMaterial, rejectMaterial, bulkMakeTransfer } from '/@/api/purchase/newMateria';
  import { getNodelist } from '/@/api/engineering/newMateria';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { RejectModal, NodeModal, RemarkModal, TransferModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import EmailPopup from './components/EmailPopup.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'purchase-newMaterial-recommend' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerEmailPopup, { openPopup: openEmailPopup }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });

  const tableConfig: any = {
    api: getNewMaterial,
    beforeFetch: params => {
      params.identification = state.activeKey;
      return params;
    },
    // rowSelection: { type: 'checkbox' },
    showIndexColumn: true,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  };
  const formConfig = {
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    schema: schemaList,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder'],
    },
  };
  const [
    GridTodo,
    {
      reload: reloadTodo,
      getFetchParams: getFetchParamsTodo,
      getSelectRowKeys: getSelectRowKeysTodo,
      clearSelectedRowKeys: clearSelectedRowKeysTodo,
      getSelectRows,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      ...formConfig,
    },
    gridOptions: {
      ...tableConfig,
      columns,
      id: 'purchase-newMaterial-recommend-todo',
    },
  });
  const [
    GridDone,
    { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone },
  ] = useVbenVxeGrid({
    formOptions: {
      ...formConfig,
    },
    gridOptions: {
      ...tableConfig,
      columns: columns,
      id: 'purchase-newMaterial-recommend-done',
    },
  });

  // 刷新页面
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

  function getActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
      },
    ];
  }
  function handleDetail(id) {
    return openDetail(true, {
      ids: [id],
      type: 'view',
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.materialDevelopApplyId,
      fetchSetting: {
        listField: 'mianBillFlow.flowNodeInstanceHisList',
      },
    });
  }
  function handleExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // 撤回
  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }
  async function handleRecall() {
    handleSelectData(recallMaterial);
  }

  function handleEmail() {
    const idList = getSelectRows() || [];
    if (idList.length) {
      return openEmailPopup(true, {
        list: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectMaterial,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  function handleSubmit() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openDetail(true, {
        index: 0,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  function handleRecommendAgain() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    if (idList.length !== 1) {
      return createMessage.warning(t('common.OnlyOnePiece'));
    }
    return openDetail(true, {
      index: 0,
      ids: idList,
      reRecommendFromDone: true,
    });
  }

  // 转办
  function handleTransfer() {
    const idList = getSelectRows();
    if (!idList.length) return createMessage.warning(t('common.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      api: bulkMakeTransfer,
      beforeFetch: params => {
        return {
          ids: idList.map(el => el.id),
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
        };
      },
    });
  }

  const route = useRoute();
  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleDetail(id);
      });
    }
  });
  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleDetail(id);
      });
    } else if (params.id) {
      nextTick(() => {
        openDetail(true, {
          index: 0,
          ids: [id],
        });
      });
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
