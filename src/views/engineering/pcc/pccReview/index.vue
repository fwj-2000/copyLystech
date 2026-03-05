<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <BasicTable @register="unReviewRegisterTable">
          <template #tableTitle>
            <!--            <a-button v-auth="'btn_batchRemove'" @click="handleDel">批量删除</a-button>-->
            <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
            <a-button v-auth="'btn_enable'" @click="handleBatchEnable">{{ t('common.enableText') }} </a-button>
            <a-button v-auth="'btn_disable'" @click="handleBatchDisable">{{ t('common.disableText') }} </a-button>
            <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printText') }} </a-button>
          </template>
          <template #bodyCell="{ text, column, record, index }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getunReviewActions(index, record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" />
    <FileListModal @register="registerFileList"></FileListModal>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { h, onMounted, reactive, toRefs } from 'vue';
  import {
    bulkDeletePcc,
    exportExcelTomake,
    getEngineeringDocApplyHistory,
    getPccApplyPage,
    getPccList,
    bulkBackEnable,
    bulkBackDisable,
  } from '/@/api/engineering/pcc';
  import { getReviewUnReviewFormConfig, getUnReviewFormConfig } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/pcc/pccApply/components/DetailPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileListModal } from '/@/components/Upload';
  import { useModal } from '/@/components/Modal';
  import { fileDownload, getFiles } from '/@/api/purchase/importMateria';
  import { formatTableDefaultText } from '/@/utils';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { STATUS_OPTIONS } from '/@/utils/status/index';
  import { printPCCDetailByIds } from '/@/views/engineering/pcc/pccApply/components/print/index';

  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-pcc-pccReview' });
  const { t } = useI18n();

  const ENABLE_OPTIONS = [
    { id: true, fullName: t('dict.enableStatus.1'), theme: 'green' },
    { id: false, fullName: t('dict.enableStatus.2'), theme: 'red' },
  ];

  const { createMessage } = useMessage();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { createConfirm } = useMessage();

  onMounted(() => {
    getTypeOptions();
  });
  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
    cacheUnReviewData: [],
    cacheReviewData: [],
    statusList: [],
  });
  const { activeKey, statusList } = toRefs(state);

  const [
    unReviewRegisterTable,
    {
      reload: unReviewReload,
      getFetchParams: unReviewFetchParams,
      getSelectRows: getUnReviewSelectRows,
      getSelectRowKeys: getUnReviewSelectRowKeys,
      clearSelectedRowKeys: clearUnReviewSelectRow,
      setLoading,
    },
  ] = useTable({
    api: getPccList,
    columns: getUnReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      if (params.time && params.time.length > 0) {
        params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
        delete params.time;
      }
    },
    afterFetch: data => {
      state.cacheUnReviewData = data;
    },
    rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    formConfig: getReviewUnReviewFormConfig(),
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
    columns: getUnReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      params.dataFilter = 2;
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
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
    },
  });

  function reloadTable(e) {
    if (e == 1) {
      unReviewReload();
    } else {
      reviewReload();
    }
  }

  function getUnReviewColumns() {
    return [
      {
        title: '单号',
        dataIndex: 'originCode',
        width: 200,
        customRender: ({ record, text }) => {
          return text;
          // if(record.tag == 'PCC'){
          //
          // }else {
          //
          // }
          // return `PCC${record.originCode}`;
        },
      },
      {
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        width: 200,
      },
      {
        title: '资料类型',
        dataIndex: 'docType',
        width: 120,
      },
      {
        title: '需求类型',
        dataIndex: 'demandTypeName',
        width: 120,
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
        title: '是否启用',
        dataIndex: 'enable',
        width: 100,
        format: 'tag|' + JSON.stringify(ENABLE_OPTIONS),
      },
      {
        title: '状态',
        dataIndex: 'status',
        format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
        width: 100,
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        width: 180,
      },
      {
        title: '节点详情',
        dataIndex: 'nodeDetail',
        width: 120,
        customRender: ({ record }) => {
          return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, '查看详情');
        },
      },
      {
        title: '当前处理人',
        dataIndex: 'handlerName',
        width: 200,
      },
      {
        title: 'PD',
        dataIndex: 'creatorUserName',
        width: 200,
      },
      {
        title: '直接客户料号',
        dataIndex: 'immediateCustomerPartNumber',
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
      // {
      //   icon: 'icon-ym icon-ym-turn',
      //   onClick: handleTurn.bind(null, "unReview", index)
      //   // auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'unReview', index, record),
        // auth: 'btn_detail',
      },
      // {
      //   icon: 'icon-ym icon-ym-delete',
      //   modelConfirm: {
      //     onOk: onDelete.bind(null, index),
      //   },
      //   auth: 'btn_remove',
      // },
    ];
  }

  function onDelete(key: string | number) {
    const id = state.cacheUnReviewData[key]?.id;
    bulkDeletePcc([id]).then(({ code, msg }) => {
      if (code === 200) {
        message.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }

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
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   auth: 'btn_detail',
      // },
      // {
      //   icon: 'icon-ym icon-ym-btn-preview',
      //   onClick: handleDetail.bind(null, 'submitted', index),
      //   auth: 'btn_detail',
      // },
    ];
  }

  function handleTurn(type, index) {}

  function handleApprove(type, index, record) {
    const { tag } = record;
    if (tag == 'ED') {
      openFileList(true, {
        insidePartNumber: record.insidePartNumber,
        keyFieldName: 'insidePartNumber',
        downloadApi: fileDownload,
        useQuery: true,
        usePath: true,
        useMerge: false,
        listApi: getEngineeringDocApplyHistory,
        resultField: 'list',
      });
      return;
    }
    if (type == 'unReview') {
      openDetail(true, {
        index: index,
        mode: 'view',
        cacheList: state.cacheUnReviewData,
      });
    }
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    openExportModal(true, {
      api: exportExcelTomake,
      listQuery: {
        dataFilter: 3,
        ...unReviewFetchParams(),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
    });
  }

  function handleSubmit(rows) {
    openDetail(true, {
      index: 0,
      cacheList: rows,
    });
    closeModal();
  }

  async function getTypeOptions() {
    state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
    console.log(state.statusList);
  }

  function handleBatchEnable() {
    const selectedRowKeys = getUnReviewSelectRowKeys();
    if (selectedRowKeys?.length === 0) return message.error(t('common.selectText'));

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeEnableTip'),
      onOk: async () => {
        const { code, msg } = await bulkBackEnable(selectedRowKeys);
        if (code === 200) {
          clearUnReviewSelectRow();
          reloadTable(state.activeKey);
          return message.success(msg);
        }
      },
    });
  }

  function handleBatchDisable() {
    const selectedRowKeys = getUnReviewSelectRowKeys();
    if (selectedRowKeys?.length === 0) return message.error(t('common.selectText'));

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDisableTip'),
      onOk: async () => {
        const { code, msg } = await bulkBackDisable(selectedRowKeys);
        if (code === 200) {
          clearUnReviewSelectRow();
          reloadTable(state.activeKey);
          return message.success(msg);
        }
      },
    });
  }

  function handlePrint() {
    const ids = getUnReviewSelectRowKeys();

    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    setLoading(true);
    printPCCDetailByIds(ids).finally(() => {
      setLoading(false);
    });
  }
</script>
