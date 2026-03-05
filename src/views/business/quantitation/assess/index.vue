<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="state.activeKey" @change="reloadTable" destroyInactiveTabPane>
          <a-tab-pane key="2" :tab="t('common.selfTodo')">
            <GridTwo>
              <template #toolbar-actions>
                <a-button type="primary" @click="review" v-auth="'btn_review'">{{ t('common.review') }}</a-button>
                <a-button @click="handleReject" v-auth="'btn_reject'"> {{ t('common.rejectText') }} </a-button>
                <a-button @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
                <a-button type="primary" ghost @click="transferHandle" v-auth="'btn_transfer'">{{ t('common.transfer') }}</a-button>
                <ModelConfirmButton
                  v-auth="'btn_changeProdType'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.changeProductionTip'),
                      onOk: handleProductionType.bind(null),
                    },
                  }">
                  <span>{{ t('common.changeProduct') }}</span>
                </ModelConfirmButton>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridTwo>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.outTodo')">
            <GridOne>
              <template #toolbar-actions>
                <a-button type="primary" @click="review" v-auth="'btn_review'">{{ t('common.review') }}</a-button>
                <a-button @click="handleReject" v-auth="'btn_reject'"> {{ t('common.rejectText') }} </a-button>
                <a-button @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
                <a-button type="primary" ghost @click="transferHandle" v-auth="'btn_transfer'">{{ t('common.transfer') }}</a-button>
                <ModelConfirmButton
                  v-auth="'btn_changeProdType'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.changeProductionTip'),
                      onOk: handleProductionType.bind(null),
                    },
                  }">
                  <span>{{ t('common.changeProduct') }}</span>
                </ModelConfirmButton>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridOne>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="t('common.selfDone')">
            <GridFour>
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
                <a-button @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridFour>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.outDone')">
            <GridThree>
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
                <a-button @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
              </template>
              <template #action="{ row }">
                <TableAction :outside="true" :actions="getTableActions(row)" />
              </template>
            </GridThree>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <selfDetail @register="registerReviewPop" @reload="reload"></selfDetail>
    <outDetail @register="registerOutReviewPop" @reload="reload"></outDetail>
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <TransferModal
      @register="registerTransferModal"
      @reload="
        () => {
          clearSelectedRowKeys(), reload();
        }
      " />
  </div>
