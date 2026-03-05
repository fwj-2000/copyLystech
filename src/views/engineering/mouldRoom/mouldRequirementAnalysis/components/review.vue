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
            <!-- 评审 -->
            <a-button v-auth="'btn_review'" type="primary" @click="openReviewModuleFn">{{ t('common.reviewText') }}</a-button>
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

          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerModal" @reload="reload" />
    <NodeModal @register="registerNodeRecord" />
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref, inject } from 'vue';
  import { COLUMNS, getSchema, downloadMoldDrawings, STATUS_ENUM } from '../config';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import {
    getPmcReviewPage,
    exportPmcReviewPage,
    bulkPmcReviewPageWithdraw,
    transferRequirementReviewPage,
    getNodelist,
    bulkPmcReviewPageReject,
  } from '/@/api/engineering/mould';

  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';

  const openDetailPopFn: any = inject('openDetailPopFn');

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
      id: `engineering-mouldRoom-mouldRequirementAnalysis-${props.searchKey === '0' ? 'todo' : 'done'}`,
      api: getPmcReviewPage,
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
    obj.bizType = 1;
    if (Array.isArray(params.time)) {
      obj.startTime = params.time[0];
      obj.endTime = params.time[1];
      delete obj.time;
    }
    return obj;
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetailFn.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  /** 撤回 */
  function revokeFn() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.withdrawSelectedData'),
      onOk: async () => {
        const { code } = await bulkPmcReviewPageWithdraw(rows.map(item => item.id));
        code === 200 && initFn();
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
      api: exportPmcReviewPage,
      listQuery: formatParams(getFetchParams()),
      exportOptions: COLUMNS,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  /** 进入详情 */
  function goDetailFn(record: any) {
    openDetailPopFn({
      title: t('common.detailText'),
      ids: [record.id],
    });
  }

  const invalidStatuses = [STATUS_ENUM.终止, STATUS_ENUM.冻结];
  /**
   * 获取状态不为【终止、冻结】的子数据
   * @param rows
   */
  function getAvailableSubRows(rows: Array<any>) {
    if (rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return [];
    }

    if (rows.some(row => invalidStatuses.includes(`${row.status}` as STATUS_ENUM))) {
      createMessage.warning(t('dict.MoldApply.frozenTermDataForbid'));
      return [];
    }
    return rows;
  }

  /** 评审 */
  function openReviewModuleFn() {
    const rows = getAvailableSubRows(getSelectRows());
    if (rows.length === 0) {
      return false;
    }

    const itemType = rows[0].itemType;
    if (rows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    openDetailPopFn({
      ids: rows.map(item => item.id),
      title: t('common.reviewText'),
      isCanEdit: true,
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
    const ids = getAvailableSubRows(getSelectRows()).map(item => item.id);
    if (ids.length === 0) {
      return false;
    }
    openModal(true, {
      ids: ids || [],
      api: transferRequirementReviewPage,
      beforeFetch: params => {
        return {
          ids: ids || [],
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
          fromType: 2,
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

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /** 驳回 */
  function handleReject() {
    const rows = getAvailableSubRows(getSelectRows());
    if (rows.length === 0) {
      return false;
    }

    const itemType = rows[0].itemType;
    if (rows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    openRejectModal(true, {
      ids: rows.map(item => item.id),
      api: bulkPmcReviewPageReject,
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
    initFn,
    setFormValue,
  });
</script>

<style lang="less" scoped>
  :deep(.vxe-table--render-default .vxe-body--row-expanded-cell.is--padding) {
    padding: 10px 0;
  }
</style>
