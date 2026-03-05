<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white">
      <Grid>
        <template #toolbar-actions>
          <template v-if="isTodoPage">
            <!-- 审批 -->
            <a-button v-auth="'btn_review'" type="primary" @click="handleAudit">{{ t('common.audit') }}</a-button>
            <!-- 驳回 -->
            <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
            <!-- 转办 -->
            <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('common.transfer') }}</a-button>
            <!-- 催办 -->
            <a-button v-auth="'btn_urging'" @click="handleUrging">{{ t('common.UrgingText') }}</a-button>
          </template>
          <template v-else>
            <!-- 撤回 -->
            <ModelConfirmButton
              v-auth="'btn_recall'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
                type: 'primary',
              }">
              <span>{{ t('common.revoke') }}</span>
            </ModelConfirmButton>
            <!-- 退回修改 -->
            <a-button v-auth="'btn_returnUpdate'" type="primary" ghost @click="handleReturnUpdate">{{ t('dict.FilingsApplyDataStatusEnum.4') }}</a-button>
          </template>

          <a-dropdown v-if="hasBtnP('btn_engineeringDownload') || hasBtnP('btn_produceDownload')">
            <template #overlay>
              <a-menu @click="batchExport">
                <a-menu-item v-if="hasBtnP('btn_download')" key="current">{{ t('common.currentPageDatas') }} </a-menu-item>
                <a-menu-item v-if="hasBtnP('btn_engineeringDownload')" key="engineering">{{ t('dict.CustomsAffairsReviewTypeEnum.1') }} </a-menu-item>
                <a-menu-item v-if="hasBtnP('btn_produceDownload')" key="produce">{{ t('dict.CustomsAffairsReviewTypeEnum.2') }} </a-menu-item>
              </a-menu>
            </template>
            <a-button>{{ t('common.batchExport') }}</a-button>
          </a-dropdown>
          <a-button v-else-if="hasBtnP('btn_download')" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          <!-- 客户要求，`dynamicTableTitle`在这仅用于搜索，没有实际作用 -->
          <div>
            <DynamicTableTitle type="view" @change="handleCurrentCustomerChange" />
          </div>
        </template>
        <template #action="{ row }">
          <TableAction :actions="getTableActions(row)" />
        </template>
        <template #nodeDetail="{ row }">
          <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
        </template>
        <template #auditRecord="{ row }">
          <div class="table-a cursor-pointer" @click="handleAuditRecordModal(row)"> {{ t('common.detailText') }} </div>
        </template>
        <template #filingsApplyNo="{ row }">
          <span class="table-a" @click="goDetail(row)">{{ row.filingsApplyNo }}</span>
        </template>

        <template #DesensitizedDrawingsName="{ row }">
          <span class="table-a" @click="() => handlePreviewDrawing(row)">
            {{ row.desensitizedDrawingsName }}
          </span>
        </template>
      </Grid>
    </div>

    <NodeModal @register="registerNodeModal" />
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <ReturnUpdateModal @register="registerReturnUpdateModal" @reload="reload" />
    <AuditRecordModal @register="registerAuditRecordModal" />
    <PreviewModal ref="filePreviewRef" />
    <!-- 驳回 -->
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <!-- 催办 -->
    <UrgingModal @register="registerUrgingModal" />

    <Teleport defer to="#LogisticAffairsExportFilingsDemand">
      <ApplyPop @register="registerApplyPop" @refresh="reload" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { columns, getSchemas, getColumnsDone } from './tableConfig';
  import {
    getCsAffairsReviewList,
    exportCsAffairsReview,
    bulkTransfer,
    bulkBackReview,
    bulkReturnUpdate,
    engineeringExport,
    produceExport,
    bulkReject,
  } from '/@/api/business/filingLogReview';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TABS_ENUM } from '../config';
  import { getNodeList } from '/@/api/customerSerivce/customsAffairsApply';
  import { downloadByUrl } from '/@/utils/file/download';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { ModelConfirmButton } from '/@/components/Button';
  import { PreviewModal } from '/@/components/Upload';
  import { NodeModal, TransferModal, RejectModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPop from './ApplyPop.vue';
  import ReturnUpdateModal from './returnUpdate.vue';
  import AuditRecordModal from '/@/views/engineering/filings/maintain/components/auditRecordModal.vue';
  import DynamicTableTitle from '/@/views/logisticAffairs/export/filings/maintain/components/dynamicTableTitle/index.vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import UrgingModal from './urgingModal.vue';

  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
  });

  const { createMessage } = useMessage();

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  /** 是否为`待处理`页面 */
  const isTodoPage = computed(() => props.type === TABS_ENUM.待处理);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      wrapperClass: 'grid grid-cols-5 gap-1',
      commonConfig: {
        labelClass: 'w-0',
      },
      schema: getSchemas(isTodoPage.value),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `logisticAffairs-export-filings-demand-${isTodoPage.value ? 'todo' : 'done'}`,
      showIndexColumn: true,
      // @ts-ignore
      columns: isTodoPage.value ? columns : getColumnsDone(),
      api: getCsAffairsReviewList,
      beforeFetch: (params: any) => {
        params.identification = props.type;
        params.customerConfigId = customerConfigId.value;
        return params;
      },
      rowConfig: {
        keyField: 'id',
      },
      pagerConfig: {
        autoHidden: false,
        pageSize: 100,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  function reload() {
    gridApi.reload();
  }

  function goDetail(record) {
    const { id } = record;
    openMenuPopup(true, {
      ids: [id],
      type: 'view',
      title: t('common.view'),
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
      },
    ];
  }
  const handleExport = async () => {
    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportCsAffairsReview,
      listQuery: { ...params, ...omit(pager, 'total'), identification: props.type, customerConfigId: customerConfigId.value },
      exportOptions: isTodoPage.value ? columns : getColumnsDone(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FilingsApplyColumn',
      },
    });
  };
  const handleAudit = async () => {
    const idList = gridApi.getSelectRows();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }
    // if (idList.some(el => el.Status != 2)) {
    //   return message.warning(t('common.onlyToAduit'));
    // }
    openMenuPopup(true, {
      ids: idList.map(el => {
        return el.id;
      }),
      title: t('common.editText'),
    });
  };

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  // 转办
  function handleTransfer() {
    const ids = gridApi.getSelectRowKeys();
    if (ids.length === 0) {
      createMessage.info(t('common.selectText'));
    } else {
      openTransferModal(true, {
        id: ids,
        api: bulkTransfer,
        beforeFetch: params => {
          return {
            ids: ids,
            transferUserId: params.transferUser,
            transferRemarks: params.remark,
          };
        },
      });
    }
  }

  // 撤回
  const handleRecall = async () => {
    const idList = gridApi.getSelectRowKeys() || [];
    if (idList.length) {
      return bulkBackReview(idList).then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        gridApi.clearSelectedRowKeys();
        reload();
      });
    }
    createMessage.info(t('common.selectText'));
  };

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点详情 */
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  const [registerReturnUpdateModal, { openModal: openReturnUpdateModal }] = useModal();
  /**
   * 退回修改
   */
  function handleReturnUpdate() {
    const idList = gridApi.getSelectRowKeys() || [];
    if (idList.length === 0) {
      return createMessage.info(t('common.selectText'));
    }
    openReturnUpdateModal(true, {
      api: bulkReturnUpdate,
      beforeFetch: (formData: any) => {
        return {
          ids: idList,
          ...formData,
        };
      },
    });
  }

  const [registerAuditRecordModal, { openModal: openAuditRecordModal }] = useModal();
  /** 节点详情 */
  function handleAuditRecordModal(record: any) {
    openAuditRecordModal(true, {
      id: record.id,
    });
  }

  function batchExport({ key }: { key: 'current' | 'engineering' | 'produce' }) {
    if (key === 'current') {
      handleExport();
    } else {
      handleExportResource(key);
    }
  }

  /**
   * 导出工程备案资料或者生产备案资料
   * @param key
   */
  function handleExportResource(key: 'engineering' | 'produce') {
    const idList = gridApi.getSelectRowKeys() || [];
    if (idList.length === 0) {
      return createMessage.info(t('common.selectText'));
    }

    const api = key === 'engineering' ? engineeringExport : produceExport;

    gridApi.setLoading(true);
    api(idList)
      .then(res => {
        downloadByUrl({ url: res.data?.url });
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  }

  const filePreviewRef = ref<InstanceType<typeof PreviewModal>>();
  function handlePreviewDrawing(row: { desensitizedDrawingsId: string }) {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        Id: row.desensitizedDrawingsId,
        previewType: 'localPreview',
        filePath: '',
        url: '',
        fileList: [],
        // @ts-ignore
        name: row.desensitizedDrawingsName,
      });
  }

  const customerConfigId = ref<string | number>('');
  // 更新表头
  const handleCurrentCustomerChange = (e: number | string) => {
    // 拿到表头列表，重新排列显示
    customerConfigId.value = e;
    gridApi.reload();
  };

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 驳回
   */
  const handleReject = async () => {
    const idList = gridApi.getSelectRowKeys();

    if (idList.length === 0) {
      return createMessage.info(t('common.selectText'));
    }
    return openRejectModal(true, {
      api: bulkReject,
      beforeFetch: (params: any) => {
        return {
          ids: idList,
          rejectRemark: params.rejectRemark,
        };
      },
    });
  };

  const [registerUrgingModal, { openModal: openUrgingModal }] = useModal();
  /** 催办 */
  function handleUrging() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.info(t('common.selectText'));
    }
    openUrgingModal(true, { list: rows });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
