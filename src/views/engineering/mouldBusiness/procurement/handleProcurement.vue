<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions v-if="props.searchKey === '1'">
            <!-- 采购 - 重新发送邮件 -->
            <a-button v-auth="'btn_email'" type="primary" @click="openEmailModuleFn(t('dict.MoldFlowNode.Purchase'), true)">{{
              t('common.sendEmail')
            }}</a-button>
            <!-- 撤回 -->
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="revokeFn()">{{ t('common.revoke') }}</a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 获取PR单号、PO单号 -->
            <a-button v-auth="'btn_push'" :loading="isLoading" @click="pushData">{{ t('dict.mouldBusinessReview.push') }}</a-button>
            <!-- 导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #toolbar-actions v-else>
            <!-- 采购 -->
            <a-button v-auth="'btn_email'" type="primary" @click="openEmailModuleFn(t('dict.MoldFlowNode.Purchase'))">{{
              t('dict.MoldFlowNode.Purchase')
            }}</a-button>
            <!-- 比价 -->
            <a-button v-auth="'btn_email'" type="primary" ghost @click="openEmailModuleFn(t('common.priceComparison'))">{{
              t('common.priceComparison')
            }}</a-button>
            <!-- 转办 -->
            <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
            <!-- 修改确认 -->
            <a-button v-auth="'btn_agree'" :loading="checkLoading" @click="handleAgreeModify">{{ t('dict.MoldApply.confirmModify') }}</a-button>
            <!-- 驳回 -->
            <a-button v-auth="'btn_reject'" @click="rejectFn">{{ t('common.rejectText') }}</a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
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

          <template #toolPrefix>
            <!-- 显示【终止】数据 -->
            <a-checkbox v-if="props.searchKey === '1'" v-model:checked="showTerminatedData" class="mr-12px" @change="() => reload()">{{
              t('dict.MoldApply.displayTerminateData')
            }}</a-checkbox>
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
              @update:checkList="(selectedKeys, selectedRows) => handleSubTableSelected(selectedKeys, selectedRows, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <rejectModal @register="registerRejectModal" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerModal" @reload="reload"></TransferModal>
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { inject, ref } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import {
    getPurchasepage,
    purchasewithdraw,
    purchasereject,
    exportmoldpurchase,
    createSAPPR,
    purchaseTransfer,
    purchaseCheckModifyConfirm,
  } from '/@/api/engineering/mould';
  import rejectModal from '../components/rejectModal.vue';
  import { COLUMNS, P_SEARCH_FORM_SCHEMA, APPLY_DETAIL_COLUMNS, downloadMoldDrawings, ITEM_TYPE_ENUM, PURCHASE_STATUS_ENUM } from '../components/config';
  import { getVxeProcurementColumns, getVxeComparePricesCloumns } from '../components/sendEmailConfig';
  import { DETAIL_POPUP_MODE } from '../components/detailPopup/config';
  import FileListCell from '../components/fileListCell.vue';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import { useExpandedTable } from '/@/views/engineering/mouldBusiness/components/expandTable';
  import { EXPAND_COLUMNS } from './config';
  import dayjs from 'dayjs';

  const openEmailPopup: any = inject('openEmailModuleFn');
  const openDetailPopFn: any = inject('openDetailPopFn');

  const props = defineProps({
    searchKey: { default: '0' },
  });
  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const { ExpandedTable, openExpandCustomModal } = useExpandedTable({ columns: EXPAND_COLUMNS, i18nModuleCode: 'MoldApplyColumn' });
  const showTerminatedData = ref<boolean>(false);

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
      schema: P_SEARCH_FORM_SCHEMA(props.searchKey === '0'),
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldBusiness-procurement',
      api: getPurchasepage,
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
          toolPrefix: 'toolPrefix',
        },
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
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

  function formatParams(params: any) {
    const _p = {
      ...params,
      type: props.searchKey,
    };

    if (props.searchKey === '1') {
      _p.isGetTerminatedData = showTerminatedData.value;
    }

    // 采购处理时间筛选范围，处理为第一天的00:00:00，及最后一天的23:59:59
    if (Array.isArray(_p.purchaseDate) && _p.purchaseDate.length === 2) {
      _p.purchaseStartDate = dayjs(_p.purchaseDate[0]).startOf('day').valueOf();
      _p.purchaseEndDate = dayjs(_p.purchaseDate[1]).endOf('day').valueOf();
      delete _p.purchaseDate;
    }

    return _p;
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

  /**
   * 打开邮件模块
   * @param title 标题
   * @param isResend 是否重新发送
   */
  function openEmailModuleFn(title: string, isResend = false) {
    const rows = getSelectRows();
    const subRows = rows.flatMap(item => item.selectItem);

    if (subRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    // 判断【单据类型(`itemType`)】是否一致，不一致则提示用户，不允许该操作
    const itemType = subRows[0].itemType;
    if (subRows.some(x => x.itemType !== itemType)) {
      createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
      return;
    }

    const columns = title === t('dict.MoldFlowNode.Purchase') ? getVxeProcurementColumns(true) : getVxeComparePricesCloumns();
    openEmailPopup({ title, ids: subRows.map(x => x.id), dataSource: rows, columns, isResend });
  }

  /** 允许驳回的采购状态，【采购状态】为【未发】、【比价中】的数据才能驳回 */
  const allowRejectPurchaseStatus = new Set([PURCHASE_STATUS_ENUM.未发, PURCHASE_STATUS_ENUM.比价中]);
  /** 驳回 */
  function rejectFn() {
    // 【单据类型】为【新增】，【采购状态】为【未发】、【比价中】的数据才能驳回
    const rows = getSelectRows();
    const subRows: Array<{ purchaseStatus: string | number; itemType: string | number }> = rows.flatMap(item => item.detailList);
    if (subRows.some(x => `${x.itemType}` !== ITEM_TYPE_ENUM.新增 || !allowRejectPurchaseStatus.has(`${x.purchaseStatus}` as PURCHASE_STATUS_ENUM))) {
      return createMessage.warning(t('dict.MoldApply.purchaseRejectTip'));
    }

    const subIds: Array<string> = [];
    for (const item of rows) {
      // 【单据类型】为【开模申请/新增】的数据，须按【整套模具图纸(即当前父级下的全部子级)】撤回、驳回、提交
      if (item.subSelectedRowKeys.length !== item.detailList.length) {
        return createMessage.warning(t('dict.MoldApply.applyLimitTip'));
      }
      subIds.push(...item.subSelectedRowKeys);
    }

    if (subIds.length) {
      openRejectModal(true, { ids: subIds, rejectApi: purchasereject });
    } else {
      createMessage.warning(t('common.selectText'));
    }
  }

  function revokeFn() {
    const tips = t('common.withdrawSelectedData');
    // 只获取子级ids
    const ids = getSelectRows()
      .flatMap(item => item.subSelectedRowKeys || [])
      .filter(Boolean);

    if (ids.length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: tips,
        onOk: async () => {
          const { code, msg } = await purchasewithdraw(ids);
          if (code === 200) {
            initFn();
          } else {
            createMessage.error(msg);
          }
        },
      });
    } else {
      createMessage.warning(t('common.selectText'));
    }
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
      api: exportmoldpurchase,
      selectIds: getSelectRows().flatMap(item => item.subSelectedRowKeys),
      listQuery: formatParams(await getFetchParams()),
      exportOptions: APPLY_DETAIL_COLUMNS,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    });
  }

  function goDetailFn(record: { detailList: Array<{ id: string }> }) {
    openDetailPopFn({
      ids: record.detailList?.map?.(x => x.id) || [],
      title: t('common.detailText'),
      mode: DETAIL_POPUP_MODE.详情,
    });
  }

  function clearAllSelectRowKeys() {
    clearSelectedRowKeys();
  }

  function initFn() {
    clearAllSelectRowKeys();
    reload();
  }

  const checkLoading = ref<boolean>(false);
  /** 修改同意 */
  async function handleAgreeModify() {
    const rows = getSelectRows();

    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    const subRows = rows.flatMap(item => item.selectItem);

    // 只有【单据类型】为【修改审批】的数据，才能执行此操作
    if (subRows.some(item => `${item.itemType}` !== `${ITEM_TYPE_ENUM.修改审批}`)) {
      return createMessage.warning(t('dict.MoldApply.requiredSomeItemType', [t('dict.MoldApply.ItemType.2')]));
    }

    const ids = subRows.map(r => r.id);

    checkLoading.value = true;
    /** 后端接口校验是否可以执行【修改确认】操作 */
    await purchaseCheckModifyConfirm(ids).finally(() => {
      checkLoading.value = false;
    });

    openDetailPopFn({
      ids,
      title: t('common.detailText'),
      mode: DETAIL_POPUP_MODE.审核,
      isPurchase: true,
      isModify: true,
    });
  }

  const isLoading = ref(false);
  /**
   * 手动推送数据至SAP
   */
  function pushData() {
    const ids = getSelectRows().flatMap(item => item.subSelectedRowKeys || []);
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }

    isLoading.value = true;
    createSAPPR(ids)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        initFn();
      })
      .finally(() => {
        isLoading.value = false;
      });
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
    const ids = getSelectRows().flatMap(item => item.subSelectedRowKeys || []);
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    openModal(true, {
      ids: ids || [],
      api: purchaseTransfer,
      beforeFetch: params => {
        return {
          ids: ids || [],
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
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
