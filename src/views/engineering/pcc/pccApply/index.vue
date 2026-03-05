<!--  -->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.waitMadeText')">
            <BasicTable @register="originRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_upgrade'" type="primary" ghost @click="handleUpgrade">{{ t('dict.PCCApplyColumn.versionUpgrade') }} </a-button>
                <a-button v-auth="'btn_edit'" type="primary" @click="handleToMake('toBe', -1)"> {{ t('routes.engineering-pcc-apply') }} </a-button>
                <a-button @click="handleTransfer"> {{ t('common.transfer') }}</a-button>
                <!--                <ModelConfirmButton-->
                <!--                  v-auth="'btn_edit'"-->
                <!--                  :modelConfirm="{-->
                <!--                    title: t('common.tipTitle'),-->
                <!--                    content: t('dict.PCCColumn.notMadeTip'),-->
                <!--                    onOk: handleNotMake.bind(null),-->
                <!--                  }">-->
                <!--                  {{ t('dict.PCCColumn.notMade') }}-->
                <!--                </ModelConfirmButton>-->
                <a-button @click="handleNotMake" v-auth="'btn_edit'"> {{ t('dict.PCCColumn.notMade') }}</a-button>
                <a-button v-auth="'btn_edit_tmp'" @click="handleEditTemplate">{{ t('dict.PCCApplyColumn.commonTemplate') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getOriginActions(index, record)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.Flow.BillStatus.1')">
            <BasicTable @register="unReviewRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
                <a-button v-auth="'btn_edit_tmp'" @click="handleEditTemplate">{{ t('dict.PCCApplyColumn.commonTemplate') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getunReviewActions(index, record)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.submitted')">
            <BasicTable @register="reviewRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_download'" @click="handleDoneReviewExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ column, index, text }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getReviewActions(index)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <Revocation
      @register="registerForm"
      @reload="
        () => {
          reloadTable(activeKey);
        }
      " />
    <Modal @register="registerModal" @submit="handleSubmit" />
    <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" />
    <DetailPopup @register="registerDetail" @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" />
    <TemplateList
      @register="registerTemplateList"
      @submit="
        data => {
          openTemplate(true, {
            index: 0,
            mode: 'edit',
            cacheList: [data],
          });
        }
      " />
    <Template @register="registerTemplate" @submit="() => {}" />
    <Preview ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <NotMade @register="registerNotMade" @reload="reloadTable(activeKey)" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { h, onMounted, reactive, ref, toRefs, unref } from 'vue';
  import {
    bulkDeletePcc,
    confirmUpgradeVersion,
    exportExcelTomake,
    exportExcelApplyPage,
    getPccApplyPage,
    getPccTomake,
    transferPcc,
    notMakePcc,
  } from '/@/api/engineering/pcc';
  import { getOriginFormConfig, getUnReviewFormConfig, originGetColumns } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import Modal from './components/Modal.vue';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import Revocation from './components/Revocation.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/Upgrade.vue';
  import TemplateList from '/@/views/engineering/pcc/pccApply/components/TemplateList.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import dayjs from 'dayjs';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { postDrawingsReviewTransfer } from '/@/api/engineering/drawingReview';
  import { formatTableDefaultText } from '/@/utils';
  import { STATUS_OPTIONS } from '/@/utils/status/index';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { uniq } from 'lodash-es';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { ModelConfirmButton } from '/@/components/Button';
  import NotMade from '/@/views/engineering/pcc/pccApply/components/notMade.vue';

  defineOptions({ name: 'engineering-pcc-apply' });
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();

  const { t } = useI18n();
  const filePreviewRef = ref<any | null>(null);
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerUpgradeModal, { openModal: openUpgradeModal, closeModal: closeUpgradeModal }] = useModal();
  const [registerModal, { openModal, closeModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerTemplateList, { openModal: openTemplateListModal }] = useModal();
  const [registerTemplate, { openPopup: openTemplate }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerNotMade, { openModal: openNotMade }] = useModal();

  // onMounted(() => {
  //   getTypeOptions();
  // });
  useRouteParams({ id: {} }, params => {
    getTypeOptions();
    if (!params.id) return;
    getPccTomake({ id: params.id }).then(res => {
      openDetail(true, {
        index: 0,
        cacheList: res.data?.list ?? [],
        mode: 'edit',
        showSubmit: true,
        showDialog: true,
        doNotTemplate: true,
      });
    });
  });

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
    originCacheList: [],
    cacheUnReviewData: [],
    cacheReviewData: [],
    statusList: [],
  });
  const { activeKey, statusList } = toRefs(state);

  const [
    originRegisterTable,
    { getForm: originGetForm, getSelectRows: originGetSelectRows, clearSelectedRowKeys: originClearSelectedRowKeys, reload: originReload },
  ] = useTable({
    api: getPccTomake,
    columns: originGetColumns(),
    rowKey: 'id',
    afterFetch: data => {
      state.originCacheList = data;
    },
    bordered: true,
    useSearchForm: true,
    formConfig: getOriginFormConfig(),
    showTableSetting: false,
    // immediate: false,
    rowSelection: { type: 'checkbox' },
    canResize: true,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
    },
  });

  const [
    unReviewRegisterTable,
    {
      reload: unReviewReload,
      getFetchParams: unReviewFetchParams,
      getSelectRows: getUnReviewSelectRows,
      getSelectRowKeys: getUnReviewSelectRowKeys,
      clearSelectedRowKeys: clearUnReviewSelectRow,
    },
  ] = useTable({
    api: getPccApplyPage,
    columns: getUnReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      params.dataFilter = 1;
      console.log(params);
      if (params.time && params.time.length > 0) {
        params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
        delete params.time;
      }
      return params;
    },
    afterFetch: data => {
      state.cacheUnReviewData = data;
    },
    rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    // immediate: false,
    formConfig: getUnReviewFormConfig(),
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
    },
  });

  const [
    reviewRegisterTable,
    {
      reload: reviewReload,
      getFetchParams: reviewFetchParams,
      getSelectRows: getReviewSelectRows,
      getSelectRowKeys: getReviewSelectRowKeys,
      clearSelectedRowKeys: clearReviewSelectRow,
    },
  ] = useTable({
    api: getPccApplyPage,
    columns: getDoneReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      params.dataFilter = 2;
      if (params.time && params.time.length > 0) {
        params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
        delete params.time;
      }
      return params;
    },
    afterFetch: data => {
      state.cacheReviewData = data;
    },
    rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    // immediate: false,
    formConfig: getUnReviewFormConfig(),
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
    },
  });

  function reloadTable(e) {
    if (e == 1) {
      originReload();
    } else if (e == 2) {
      unReviewReload();
    } else {
      reviewReload();
    }
  }

  function handleNotMake() {
    if (originGetSelectRows().length <= 0) {
      createMessage.error(t('common.checkOperationText'));
      return;
    }
    const demandTypeList = uniq(originGetSelectRows().map(item => item.demandType));
    if (demandTypeList.length > 1 && demandTypeList.indexOf('Quantitative') >= 0) {
      createMessage.error(t('dict.PCCApplyColumn.notMakeError'));
      return;
    }

    const list = originGetSelectRows().map(item => ({
      insidePartNumber: item.insidePartNumber,
      originType: item.originType,
      drawingsReviewId: item.id,
      demandType: item.demandType,
    }));
    openNotMade(true, {
      api: notMakePcc,
      list,
    });

    // console.log(list);
    // notMakePcc({
    //   list,
    // }).then(({ data }) => {
    //   createMessage.success(data.msg);
    // });
  }

  function getUnReviewColumns() {
    return [
      {
        title: '需求单号',
        dataIndex: 'originCode',
        width: 200,
      },
      {
        title: '需求类型',
        dataIndex: 'demandTypeName',
        width: 120,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 120,
        customRender: ({ record }) => {
          return `T${record.version}`;
        },
      },
      {
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        width: 200,
      },
      // {
      //   title: '版本',
      //   dataIndex: 'version',
      //   customRender: ({ record }) => {
      //     return `T${record.version}`;
      //   },
      //   width: 80,
      // },
      {
        title: '状态',
        dataIndex: 'status',
        format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        width: 200,
      },
      {
        title: '当前处理人',
        dataIndex: 'handlerName',
        width: 200,
      },
      {
        title: '节点详情',
        dataIndex: 'nodeDetail',
        width: 120,
        customRender: ({ record }) => {
          return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
        },
      },
      {
        title: '直接客户料号',
        dataIndex: 'immediateCustomerProjectCode',
        width: 200,
      },
      {
        title: '终端客户料号',
        dataIndex: 'terminalCustomerPartNumber',
        width: 200,
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        width: 200,
      },
    ];
  }

  function getDoneReviewColumns() {
    return [
      {
        title: '需求单号',
        dataIndex: 'originCode',
        width: 200,
      },
      {
        title: '需求类型',
        dataIndex: 'demandTypeName',
        width: 120,
      },
      {
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        width: 200,
      },
      {
        title: '版本',
        dataIndex: 'version',
        customRender: ({ record }) => {
          return `T${record.version}`;
        },
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'status',
        format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        width: 200,
      },
      {
        title: '当前处理人',
        dataIndex: 'handlerName',
        width: 200,
      },
      {
        title: '节点详情',
        dataIndex: 'nodeDetail',
        width: 120,
        customRender: ({ record }) => {
          return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
        },
      },
      {
        title: '直接客户料号',
        dataIndex: 'immediateCustomerProjectCode',
        width: 200,
      },
      {
        title: '终端客户料号',
        dataIndex: 'terminalCustomerPartNumber',
        width: 200,
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        width: 200,
      },
    ];
  }

  function getunReviewActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'unReview', index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function getOriginActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleToMake.bind(null, 'toMake', index, record),
      },
    ];
  }

  function handleEditTemplate() {
    openTemplateListModal(true, {
      mode: 'edit',
    });
  }

  function handleUpgradeSubmit(selectRow) {
    const row = selectRow[0];
    if (!row) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForVersionUpgrade'));
    console.log(row.id);
    confirmUpgradeVersion({
      id: row.id,
    }).then(({ code, data }) => {
      if (code === 200) {
        openDetail(true, {
          index: 0,
          mode: 'edit',
          showSubmit: true,
          showDialog: true,
          cacheList: [data],
        });
        closeUpgradeModal();
      }
    });
  }

  function onDelete(record) {
    bulkDeletePcc([record.id]).then(({ code, msg }) => {
      if (code === 200) {
        message.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }

  function handleTransfer(id = '') {
    const idList = originGetSelectRows();
    if (!idList.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    // const { id } = unref(data);
    const r = await transferPcc({
      list: originGetSelectRows().map(item => ({ id: item.id, originType: item.originType })),
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function handleDel() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        const selectedRowKeys = getUnReviewSelectRowKeys();
        if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));

        const { code, msg } = await bulkDeletePcc(selectedRowKeys);
        if (code === 200) {
          clearUnReviewSelectRow();
          reloadTable(state.activeKey);
          return message.success(msg);
        }
      },
    });
  }

  function getReviewActions(index): ActionItem[] {
    return [
      {
        icon: 'ym-custom ym-custom-backup-restore',
        onClick: handleRevocation.bind(null, index),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'reviewed', index),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleUpgrade() {
    openUpgradeModal(true, {});
  }

  function handleTurn(type, index) {
    // openTurnFormModal(true, { ...state.cacheUnReviewData[index] });
  }

  function handleRevocation(index) {
    openFormModal(true, { ...state.cacheReviewData[index] });
  }

  function handleApprove(type, index) {
    const hasP = hasBtnP('btn_edit');
    if (type == 'toBe') {
      openModal(true, {});
    }
    if (type == 'unReview') {
      openDetail(true, {
        index: index,
        mode: hasP ? 'edit' : 'view',
        showSubmit: true,
        showDialog: true,
        cacheList: state.cacheUnReviewData,
      });
    }
    if (type == 'reviewed') {
      openDetail(true, {
        index: index,
        mode: 'view',
        cacheList: state.cacheReviewData,
      });
    }
    // else if (type == 'submitted' && index == -1) {
    //   const rows = getSelectRowsTobe();
    //   if (rows.length <= 0) {
    //     return createMessage.warning('请选择要评审的数据');
    //   }
    // }
    // if (type === 'unReview') {
    //   params.cacheList = state.cacheUnReviewData;
    //   if (index == -1) {
    //     params.index = 0;
    //     const rows = getUnReviewSelectRows();
    //     if (rows.length !== 0) {
    //       params.cacheList = rows;
    //     }
    //   }
    // } else if (type === 'review') {
    //   params.cacheList = state.cacheReviewData;
    //   if (index == -1) {
    //     params.index = 0;
    //     const rows = getSelectRows();
    //     if (rows.length !== 0) {
    //       params.cacheList = rows;
    //     }
    //     params.sign = 'detail';
    //   }
    // }
    // if (params.cacheList.length === 0) return createMessage.warning('当前列表没有待处理图纸');
    // console.log(params);
    // openDrawingDetail(true, params);
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    openExportModal(true, {
      api: exportExcelApplyPage,
      listQuery: {
        dataFilter: 1,
        ...unReviewFetchParams(),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  function handleDoneReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    console.log(123123123);
    openExportModal(true, {
      api: exportExcelApplyPage,
      listQuery: {
        dataFilter: 2,
        ...unReviewFetchParams(),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  function handleToMake(type, index, record) {
    if (index == -1) {
      const rows = originGetSelectRows().map(item => ({ ...item, applyCode: '' }));
      if (rows.length <= 0) return createMessage.warning(t('dict.PCCApplyColumn.selectDataForProduction'));
      openDetail(true, {
        index: 0,
        cacheList: rows,
        mode: 'edit',
        showSubmit: true,
        showDialog: true,
        doNotTemplate: true,
      });
    } else {
      openDetail(true, {
        index: 0,
        cacheList: [{ ...record, applyCode: '' }],
        mode: 'edit',
        showSubmit: true,
        showDialog: true,
        doNotTemplate: true,
      });
    }
  }

  function handleSubmit(rows) {
    openDetail(true, {
      index: 0,
      cacheList: rows,
      mode: 'edit',
      showSubmit: true,
      doNotTemplate: true,
    });
    closeModal();
  }

  async function getTypeOptions() {
    state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
    console.log(state.statusList);
  }
</script>
