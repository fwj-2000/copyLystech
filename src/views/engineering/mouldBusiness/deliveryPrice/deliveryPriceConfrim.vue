<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white" v-loading="isLoading">
        <Grid>
          <template #toolbar-actions v-if="props.searchKey === '1'">
            <!-- 撤回 -->
            <a-button v-auth="'btn_recall'" type="primary" @click="revokeFn">{{ t('common.revoke') }}</a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 批量导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #toolbar-actions v-else>
            <!-- 同意 -->
            <a-button v-auth="'btn_agree'" type="primary" @click="handleAgree">{{ t('common.agree') }}</a-button>
            <!-- 驳回 -->
            <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 转办 -->
            <a-button v-auth="'btn_transfer'" @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
            <!-- 批量导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #moldDrawings="{ row }">
            <FileListCell :row="row" :list="row.moldDrawings" />
          </template>

          <template #nodeRecord="{ row }">
            <a class="table-a" @click="openNodeRecordModalFn(row)">{{ t('dict.CommonCol.nodeDetail') }}</a>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerModal" @reload="initFn" />
    <NodeModal @register="registerNodeRecord" />
    <RejectModal @register="registerRejectModal" @reload="initFn" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref } from 'vue';
  import { COLUMNS, getSchema, downloadMoldDrawings, STATUS_ENUM } from './config';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import {
    getDeliveryconfirmpaget,
    exportDeliveryconfirm,
    bulkDeliveryconfirmwithdrawe,
    transferRequirementReviewPage,
    getNodelist,
    bulkDeliveryconfirmagree,
    bulkDeliveryconfirmReject,
  } from '/@/api/engineering/mould';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import RejectModal from '/@/components/CustomComponents/src/RejectModal.vue';

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const { t } = useI18n();
  const isLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal }] = useModal();

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
      schema: getSchema(props.searchKey === '0'),
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `engineering-mouldBusiness-deliveryPrice-${props.searchKey === '0' ? 'todo' : 'done'}`,
      api: getDeliveryconfirmpaget,
      columns: COLUMNS,
      expandConfig: {
        padding: true,
        expandAll: false,
      },
      beforeFetch: formatParams,
      pagerConfig: {
        pageSize: 20,
      },
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
      },
    },
  });
  const { getSelectRows, clearSelectedRowKeys, reload, getFetchParams } = gridApi;

  /** 请求参数格式化 */
  function formatParams(params: any) {
    const obj = { ...params };
    obj.type = props.searchKey;
    if (Array.isArray(params.time)) {
      obj.startTime = params.time[0];
      obj.endTime = params.time[1];
      delete obj.time;
    }
    return obj;
  }

  const { createMessage, createConfirm } = useMessage();

  /** 撤回 */
  function revokeFn() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    /** 只有状态为【驳回】的数据才能执行撤回操作 */
    if (rows.some(item => `${item.status}` !== STATUS_ENUM.驳回)) {
      return createMessage.warning(t('common.onlyRevertRejectedDataTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.withdrawSelectedData'),
      onOk: async () => {
        const { code } = await bulkDeliveryconfirmwithdrawe(rows.map(item => item.id));
        if (code === 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          initFn();
        }
        return true;
      },
    });
  }

  /** 下载图纸 */
  function downloadFn() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
    downloadMoldDrawings(rows);
  }

  /** 导出 */
  function handleExport() {
    openExportModal(true, {
      api: exportDeliveryconfirm,
      listQuery: formatParams(getFetchParams()),
      exportOptions: COLUMNS,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  /** 同意 */
  function handleAgree() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    // 判断【单据类型(`itemType`)】是否一致，不一致则提示用户，不允许该操作
    const itemType = rows[0].itemType;
    if (rows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchConsentTip'),
      onOk: async () => {
        const { code } = await bulkDeliveryconfirmagree(rows.map(item => item.id));
        if (code === 200) {
          createMessage.success(t('sys.api.operationSuccess'));
          initFn();
        }
        return true;
      },
    });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /** 驳回 */
  function handleReject() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    // 判断【单据类型(`itemType`)】是否一致，不一致则提示用户，不允许该操作
    const itemType = rows[0].itemType;
    if (rows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    openRejectModal(true, {
      ids: rows.map(item => item.id),
      api: bulkDeliveryconfirmReject,
    });
  }

  function clearAllSelectRowKeys() {
    clearSelectedRowKeys();
  }

  function initFn() {
    clearAllSelectRowKeys();
    reload();
  }

  // 处理转办
  const [registerModal, { openModal }] = useModal();
  // 批量转办
  function handleBatchTransfer() {
    const ids = gridApi.getSelectRowKeys();
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    openModal(true, {
      ids: ids || [],
      api: transferRequirementReviewPage,
      beforeFetch: params => {
        return {
          ids: ids || [],
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
          fromType: 3,
        };
      },
    });
  }

  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  /** 打开节点详情 */
  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  /** 设置搜索表单的内容 */
  function setFormValue(form: Record<string, any>) {
    Object.entries(form).forEach(([key, value]) => {
      gridApi.setFieldValue(key, value);
    });
    gridApi.setLatestSubmissionValues(gridApi.getFromValue());
  }

  defineExpose({
    setFormValue,
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table--render-default .vxe-body--row-expanded-cell.is--padding) {
    padding: 10px 0;
  }
</style>
