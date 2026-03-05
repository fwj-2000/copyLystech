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
            <a-button v-auth="'btn_reject'" type="primary" ghost @click="rejectFn"> {{ t('common.rejectText') }} </a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 转办 -->
            <a-button v-auth="'btn_transfer'" @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
            <!-- 批量导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #toolSuffix>
            <!-- 子表列配置 -->
            <vxe-button
              class="ml-12px !h-30px !rounded-none !px-6px"
              type="primary"
              ghost
              :title="t('dict.MoldApply.subTableColumnConfig')"
              @click="openCustomConfigModal">
              <i class="ym-custom ym-custom-settings" />
            </vxe-button>
          </template>

          <template #moldDrawings="{ row }">
            <FileListCell :row="row" :list="row.moldDrawings" />
          </template>

          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>

          <template #expandedRowRender="{ row }">
            <ExpandedTable
              :data="row.detailList"
              :checkedList="row.subSelectedRowKeys"
              :disabledCheck="props.searchKey === '0'"
              @update:checkList="(selectedKeys, selectedRows) => handleSubTableSelected(selectedKeys, selectedRows, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerModal" @reload="reload" />
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref, inject, computed } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { COLUMNS, getSchema, downloadMoldDrawings, SUB_TODO_COLUMNS, SUB_DONE_COLUMNS, STATUS_ENUM } from '../config';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import RejectModal from '/@/components/CustomComponents/src/RejectModal.vue';
  import {
    getrequirementReviewpage,
    exportRequirementReview,
    bulkRequirementReviewPageWithdraw,
    rejectRequirementReviewPage,
    transferRequirementReviewPage,
  } from '/@/api/engineering/mould';
  import { transformI18nVxeTable } from '/@/utils';
  import { useExpandedTable } from '/@/views/engineering/mouldBusiness/components/expandTable';

  const openDetailPopFn: any = inject('openDetailPopFn');

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const { t } = useI18n();
  const isLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const subColumns = computed(() => {
    const columns = props.searchKey === '0' ? SUB_TODO_COLUMNS : SUB_DONE_COLUMNS;
    return transformI18nVxeTable(columns, 'MouldRoomColumn');
  });

  const { ExpandedTable, openExpandCustomModal } = useExpandedTable({ columns: subColumns.value });

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
      id: `engineering-mouldRoom-mouldRequirementReview-${props.searchKey === '0' ? 'todo' : 'done'}`,
      api: getrequirementReviewpage,
      columns: COLUMNS,
      expandConfig: {
        padding: true,
        expandAll: false,
      },
      beforeFetch: formatParams,
      pagerConfig: {
        pageSize: 20,
      },
      toolbarConfig: {
        expandAll: true,
        custom: false,
        slots: {
          toolSuffix: 'toolSuffix',
        },
      },
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
      },
    },
    gridEvents: {
      checkboxChange: handleSelectedChange,
      checkboxAll: ({ checked }) => {
        for (const row of getDataSource()) {
          handleSelectedChange({ row, checked });
        }
      },
    },
  });
  const { getSelectRows, clearSelectedRowKeys, reload, getFetchParams, getSelectRowKeys, getDataSource } = gridApi;

  /** 请求参数格式化 */
  function formatParams(params: any) {
    const obj = { ...params };
    obj.type = props.searchKey;
    obj.bizType = 0;
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

  function handleSelectedChange(params: any) {
    const { row, checked } = params;
    row.subSelectedRowKeys = [];
    row.selectItem = [];

    if (checked) {
      const list: Array<any> = Array.isArray(row.detailList) ? row.detailList : [];
      row.subSelectedRowKeys.push(...list.map(item => item.id));
      row.selectItem = list;
    }
  }

  function handleSubTableSelected(selectedKeys: Array<string>, selectedRows: Array<any>, row: any) {
    row.subSelectedRowKeys = selectedKeys;
    row.selectItem = selectedRows;

    const selectedRowKeys = getSelectRowKeys();
    if (!selectedRowKeys.includes(row.id)) {
      gridApi.grid.setCheckboxRowKey(row.id, true);
    } else if (selectedKeys.length === 0) {
      gridApi.grid.setCheckboxRowKey(row.id, false);
    }
  }

  const invalidStatuses = [STATUS_ENUM.终止, STATUS_ENUM.冻结];
  /**
   * 获取状态不为【终止、冻结】的子数据
   * @param rows
   */
  function getAvailableSubRows(rows: Array<{ detailList: Array<any> }>) {
    const list = Array.isArray(rows) ? rows.flatMap(item => item?.detailList || []) : [];
    if (list.length === 0) {
      createMessage.warning(t('common.selectText'));
      return [];
    }

    const availableSubRows = list.filter(subItem => !invalidStatuses.includes(`${subItem.status}` as STATUS_ENUM));
    if (availableSubRows.length === 0) {
      createMessage.warning(t('dict.MoldApply.frozenTermDataForbid'));
    }
    return availableSubRows;
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
        const { code } = await bulkRequirementReviewPageWithdraw(rows.flatMap(item => item.subSelectedRowKeys));
        code === 200 && initFn();
        return true;
      },
    });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /** 驳回 */
  function rejectFn() {
    const subRows = getAvailableSubRows(getSelectRows());
    if (subRows.length === 0) {
      return false;
    }

    // 判断【单据类型(`itemType`)】是否一致，不一致则提示用户，不允许该操作
    const itemType = subRows[0].itemType;
    if (subRows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    openRejectModal(true, {
      ids: subRows.map(item => item.id),
      api: rejectRequirementReviewPage,
    });
  }

  function downloadFn() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
    downloadMoldDrawings(rows);
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportRequirementReview,
      selectIds: getSelectRows().flatMap(item => item.detailList.map(el => el.id)),
      listQuery: formatParams(await getFetchParams()),
      exportOptions: subColumns.value,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  /** 进入详情 */
  function goDetailFn(record: any) {
    if (!Array.isArray(record?.detailList) || record.detailList.length === 0) {
      return createMessage.warning(t('common.noDetailData'));
    }

    openDetailPopFn({
      title: t('common.detailText'),
      ids: record.detailList.map((item: any) => item.id),
    });
  }

  /** 评审 */
  function openReviewModuleFn() {
    const subRows = getAvailableSubRows(getSelectRows());
    if (subRows.length === 0) {
      return false;
    }

    const itemType = subRows[0].itemType;
    if (subRows.some(item => item.itemType !== itemType)) {
      return createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
    }

    openDetailPopFn({
      ids: subRows.map(item => item.id),
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

  function openCustomConfigModal() {
    openExpandCustomModal({
      callback: reload,
    });
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
          fromType: 1,
        };
      },
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
  .disabled-class {
    pointer-events: none;
  }

  .status-tag {
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    padding: 2px;
    max-width: 70px;
  }

  :deep(.vxe-table--render-default .vxe-body--row-expanded-cell.is--padding) {
    padding: 10px 0;
  }

  :deep(.vxe-tools--operate) {
    margin-left: 0;
  }
</style>
