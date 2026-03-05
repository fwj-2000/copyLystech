<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <BasicTable @register="unReviewRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_review'" @click="handleApprove('unReview', -1)" type="primary">{{ t('common.audit') }} </a-button>
                <a-button v-auth="'btn_reject'" @click="handleReject" type="primary" ghost>{{ t('common.rejectText') }} </a-button>
                <a-button v-auth="'btn_downloadDrawing'" type="primary" ghost @click="downloadFn('1')">{{ t('common.downloadDrawingText') }}</a-button>
                <!--                <a-button v-auth="'btn_batchRemove'" @click="handleDel">批量删除</a-button>-->
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ text, column, record, index }">
                <template v-if="column.dataIndex == 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'fileName'">
                  <a-button @click.stop="handlePreview(record)" type="link">{{ record.fileName }} </a-button>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="getunReviewActions(index, record)" />
                </template>
              </template>
            </BasicTable>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <BasicTable @register="reviewRegisterTable">
              <template #tableTitle>
                <a-button v-auth="'btn_downloadDrawing'" type="primary" ghost @click="downloadFn('2')">{{ t('common.downloadDrawingText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #bodyCell="{ column, index, text, record }">
                <template v-if="column.dataIndex == 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'fileName'">
                  <a-button @click.stop="handlePreview(record)" type="link">{{ record.fileName }} </a-button>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="getReviewActions(index, record)" />
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
    <DetailPopup @register="registerDetail" @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" />
    <RejectModal @register="registerRejectModal" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <FileListModal @register="registerFileList"></FileListModal>
    <ExportModal @register="registerExportModal" />
    <Preview ref="filePreviewRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { onMounted, reactive, toRefs, ref } from 'vue';
  import { STATUS_OPTIONS } from '/@/utils/status/index';
  import {
    bulkCommitEngineeringDocApply,
    bulkCommitPcc,
    bulkDeletePcc,
    exportExcelApplyPage,
    exportExcelTomake,
    getEngineeringDocApplyHistory,
    getPccHandlePage,
    rejectEngineeringDocApply,
    rejectPcc,
  } from '/@/api/engineering/pcc';
  import { getCheckUnReviewFormConfig, getUnReviewFormConfig } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/pcc/pccApply/components/DetailPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { isEmpty } from '/@/utils/is';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { FileListModal } from '/@/components/Upload';
  import { formatTableDefaultText } from '/@/utils';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Revocation from '/@/views/engineering/pcc/pccApply/components/Revocation.vue';
  import NotMade from '../pccApply/components/notMade.vue';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { downloadByUrl } from '/@/utils/file/download';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  defineOptions({ name: 'engineering-pcc-check' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();

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
    },
  ] = useTable({
    api: getPccHandlePage,
    columns: getUnReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      params.dataFilter = 3;
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
    formConfig: getCheckUnReviewFormConfig(),
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
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
    api: getPccHandlePage,
    columns: getUnReviewColumns(),
    bordered: true,
    beforeFetch: params => {
      params.dataFilter = 4;
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
      width: 60,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });

  function handleReview() {
    const rows = getUnReviewSelectRows();
    const pccList = [];
    const edList = [];
    rows.forEach(item => {
      if (item.tag == 'PCC') {
        pccList.push(item.id);
      } else {
        edList.push(item.id);
      }
    });
    console.log(pccList);
    console.log(edList);
    const pccPromise = bulkCommitPcc(pccList);
    const edPromise = bulkCommitEngineeringDocApply(edList);
    if (isEmpty(pccList)) {
      edPromise.then(({ code, msg }) => {
        if (code == 200) {
          return createMessage.success(msg);
        } else {
          return createMessage.error(msg);
        }
      });
    }
    if (isEmpty(edList)) {
      pccPromise.then(({ code, msg }) => {
        if (code == 200) {
          return createMessage.success(msg);
        } else {
          return createMessage.error(msg);
        }
      });
    }
    if (isEmpty(edList) || isEmpty(pccList)) return;
    Promise.all([pccPromise, edPromise]).then(([pccRet, edRet]) => {
      if (pccRet.code == 200 && edRet.code == 200) {
        message.success(t('common.submittedSuccessfully'));
        unReviewReload();
      } else {
        message.error(t('common.submittedFailed'));
      }
    });
  }

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
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      },
      {
        title: '需求类型',
        dataIndex: 'demandTypeName',
        i18nField: 'CommonCol.demandTypeName',
        width: 110,
      },
      {
        title: '版本',
        dataIndex: 'version',
        customRender: ({ record }) => {
          if (typeof record?.version === 'number') {
            return `T${record.version}`;
          } else {
            return '/';
          }
        },
        width: 80,
      },
      {
        title: '资料类型',
        dataIndex: 'docType',
        width: 100,
      },
      {
        title: '资料名称',
        dataIndex: 'fileName',
        width: 220,
      },
      {
        title: '直接客户名称',
        dataIndex: 'immediateCustomerCode',
        i18nField: 'CommonCol.immediateCustomerName',
        width: 160,
      },
      {
        title: '直接客户料号',
        dataIndex: 'immediateCustomerPartNumber',
        width: 180,
      },
      {
        title: '终端客户料号',
        dataIndex: 'terminalCustomerPartNumber',
        width: 180,
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        i18nField: 'CommonCol.factory',
        width: 120,
      },
      {
        title: '产品描述',
        dataIndex: 'productDesc',
        width: 120,
      },
      {
        title: 'PD',
        dataIndex: 'creatorUserName',
        width: 160,
      },
      {
        title: '当前处理人',
        dataIndex: 'handlerName',
        width: 160,
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        width: 100,
      },
      {
        title: '节点记录',
        dataIndex: 'nodeDetail',
        i18nField: 'CommonCol.nodeDetail',
        width: 100,
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

  const handleReject = async () => {
    const row = getUnReviewSelectRows();
    if (isEmpty(row)) return createMessage.warning(t('dict.Common.pleaseSelectTheDataToBeRejected'));
    const edList = [];
    const pccList = [];
    row.forEach(item => {
      if (item.tag == 'PCC') {
        pccList.push(item.id);
      } else if (item.tag == 'ED') {
        edList.push(item.id);
      }
    });
    if (!isEmpty(edList)) {
      return openRejectModal(true, {
        api: rejectEngineeringDocApply,
        ids: edList,
      });
    }
    if (!isEmpty(pccList)) {
      return openRejectModal(true, {
        api: rejectPcc,
        ids: pccList,
      });
    }
  };

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

  function getReviewActions(index, record): ActionItem[] {
    return [
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   // auth: 'btn_detail',
      //   ifShow: () => {
      //     // console.log()
      //     if (record.demandType == 'BusinessSamples' || record.demandType == 'EngineeringSamples') {
      //       return true;
      //     }
      //     return false;
      //   },
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'review', index, record),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleTurn(type, index) {}

  function handleRevocation(index) {
    openFormModal(true, { ...state.cacheReviewData[index] });
  }

  function handleApprove(type, index, record) {
    if (index == -1) {
      const datalist = getUnReviewSelectRows();
      if (isEmpty(datalist)) return createMessage.warning(t('common.selectText'));
      const isSame = datalist.every(item => item.tag === datalist[0].tag);
      if (!isSame) return createMessage.warning(t('dict.Common.pleaseSelectDataOfTheSameType'));
      if (datalist[0]?.tag == 'PCC') {
        openDetail(true, {
          index: 0,
          mode: hasBtnP('btn_review') ? 'edit' : 'view',
          cacheList: datalist,
          showReview: true,
          showReject: true,
        });
      } else {
        // 审核工程资料
        bulkCommitEngineeringDocApply(datalist.map(item => item.id)).then(({ code, msg }) => {
          if (code == 200) {
            createMessage.success(msg);
            reloadTable(state.activeKey);
          } else {
            message.error(msg);
          }
        });
      }
    } else {
      console.log(type, '11111');
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
          mode: hasBtnP('btn_review') ? 'edit' : 'view',
          cacheList: state.cacheUnReviewData,
          showReview: true,
          showReject: true,
          showSubmit: true,
        });
      }
      if (type == 'review') {
        openDetail(true, {
          index: index,
          mode: 'view',
          cacheList: state.cacheReviewData,
          showReview: false,
          showReject: false,
        });
      }
    }

    // if (type == 'unReview') {
    //   const list = state.cacheUnReviewData.filter(item => item.tag == 'PCC');
    //   if(isEmpty(list)) return
    //   openDetail(true, {
    //     index: index,
    //     mode: 'view',
    //     cacheList: list,
    //     showSubmit: true,
    //     showDialog: false,
    //     showReject: true,
    //   });
    // }
    // if (type === 'review') {
    //   const params = {};
    //   params.cacheList = state.cacheReviewData;
    //   if (index == -1) {
    //     params.index = 0;
    //     const rows = getUnReviewSelectRows();
    //     if (rows.length !== 0) {
    //       params.cacheList = rows;
    //     }
    //     params.sign = 'detail';
    //   }
    //   const list = params.cacheList.filter(item => item.tag == 'PCC');
    //   openDetail(true, {
    //     index: index,
    //     mode: 'view',
    //     cacheList: list,
    //     showSubmit: true,
    //     showDialog: false,
    //   });
    // }
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    openExportModal(true, {
      api: exportExcelApplyPage,
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

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  const filePreviewRef = ref();
  async function handlePreview(record) {
    const params = {
      name: record.fileName,
      url: record.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  /**
   * 移除URL中的API前缀部分，保留路径
   *
   * @param url - 原始URL字符串，可能包含域名或前缀路径
   * @returns {string} 处理后的路径字符串。当未找到/api前缀时返回原URL，
   *                   找到时返回从第一个/api开始的子路径（保留/api前缀）
   */
  function removeApiPrefix(url: string) {
    const apiIndex = url.indexOf('/api');
    return apiIndex === -1 ? url : url.slice(apiIndex);
  }

  async function downloadFn(tabKey: '1' | '2') {
    let rows = tabKey === '1' ? getUnReviewSelectRows() : getReviewSelectRows();
    if (rows.length) {
      for (let index = 0; index < 3; index++) {
        try {
          // 获取到的`filePath`是`http`开头的，在`https`协议下，存在安全限制，无法下载，因此去掉
          const path = removeApiPrefix(rows[index].filePath || '');
          path && downloadByUrl({ url: path, fileName: rows[index].fileName || '' });
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {}
      }
    } else {
      createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
  }
</script>
