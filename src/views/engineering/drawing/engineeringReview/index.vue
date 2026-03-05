<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <GridPending>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleReview"> {{ t('dict.DrawingsReview.OriginType.3') }} </a-button>
                <a-button v-auth="'btn_attach'" @click="handleAttachUpload" type="primary" ghost>
                  {{ t('dict.DrawingsReviewColumn.DfmAttachmentUpload') }}
                </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer"> {{ t('common.transfer') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleToBeExport">{{ t('common.exportText') }} </a-button>
              </template>
              <template #desensitizedDrawingsName="{ row }">
                <template v-if="row.desensitizedDrawingsName">
                  <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
                    <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
                  </a-tooltip>
                  <span class="table-a" @click="handlePreview(row)">{{ row.desensitizedDrawingsName }}</span>
                </template>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #openDetail="{ row }">
                <span class="table-a" @click="routeDetail(row)" preIcon="icon-ym icon-ym-report-icon-preview-pdf">{{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ $rowIndex, row }">
                <TableAction outside :actions="getTobeActions($rowIndex, row)" />
              </template>
            </GridPending>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_download'" @click="handleSubmittedExport">{{ t('common.exportText') }} </a-button>
                  <a-button v-auth="'btn_recall'" type="primary" ghost @click="handleBatchRevocation">{{ t('common.revoke') }}</a-button>
                </a-space>
              </template>
              <template #desensitizedDrawingsName="{ row }">
                <template v-if="row.desensitizedDrawingsName">
                  <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
                    <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
                  </a-tooltip>
                  <span class="table-a" @click="handlePreview(row)">{{ row.desensitizedDrawingsName }}</span>
                </template>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #openDetail="{ row }">
                <span class="table-a" @click="routeDetail(row)" preIcon="icon-ym icon-ym-report-icon-preview-pdf">{{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ $rowIndex, row }">
                <TableAction outside :actions="getSubmittedActions($rowIndex, row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailListModal @register="registerDetailList" />
    <AttachUploadPopup @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" @register="registerAttachUpload" />
    <Revocation
      @register="registerForm"
      @reload="
        () => {
          reloadTable(activeKey);
        }
      " />
    <ExportModal @register="registerExportModal" />
    <Preview ref="filePreviewRef" />
    <TransferModal @register="registerTransferModal" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <BatchAttachment @register="registerBatchAttachment" @reload="reloadTable(activeKey)" />
    <DetailPopup @register="registerDetailPopup" @reload="reloadTable(activeKey)" />
    <FileListModal @register="registerFileList"></FileListModal>
  </div>
</template>
<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { columns, getPendingFormSchema, originGetColumns, waitFormConfigSchema } from '/@/views/engineering/drawing/engineeringReview/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deleteDrawingsReview, getDrawingsReviewApplypage } from '/@/api/engineering/engineeringReview';
  import { onMounted, reactive, ref, toRefs, unref, toRaw } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailListModal from '/@/views/engineering/drawing/drawingReview/components/DetailListModal.vue';
  import Revocation from './components/Revocation.vue';
  import AttachUploadPopup from './components/AttachUploadPopup.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import { exportExportExcelApplyPageList, getDrawingsReviewUnreviewedList, postDrawingsReviewTransfer } from '/@/api/engineering/drawingReview';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { cloneDeep } from 'lodash-es';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import DetailPopup from '../components/DetailPopup.vue';
  import BatchAttachment from '../components/BatchAttachment.vue';
  import { isEmpty } from '/@/utils/is';
  import { ModeTypeEnum } from '/@/enums/modeEnum';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { FileListModal } from '/@/components/Upload';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { getDrawingsHistory, getFileInfoHistory } from '/@/api/common/files';

  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerBatchAttachment, { openPopup: openBatchAttachment }] = usePopup();

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-drawing-engineeringReview' });

  const state = reactive({
    activeKey: '1',
    statusList: [],
    originCacheList: [],
    tobeCacheList: [],
    submittedCacheList: [],
    DFMList: [],
    reviewResultList: [],
    MakeEngineeringInfoList: [],
  });
  const filePreviewRef = ref<any | null>(null);
  const { createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { activeKey, statusList } = toRefs(state);
  const [registerModal, { openModal, closeModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerDetailList, { openModal: openDetailList }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerFileList, { openModal: openFileList }] = useModal();

  async function getTypeOps() {
    state.DFMList = await baseStore.getDictionaryData('DrawingsReview.DFM');
    state.MakeEngineeringInfoList = await baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo');
    state.reviewResultList = await baseStore.getDictionaryData('DrawingsReview.ReviewResult');
    state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
  }

  const [Grid, { reload: originReload, getSelectRows: originGetSelectRows, clearSelectedRowKeys: originClearSelectedRowKeys }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: waitFormConfigSchema(),
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-drawing-engineeringReview-todo',
      api: getDrawingsReviewUnreviewedList,
      beforeFetch: params => {
        params.current = true;
        return params;
      },
      columns: originGetColumns(),
      rowConfig: {
        keyField: 'id',
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  const [
    GridPending,
    {
      reload: reloadToBe,
      getFetchParams: getFetchParamsTobe,
      getSelectRows: getSelectRowsTobe,
      getSelectRowKeys: getSelectRowsKeyTobe,
      clearSelectedRowKeys: clearSelectedRowKeysTobe,
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getPendingFormSchema(),
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      api: getDrawingsReviewApplypage,
      columns: columns,
      id: 'engineering-drawing-engineeringReview-pending',
      rowConfig: {
        keyField: 'id',
      },
      beforeFetch: params => {
        params.dataFilter = 1;
        params.current = 1;
        return params;
      },
      afterFetch: data => {
        state.tobeCacheList = data.list;
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  const [GridDone, { reload: reloadSubmitted, getFetchParams: getFetchParamsSubmitted, getSelectRows: getSelectSubmitted }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: waitFormConfigSchema(),
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      api: getDrawingsReviewApplypage,
      columns: columns,
      id: 'engineering-drawing-engineeringReview-pending',
      rowConfig: {
        keyField: 'id',
      },
      beforeFetch: params => {
        params.dataFilter = 2;
        return params;
      },
      afterFetch: data => {
        state.submittedCacheList = data.list;
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  function handlePreview(record) {
    const params = {
      name: record.desensitizedDrawingsName,
      Id: record.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleDel() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        const selectedRowKeys = getSelectRowsKeyTobe();
        if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));

        const { code, msg } = await deleteDrawingsReview(selectedRowKeys);
        if (code === 200) {
          clearSelectedRowKeysTobe();
          reloadTable(state.activeKey);
          return message.success(msg);
        }
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

  function handleTransfer(id = '') {
    const idList = getSelectRowsTobe();
    if (!idList.length) return createMessage.warning(t('dict.PCCApplyColumn.selectTransferContent'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await postDrawingsReviewTransfer({
      list: id,
      remark: data.remark,
      reviewUserId: data.transferUser,
    });
    return r;
  };

  function reloadTable(e) {
    if (e == 1) {
      reloadToBe();
    } else {
      reloadSubmitted();
    }
  }

  function handleAttachUpload() {
    const rows = getSelectRowsTobe();
    if (rows.length <= 0) {
      return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToUploadAttachment'));
    }
    openBatchAttachment(true, {
      list: toRaw(rows),
    });
  }

  function getOriginActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, 'origin', index, record),
        auth: 'btn_detail',
      },
    ];
  }

  function getTobeActions(index, record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleDetail.bind(null, 'toBe', record),
        auth: 'btn_detail',
      },
    ];
  }

  function onDelete(record) {
    deleteDrawingsReview([record.id]).then(({ code, msg }) => {
      if (code === 200) {
        message.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }

  function routeDetail(record) {
    // modalRef.value.setVisible(true, state.current);
    openDetailList(true, { ...record });
  }

  function getSubmittedActions(index, row): ActionItem[] {
    return [
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, 'submitted', row),
        auth: 'btn_detail',
      },
    ];
  }

  function handleDetail(type, row) {
    openDetailPopup(true, {
      list: [row],
      mode: type === 'submitted' ? ModeTypeEnum.VIEW : ModeTypeEnum.EDIT,
      index: 0,
    });
  }

  function handleApprove(type, index) {
    if (type == 'toBe') {
      openModal(true, {});
    } else if (type == 'submitted' && index == -1) {
      const rows = getSelectRowsTobe();
      if (rows.length <= 0) {
        return createMessage.warning(t('dict.DrawingsReviewColumn.selectDataForReview'));
      }
    }
  }

  function handleReview() {
    const rows = getSelectRowsTobe();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openDetailPopup(true, {
      list: rows,
      index: 0,
    });
  }

  function handleRevocation(index) {
    openFormModal(true, { ...state.submittedCacheList[index] });
  }

  function handleBatchRevocation() {
    const rows = getSelectSubmitted();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openFormModal(true, { list: rows });
  }

  function handleToBeExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      api: exportExportExcelApplyPageList,
      listQuery: {
        dataFilter: 1,
        ...getFetchParamsTobe(),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    });
  }

  // 打开脱敏图纸列表弹框
  function handleDesensitizeList(row) {
    openFileList(true, {
      id: row.desensitizedDrawingsId,
      keyFieldName: 'id',
      params: {
        current: true,
      },
      downloadApi: fileDownload,
      useQuery: true,
      usePath: true,
      useMerge: false,
      listApi: getFileInfoHistory,
    });
  }

  function handleSubmittedExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      api: exportExportExcelApplyPageList,
      listQuery: {
        dataFilter: 2,
        ...getFetchParamsSubmitted(),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    });
  }

  function getOriginTypeByCode(code) {
    const map = {
      // 量试
      Quantitative: 1,
      // 报价
      QuotationRequirements: 2,
      // 图纸评审
      DrawingsReviewReq: 3,
    };

    return map[code] || '';
  }

  useRouteParams({ id: {}, sign: {}, openDetail: {}, billNo: {}, partNumber: {}, demandType: {} }, params => {
    if (params.openDetail === 'true') {
      getTypeOps();
      const openDetail = params.openDetail;
      const id = params.id;
      if (id) {
        // openDrawingDetail(true, { detailId: id });
        openDetailPopup(true, {
          list: [{ id: id, originCode: params.billNo, insidePartNumber: params.partNumber, originType: getOriginTypeByCode(params.demandType) }],
          index: 0,
        });
      }
    } else {
      if (!params.id) return;
      getDrawingsReviewUnreviewedList({ id: params.id }).then(res => {
        if (!res.data?.list?.length) {
          getDrawingsReviewApplypage({ id: params.id }).then(res1 => {
            if (!res1.data?.list?.length) return createMessage.warning(t('dict.DrawingsReviewColumn.jumpDetailDataNotExists'));
            // openDrawingDetail(true, { index: 0, cacheList: res.data.list });
            openDetailPopup(true, { list: [res1.data.list[0]], index: 0 });
          });
        } else {
          // 这里加个else, 解决res.data.list为空数组时,进入详情弹窗报错
          // openDrawingDetail(true, { index: 0, cacheList: res.data.list }); //{detailId: params.id,sign:params.sign??'detail'});
          openDetailPopup(true, { list: [res.data.list[0]], index: 0 });
        }
      });
    }
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
