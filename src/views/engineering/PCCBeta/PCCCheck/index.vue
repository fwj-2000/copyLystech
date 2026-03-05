<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')" v-loading="loading">
            <UnReviewGrid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" @click="handleApprove('unReview', -1)" type="primary">{{ t('common.audit') }} </a-button>
                <a-button v-auth="'btn_reject'" @click="handleReject" type="primary" ghost>{{ t('common.rejectText') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }}</a-button>
                <a-button v-auth="'btn_downloadDrawing'" type="primary" ghost @click="downloadFn('1')">{{ t('common.downloadEngineDrawingText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="() => handleUnReviewExport(3)">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
              </template>
              <template #fileName="{ row }">
                <div class="table-a" @dblclick.stop="handlePreview(row)" type="link">{{ row.fileName }} </div>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction :actions="getunReviewActions(rowIndex, row)" />
              </template>
            </UnReviewGrid>
          </a-tab-pane>

          <a-tab-pane key="2" :tab="t('common.doneText')">
            <ReviewGrid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_download'" @click="() => handleUnReviewExport(4)">{{ t('views.business.quota.export') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @dblclick="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #fileName="{ row }">
                <span class="table-a" @dblclick.stop="handlePreview(row)" type="link">{{ row.fileName }} </span>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="getReviewActions(rowIndex, row)" />
              </template>
            </ReviewGrid>
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
    <DetailPopup @register="registerDetail" @reload="reloadTable(activeKey)" />
    <RejectModal @register="registerRejectModal" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <FileListModal @register="registerFileList"></FileListModal>
    <ExportModal @register="registerExportModal" />
    <Preview ref="filePreviewRef" />

    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, toRefs, ref } from 'vue';
  import {
    bulkCommitEngineeringDocApply,
    exportExcelApplyPage,
    getEngineeringDocApplyHistory,
    getPccHandlePage,
    rejectEngineeringDocApply,
    rejectPcc,
    pccCheckTransfer,
    getPccDetail,
  } from '/@/api/engineering/pcc';
  import { getUnReviewColumns, reviewSchemas, unReviewSchemas } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, omit } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, RejectModal, TransferModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { isEmpty } from '/@/utils/is';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { FileListModal } from '/@/components/Upload';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import Revocation from '/@/views/engineering/pcc/pccApply/components/Revocation.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import { useDownloadQueue } from '/@/hooks/files/useDownloadQueue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  defineOptions({ name: 'engineering-PCC-check' });
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
    cacheUnReviewData: Array<any>;
    cacheReviewData: Array<any>;
    statusList: Array<any>;
  }

  const state = reactive<StateType>({
    activeKey: '1',
    cacheUnReviewData: [],
    cacheReviewData: [],
    statusList: [],
  });
  const { activeKey } = toRefs(state);

  const [UnReviewGrid, unReviewGridApi] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: unReviewSchemas,
      i18nConfig: {
        moduleCode: 'PCCColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCCheck-list-wait',
      columns: getUnReviewColumns(),
      rowConfig: {
        keyField: 'id',
      },
      api: getPccHandlePage,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: (params: any) => {
        params.dataFilter = 3;
        if (params.time && params.time.length > 0) {
          params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
          params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
          delete params.time;
        }
        return params;
      },
      afterFetch: (data: any) => {
        state.cacheUnReviewData = data.list;
      },
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
  });

  const [ReviewGrid, reviewGridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: reviewSchemas,
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCCheck-list-done',
      columns: getUnReviewColumns(),
      rowConfig: {
        keyField: 'id',
      },
      api: getPccHandlePage,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: (params: any) => {
        params.dataFilter = 4;
        if (params.time && params.time.length > 0) {
          params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
          params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
          delete params.time;
        }
        return params;
      },
      afterFetch: (data: any) => {
        state.cacheReviewData = data.list;
      },
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
  });

  function reloadTable(e) {
    if (e == 1) {
      unReviewGridApi.reload();
    } else {
      reviewGridApi.reload();
    }
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

  const handleReject = async () => {
    const rows = unReviewGridApi.getSelectRows();
    if (rows.length === 0) return createMessage.warning(t('dict.Common.pleaseSelectTheDataToBeRejected'));
    const edList: Array<string> = [];
    const pccList: Array<string> = [];
    rows.forEach(item => {
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

  function handleRevocation(index) {
    openFormModal(true, { ...state.cacheReviewData[index] });
  }

  /** 加载遮罩 */
  const loading = ref<boolean>(false);

  const addOriginVersion = (item: any) => ({ ...item, originVersion: item.version });

  const getAuditMode = () => (hasBtnP('btn_review') ? ModeTypeEnum.AUDIT_EDIT : ModeTypeEnum.VIEW);

  function openEdHistory(record: any) {
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
  }

  function openPccDetail(index: number, cacheList: any[], options: Recordable = {}) {
    const { mode = getAuditMode(), showReview = true, showReject = true, showSubmit = false } = options;
    openDetail(true, {
      index,
      cacheList,
      mode,
      showReview,
      showReject,
      showSubmit,
    });
  }

  function handleBatchApprove() {
    const datalist = unReviewGridApi.getSelectRows();
    if (!datalist.length) return createMessage.warning(t('common.selectText'));

    const [first] = datalist;
    const hasMixedType = datalist.some(item => item.tag !== first.tag);
    if (hasMixedType) return createMessage.warning(t('dict.Common.pleaseSelectDataOfTheSameType'));

    if (first.tag === 'PCC') {
      return openPccDetail(0, datalist.map(addOriginVersion));
    }

    loading.value = true;
    bulkCommitEngineeringDocApply(datalist.map(item => item.id))
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          reloadTable(state.activeKey);
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function handleApprove(type, index, record?: any) {
    if (index === -1) {
      return handleBatchApprove();
    }

    if (!record) return;
    if (record.tag === 'ED') return openEdHistory(record);

    if (type === 'unReview') {
      return openPccDetail(index, state.cacheUnReviewData.map(addOriginVersion), { showSubmit: true });
    }

    openPccDetail(index, state.cacheReviewData, {
      mode: ModeTypeEnum.VIEW,
      showReview: false,
      showReject: false,
    });
  }

  /**
   * 导出
   * @param dataFilter 3: 未处理, 4: 已处理
   */
  async function handleUnReviewExport(dataFilter: 3 | 4) {
    const exportColumns = cloneDeep(getUnReviewColumns());
    const params = await unReviewGridApi.getFetchParams();
    const { pager } = unReviewGridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcelApplyPage,
      listQuery: {
        dataFilter,
        ...params,
        ...omit(pager, 'total'),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
    });
  }

  async function getTypeOptions() {
    state.statusList = (await baseStore.getDictionaryData('DrawingsReview.Status')) as Array<any>;
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
    console.log('🚀 ~ handlePreview ~ params: ', params);
    filePreviewRef.value?.init(params);
  }

  const { startDownload } = useDownloadQueue();
  function downloadFn(tabKey: '1' | '2') {
    let rows = tabKey === '1' ? unReviewGridApi.getSelectRows() : reviewGridApi.getSelectRows();
    startDownload(rows);
  }

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  function handleTransfer() {
    const rows = activeKey.value === '1' ? unReviewGridApi.getSelectRows() : reviewGridApi.getSelectRows();

    if (!rows.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: rows || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    // const { id } = unref(data);
    const rows = activeKey.value === '1' ? unReviewGridApi.getSelectRows() : reviewGridApi.getSelectRows();

    const r = await pccCheckTransfer({
      list: rows.map(item => ({ id: item.id, originType: item.originType })),
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  useRouteParams({ id: {} }, params => {
    if (params.id) {
      getPccDetail({ id: params.id }).then(res => {
        if (res.data?.status === 2) {
          openDetail(true, {
            index: 0,
            mode: hasBtnP('btn_review') ? ModeTypeEnum.AUDIT_EDIT : ModeTypeEnum.VIEW,
            cacheList: [{ ...res.data, originVersion: res.data.version }],
            showReview: true,
            showReject: true,
            // showSubmit: true,
          });
        } else {
          openDetail(true, {
            index: 0,
            mode: 'view',
            cacheList: [{ ...res.data, originVersion: res.data.version }],
            showReview: false,
            showReject: false,
          });
        }
      });
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .ant-tabs.ant-tabs-top,
    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }
</style>