</template>
<script lang="ts" setup>
  import { basicProps } from './props';
  import { reactive, unref, computed } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import selfDetail from './components/SelfDetail.vue';
  import outDetail from './components/OutDetail.vue';
  import { useModal } from '/@/components/Modal';
  import { TransferModal, RejectModal, NodeModal } from '/@/components/CustomComponents';
  import {
    getQuantationReviewList,
    transferReview,
    bulkconvertproductiontype,
    exportEmpTableData,
    epmReject,
    epmRecall,
    getNodelist,
    getQuantationReviewInfo,
  } from '/@/api/business/quantitation';
  import { vxeColumns, formSachema } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { handleCheckType } from '/@/utils/quanlity/isCheck';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'business-quantitation-assess' });
  defineProps({ ...basicProps });
  const { createMessage } = useMessage();

  interface State {
    activeKey: string;
    industryTypeList: any[];
    visible: boolean;
    detailData: any;
    productionType: string;
    status: string;
  }

  const state = reactive<State>({
    activeKey: '2',
    productionType: '1',
    status: '1',
    industryTypeList: [],
    visible: false,
    detailData: {},
  });

  const { t } = useI18n();
  const isSelf = computed(() => {
    return ['2', '4'].includes(state.activeKey);
  });

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  /**
   * @description 表格配置
   * @param isOut 是否为外购，用于表格列的创建
   * @param isTodo 是否为待办，用于表单的创建
   */
  const tableConfigVxe = (isOut = false, isTodo = true) => ({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: formSachema(isTodo),
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `business-quantitation-assess-${isOut ? 'out' : 'self'}${isTodo ? 'Todo' : 'Done'}-list`,
      showIndexColumn: true,
      columns: [
        {
          type: 'checkbox',
          field: 'checkbox',
        },
        ...vxeColumns(handleNodeModal, isOut),
        // 操作行
        {
          title: t('common.action'),
          width: '60',
          field: 'action',
          fixed: 'right',
          slots: {
            default: 'action',
          },
        },
      ],
      api: getQuantationReviewList,
      beforeFetch: (params: any) => {
        const _p = {
          ...params,
          identification: state.status,
          productionType: isSelf.value ? 1 : 2,
        };
        return _p;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
      toolbarConfig: {
        delStatus: true,
      },
    },
  });

  const [
    GridOne,
    {
      reload: reloadOne,
      getSelectRowKeys: getSelectRowKeysOne,
      getSelectRows: getSelectRowsOne,
      clearSelectedRowKeys: clearSelectedRowKeysOne,
      getFetchParams: getFetchParamsOne,
    },
  ] = useVbenVxeGrid(tableConfigVxe(true, true));

  const [
    GridTwo,
    {
      reload: reloadTwo,
      getSelectRowKeys: getSelectRowKeysTwo,
      getSelectRows: getSelectRowsTwo,
      clearSelectedRowKeys: clearSelectedRowKeysTwo,
      getFetchParams: getFetchParamsTwo,
    },
  ] = useVbenVxeGrid(tableConfigVxe(false, true));

  const [
    GridThree,
    {
      reload: reloadThree,
      getSelectRowKeys: getSelectRowKeysThree,
      getSelectRows: getSelectRowsThree,
      clearSelectedRowKeys: clearSelectedRowKeysThree,
      getFetchParams: getFetchParamsThree,
    },
  ] = useVbenVxeGrid(tableConfigVxe(true, false));

  const [
    GridFour,
    {
      reload: reloadFour,
      getSelectRowKeys: getSelectRowKeysFour,
      getSelectRows: getSelectRowsFour,
      clearSelectedRowKeys: clearSelectedRowKeysFour,
      getFetchParams: getFetchParamsFour,
    },
  ] = useVbenVxeGrid(tableConfigVxe(true, false));

  const [registerReviewPop, { openPopup: openReviewPopup }] = usePopup();
  const [registerOutReviewPop, { openPopup: openOutReviewPopup }] = usePopup();

  function clearSelectedRowKeys() {
    switch (state.activeKey) {
      case '1':
        return clearSelectedRowKeysOne();
      case '2':
        return clearSelectedRowKeysTwo();
      case '3':
        return clearSelectedRowKeysThree();
      case '4':
        return clearSelectedRowKeysFour();
    }
  }
  function reload() {
    switch (state.activeKey) {
      case '1':
        return reloadOne();
      case '2':
        return reloadTwo();
      case '3':
        return reloadThree();
      case '4':
        return reloadFour();
    }
  }
  function getSelectRowKeys() {
    switch (state.activeKey) {
      case '1':
        return getSelectRowKeysOne();
      case '2':
        return getSelectRowKeysTwo();
      case '3':
        return getSelectRowKeysThree();
      case '4':
        return getSelectRowKeysFour();
    }
  }
  function getSelectRows() {
    switch (state.activeKey) {
      case '1':
        return getSelectRowsOne();
      case '2':
        return getSelectRowsTwo();
      case '3':
        return getSelectRowsThree();
      case '4':
        return getSelectRowsFour();
    }
  }
  function getFetchParams() {
    switch (state.activeKey) {
      case '1':
        return getFetchParamsOne();
      case '2':
        return getFetchParamsTwo();
      case '3':
        return getFetchParamsThree();
      case '4':
        return getFetchParamsFour();
    }
  }
  function reloadTable(e) {
    state.activeKey = e;
    state.status = ['2', '1'].indexOf(e) > -1 ? '1' : '2';
  }
  // 识别是打开自制弹框还是外购弹框
  function openSelfOutModal(idList, isSelf: boolean, openType: 'review' | 'view' = 'review') {
    if (isSelf) {
      return openReviewPopup(true, { id: idList, title: t('common.add'), type: openType });
    }
    openOutReviewPopup(true, { id: idList, title: t('common.add'), type: openType });
  }
  // 审核
  function review(ids, type: 'btn' | 'url' = 'btn') {
    const idList = type == 'url' ? ids : getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    const rowList = getSelectRows();
    if (handleCheckType(rowList)) {
      openSelfOutModal(idList, isSelf.value);
    }
  }
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  // 判断处理类型是否一致
  function handleProductionType() {
    const selectRows = getSelectRows() || [];
    if (selectRows.length === 0) return createMessage.warning(t('common.selectText'));
    if (selectRows.some(item => item.demandType === 'DrawingsReviewReq')) {
      // `图示需求评审(demandType === 'DrawingsReviewReq')`不允许转换生产类型
      return createMessage.warning(t('dict.quantitation.transferCheckTip'));
    }

    bulkconvertproductiontype(selectRows.map(item => item.id)).then(() => {
      message.success(t('sys.api.operationSuccess'));
      reload();
      clearSelectedRowKeys();
    });
  }
  function transferHandle() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }
  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await transferReview({
      Ids: id,
      TransferRemarks: data.remark,
      TransferUserId: data.transferUser,
    });
    return r;
  };

  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: epmReject,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };
  const handleRecall = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return epmRecall(idList);
    }
    message.info(t('common.selectText'));
  };
  const handleExport = async () => {
    openExportModal(true, {
      api: exportEmpTableData,
      listQuery: {
        ...(await getFetchParams()),
        identification: state.status,
        productionType: isSelf.value ? 1 : 2,
      },
      exportOptions: vxeColumns(handleNodeModal, isSelf.value),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'EngineeringInformationColumn',
      },
    });
  };

  function goDetail(record) {
    openSelfOutModal([record.id], isSelf.value, 'view');
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }
  useRouteParams({ id: {} }, params => {
    if (params.id) {
      getQuantationReviewInfo([params.id]).then(res => {
        const item = res.data[0];
        const { productionType } = item;
        openSelfOutModal([params.id], productionType == 1);
      });
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
