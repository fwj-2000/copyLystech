<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- 新增 -->
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle">{{ t('common.add') }}</a-button>
            <!-- 复制新增 -->
            <a-button v-auth="'btn_add'" type="primary" ghost @click="handleCopyAdd">{{ t('common.copyAdd') }}</a-button>
            <!-- 撤回 -->
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="handleReject">{{ t('common.revoke') }}</a-button>
            <!-- 申请修改 -->
            <a-button v-auth="'btn_modify'" type="primary" ghost @click="showModifyModal">{{ t('dict.MoldApply.requestModify') }}</a-button>
            <!-- 重新提交 -->
            <a-button v-auth="'btn_resubmit'" type="primary" ghost @click="handleResubmit">{{ t('dict.MoldApply.resubmit') }}</a-button>
            <!-- 下载图纸 -->
            <a-button v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 删除 -->
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
            <!-- 导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
          </template>

          <template #toolSuffix>
            <!-- 子表列配置 -->
            <vxe-button
              class="ml-12px !h-30px !rounded-none !px-6px"
              type="primary"
              ghost
              :title="t('dict.MoldApply.subTableColumnConfig')"
              @click="openCustomModalFn">
              <i class="ym-custom ym-custom-settings" />
            </vxe-button>
          </template>

          <template #toolPrefix>
            <!-- 显示【终止】数据 -->
            <a-checkbox v-model:checked="showTerminatedData" class="mr-12px" @change="() => reload()">{{
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

    <addPopup @register="registerAddPopup" @reload="reload" />
    <ExportModal @register="registerExportModal">
      <template #afterCheckAll>
        <!-- 最新版本 数据勾选项 -->
        <a-checkbox v-model:checked="isLatestVersion" class="pl-20px">{{ t('dict.MoldApply.isLatestVersion') }} </a-checkbox>
      </template>
    </ExportModal>
    <DetailPopup @register="registerDetailPop" @reload="reload" />
    <ModifyPop @register="registerModifyPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import addPopup from './components/addPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getMoldapply, exportmoldapply, bulkWithdraw, bulkDelete } from '/@/api/engineering/mould';
  import {
    COLUMNS,
    SEARCH_FORM_SCHEMA,
    APPLY_DETAIL_COLUMNS,
    STATUS_ENUM,
    ITEM_TYPE_ENUM,
    downloadMoldDrawings,
    PURCHASE_STATUS_ENUM,
  } from '../components/config';
  import DetailPopup from '../components/detailPopup/index.vue';
  import { DETAIL_POPUP_MODE } from '../components/detailPopup/config';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import ModifyPop from './components/modifyPop.vue';
  import FileListCell from '../components/fileListCell.vue';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import { useExpandedTable } from '/@/views/engineering/mouldBusiness/components/expandTable';
  import dayjs from 'dayjs';

  defineOptions({ name: 'engineering-mouldBusiness-apply' });
  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();
  const [registerAddPopup, { openPopup: openAddPop }] = usePopup();
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const { ExpandedTable, openExpandCustomModal } = useExpandedTable();

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
      schema: SEARCH_FORM_SCHEMA(),
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldBusiness-apply',
      api: getMoldapply,
      beforeFetch: (params: any) => {
        const _p = {
          ...params,
          isGetTerminatedData: showTerminatedData.value,
        };
        if (Array.isArray(_p.applyDate) && _p.applyDate.length === 2) {
          _p.applyStartDate = dayjs(_p.applyDate[0]).startOf('day').valueOf();
          _p.applyEndDate = dayjs(_p.applyDate[1]).endOf('day').valueOf();
          delete _p.applyDate;
        }
        return _p;
      },
      columns: COLUMNS,
      expandConfig: {
        padding: true,
        expandAll: false,
      },
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

  function getTableActions(record: any): ActionItem[] {
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

  function handleReject() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    for (const item of rows) {
      // 【单据类型】为【开模申请/新增】的数据，须按【整套模具图纸(即当前父级下的全部子级)】撤回、驳回、提交
      const isAllNew = item.detailList.every(o => `${o.itemType}` === `${ITEM_TYPE_ENUM.新增}`);
      if (isAllNew && item.subSelectedRowKeys.length !== item.detailList.length) {
        return createMessage.warning(t('dict.MoldApply.applyLimitTip'));
      }
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.withdrawSelectedData'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkWithdraw(rows.flatMap(item => item.subSelectedRowKeys));
          if (code === 200) {
            createMessage.success(t('sys.api.operationSuccess'));
            initFn();
          } else {
            createMessage.error(msg);
          }
        } catch (e) {
          console.error('🚀 ~ index.vue:261 ~ handleReject ~ e:', e);
          initFn();
        }
      },
    });
  }

  function addOrUpdateHandle() {
    openAddPop(true, { title: t('common.add') });
  }

  /** 复制新增 */
  function handleCopyAdd() {
    const rows = getSelectRows();
    const subRows = rows.flatMap(item => item.selectItem || []);
    if (subRows.length === 0) {
      // 没有勾选数据提示
      return createMessage.warning(t('common.selectText'));
    }

    openAddPop(true, { copyIds: subRows.map(o => o.id), title: t('common.copyAdd') });
  }

  /**
   * 格式化修改类型为字符串，如：[1,2] -> '1,2'
   * @param row 数据行
   * @returns 格式化后的字符串
   */
  function formateModifyTypeToString(row: any) {
    return Array.isArray(row.modifyType) ? row.modifyType.join(',') : row.modifyType;
  }

  /** 重新提交 */
  function handleResubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      // 没有勾选数据提示
      return createMessage.warning(t('dict.CommonCol.selectParentItemTip'));
    }
    if (rows.length > 1) {
      // 勾选超过一条数据提示
      return createMessage.warning(t('dict.CommonCol.selectOneParentTip'));
    }
    const subSelectedRows = rows[0]?.['selectItem'] || [];

    // 只能同一套图纸下面，相同【单据类型(`itemType`)】的数据，相同的【修改类型(`modify`)】，且状态需为【驳回】【撤回】
    const itemType = `${subSelectedRows[0].itemType}`;
    const allowStatusList = new Set([`${STATUS_ENUM.撤回}`, `${STATUS_ENUM.驳回}`]);
    const modifyType = formateModifyTypeToString(subSelectedRows[0]);
    if (subSelectedRows.some((o: any) => `${o.itemType}` !== itemType || formateModifyTypeToString(o) !== modifyType || !allowStatusList.has(`${o.status}`))) {
      return createMessage.warning(t('dict.MoldApply.resubmitCheckTip'));
    }

    // 【单据类型(`itemType`)】为【开模申请/新增】的数据，须按【整套模具图纸(即当前父级下的全部子级)】撤回、驳回、提交
    const isAllNew = rows[0].detailList.every(o => `${o.itemType}` === `${ITEM_TYPE_ENUM.新增}`);
    if (isAllNew && subSelectedRows.length !== rows[0].detailList.length) {
      return createMessage.warning(t('dict.MoldApply.applyLimitTip'));
    }

    // 判断单据类型
    if (itemType === `${ITEM_TYPE_ENUM.修改审批}`) {
      openModifyPop(true, {
        ids: subSelectedRows.map(o => o.id),
        title: t('dict.CommonCol.modify'),
        modifyType: modifyType.split(','),
        modifyReason: subSelectedRows[0].modifyReason,
        isFixedModifyType: true,
      });
      return false;
    } else {
      openDetailPop(true, {
        ids: subSelectedRows.map(o => o.id),
        title: t('common.detailText'),
        mode: DETAIL_POPUP_MODE.编辑,
      });
    }
  }

  function goDetailFn(record: { detailList: Array<{ id: string }> }) {
    openDetailPop(true, {
      // pid: [record.id],
      ids: record.detailList?.map?.(item => item.id) || [],
      title: t('common.detailText'),
      mode: DETAIL_POPUP_MODE.详情,
    });
  }

  const isLatestVersion = ref<boolean>(true);
  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportmoldapply,
      selectIds: gridApi.getSelectRows().flatMap(item => item.subSelectedRowKeys),
      listQuery: {
        ...(await getFetchParams()),
      },
      beforeFetch: (params: any) => ({
        ...params,
        isLatestVersion: isLatestVersion.value,
      }),
      exportOptions: APPLY_DETAIL_COLUMNS.concat({
        field: 'termProjectCode',
        title: '终端项目代码',
      }),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    });
  }

  function downloadFn() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
    downloadMoldDrawings(rows);
  }

  function clearAllSelectRowKeys() {
    clearSelectedRowKeys();
  }

  const allowDeleteStatus = new Set([`${STATUS_ENUM.撤回}`, `${STATUS_ENUM.驳回}`]);
  /** 删除 */
  async function handleDeleteList() {
    const subRows = getSelectRows().flatMap(item => item.selectItem || []);
    if (subRows.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }

    // 只允许删除状态为【撤回、驳回】的数据
    if (subRows.some(o => !allowDeleteStatus.has(`${o.status}`))) {
      return createMessage.warning(t('common.delStatusCheckTip', [`${t('dict.MoldApply.Status.1')}、${t('dict.MoldApply.Status.2')}`]));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        const { code } = await bulkDelete(subRows.map(o => o.id));
        if (code == 200) {
          createMessage.warning(t('common.delSuccess'));
        }
        initFn();
      },
    });
  }

  function initFn() {
    clearAllSelectRowKeys();
    reload();
  }

  const [registerModifyPop, { openPopup: openModifyPop }] = usePopup();
  const allowModifyPurchaseStatus = new Set([`${PURCHASE_STATUS_ENUM.在制中}`, `${PURCHASE_STATUS_ENUM.暂停}`]);
  /** 打开修改弹窗 */
  function showModifyModal() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('common.selectDataTip'));
      return;
    }
    const subSelectedRows: Array<any> = rows[0].selectItem || [];
    if (rows.length > 1 || subSelectedRows.length === 0) {
      createMessage.warning(t('dict.MoldApply.modifyCheckTip'));
      return;
    }
    // 申请修改的时候，只能选择同一套图纸的模具料号且采购状态需为【在制中】、【暂停】且数据状态【在办】且单据类型不能为【修改审批】
    if (
      subSelectedRows.some(
        (o: any) =>
          `${o.itemType}` === `${ITEM_TYPE_ENUM.修改审批}` || `${o.status}` !== `${STATUS_ENUM.在办}` || !allowModifyPurchaseStatus.has(`${o.purchaseStatus}`),
      )
    ) {
      return createMessage.warning(t('dict.MoldApply.modifyCheckTip'));
    }

    openModifyPop(true, {
      ids: subSelectedRows.map(o => o.id),
      title: t('dict.CommonCol.modify'),
    });
  }

  function openCustomModalFn() {
    openExpandCustomModal({
      callback: reload,
    });
  }

  useRouteParams({ billNo: {} }, params => {
    const { billNo } = params;
    if (billNo) {
      gridApi.setFieldValue('applyNo', billNo);
      gridApi.setLatestSubmissionValues(gridApi.getFromValue());
    }
  });
</script>

<style lang="less" scoped>
  .status-block {
    width: 68px;
    text-align: center;
    background-color: #f2f4f6;
  }

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
