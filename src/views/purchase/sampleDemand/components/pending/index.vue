<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_reply'" type="primary" @click="handleReply">
                {{ t('common.replyText') }}
              </a-button>
              <a-button v-auth="'btn_reject'" ghost type="primary" @click="handleReject">
                {{ t('common.rejectText') }}
              </a-button>
              <a-button v-auth="'btn_email'" type="primary" ghost @click="handleSendEmail">
                {{ t('common.sendEmail') }}
              </a-button>
              <a-button v-auth="'btn_transfer'" @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
              <!-- <a-button v-auth="'btn_download'" @click="handleSelectedExport">{{ t('common.batchExport') }}</a-button> -->
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ rowIndex, row }">
            <i class="icon-ym icon-ym-btn-preview text-orange-400 cursor-pointer mx-1" @click="handleEdit(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>

    <!-- <ExportModal @register="registerExportModal" /> -->
    <NodeModal @register="registerNodeModal"></NodeModal>
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <Teleport to="#PurchaseSampleDemand">
      <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
      <ViewDetail @register="registerDetail" @reload="reload" />
      <SendEmailPopup @register="registerSendEmailPopup" @reload="reload" />
      <ReplyPopup @register="registerReplyPopup" @reload="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { /* omit, */ pick } from 'lodash-es';
  import { getNodeList, /* exportExcel, */ rejectPro, handlePageList, replyPurchase, bulkTransfer, exportSelectExcel } from '/@/api/engineering/sample';
  import ViewDetail from '/@/views/engineering/sampleApply/components/ViewPopup.vue';
  import ReplyPopup from './replyPopup.vue';
  import SendEmailPopup from './sendEmailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  // import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RejectModal, TransferModal } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn, importColumn } from './configVxe';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { downloadByUrl } from '/@/utils/file/download';
  import { ImportModal } from '/@/components/ImportModal';
  import {
    downloadImportTemplate,
    importPreviewBatch,
    importSaveBatch,
    getImportTask,
    cancelImportTask,
    getImportTaskData,
    importTaskRead,
  } from '/@/api/purchase/sample';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { dateUtil } from '/@/utils/dateUtil';

  defineOptions({ name: 'engineering-sampleApply' });
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'purchase-sampleDemand-pending-list',
      columns: getColumn(),
      api: params => {
        console.log(params);
        return handlePageList({ ...params, ...getFetchParams(), isHandle: false });
      },
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        // searchField: ['requestStartDate', 'requestEndDate'],
        if (params.applyDate && params.applyDate.length > 0) {
          params.applyDateStart = dateUtil(params.applyDate[0]).format('YYYY-MM-DD');
          params.applyDateEnd = dateUtil(params.applyDate[1]).format('YYYY-MM-DD');
          delete params.applyDate;
        }
        if (params.requestArrivalDate && params.requestArrivalDate.length > 0) {
          params.requestArrivalDateStart = dateUtil(params.requestArrivalDate[0]).format('YYYY-MM-DD');
          params.requestArrivalDateEnd = dateUtil(params.requestArrivalDate[1]).format('YYYY-MM-DD');
          delete params.requestArrivalDate;
        }
        return params;
      },
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    },
  });

  const { getSelectRowKeys, getFetchParams, reload, clearSelectedRowKeys } = gridApi;

  const handleEdit = (_, record: any) => {
    openDetail(true, {
      ...record,
      isShowReplyInfo: true,
      isCanEdit: hasBtnP('btn_reply'),
      api: (_, formData, isSubmit) => {
        const data = pick(formData, ['id', 'replySizeLong', 'replySizeWide', 'replyQty', 'arrivalDate', 'expressInformation', 'replyRemark']);
        return replyPurchase([data], isSubmit);
      },
    });
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const handleBatchTransfer = async () => {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.transferredDeliveryDateTip'));
    }
    openTransferModal(true, {
      id: ids || [],
      submitCallback: (params: any) =>
        bulkTransfer({
          idList: params.id,
          handlerId: params.transferUser,
          remark: params.remark,
        }).then(res => {
          clearSelectedRowKeys();
          return res;
        }),
    });
  };

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 驳回
   */
  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];

    if (idList.length) {
      return openRejectModal(true, {
        api: rejectPro,
        beforeFetch: params => {
          return {
            idList: idList,
            remark: params.rejectRemark,
          };
        },
      });
    }
    message.info(t('common.selectText'));
  };

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleSelectedExport;
    openMethod();
  }

  // const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  //导入
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importPreviewBatch,
      importSaveApi: importSaveBatch,
      templateApi: downloadImportTemplate,
      previewColumn: importColumn,
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    });
  };

  // 导出
  // const handleExport = async () => {
  //   const params = await getFetchParams();
  //   const { pager } = gridApi.grid.getProxyInfo()!;

  //   openExportModal(true, {
  //     listQuery: { ...params, ...omit(pager, 'total'), isPurchaseUser: true },
  //     api: exportExcel,
  //     exportOptions: getColumn().slice(2, -1),
  //     nameProps: 'title',
  //     idProps: 'field',
  //     i18nConfig: {
  //       moduleCode: 'SampleApplyColumn',
  //     },
  //   });
  // };

  // 获取选中行导出
  const handleSelectedExport = async () => {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    const res = await exportSelectExcel({ ids: idList.join(',') });
    if (res.code === 200) {
      downloadByUrl({
        url: res.data.url,
      });
      clearSelectedRowKeys();
      reload();
    }
  };

  const [registerSendEmailPopup, { openPopup: openSendEmailPopup }] = usePopup();
  /**
   * 发送邮件
   */
  function handleSendEmail() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openSendEmailPopup(true, { ids: idList });
  }

  const [registerReplyPopup, { openPopup: openReplyPopup }] = usePopup();
  /**
   * 回复
   */
  function handleReply() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openReplyPopup(true, { ids: idList });
  }

  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    openReplyPopup(true, { ids: [params.id] });
  });
</script>
