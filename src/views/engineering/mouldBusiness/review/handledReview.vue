<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white" v-loading="isLoading">
        <Grid>
          <template #toolbar-actions v-if="props.searchKey === '1'">
            <!-- 图纸下载 -->
            <a-button v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 下载 -->
            <a-dropdown>
              <template #overlay>
                <a-menu @click="downloadDrop">
                  <a-menu-item :key="1">SAP项目号</a-menu-item>
                  <a-menu-item :key="2">SAP模具物料</a-menu-item>
                  <a-menu-item :key="3">SAP物料号</a-menu-item>
                  <a-menu-item :key="4">采购申请批量导入模板-z10</a-menu-item>
                </a-menu>
              </template>
              <a-button @click="downloadDrop({ key: 0 })" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
            </a-dropdown>
          </template>

          <template #toolbar-actions v-else>
            <!-- 审核 -->
            <a-button v-auth="'btn_review'" type="primary" @click="handleAduit">{{ t('common.audit') }}</a-button>
            <!-- 图纸下载 -->
            <a-button v-auth="'btn_download'" type="primary" ghost @click="downloadFn">{{ t('common.downloadDrawingText') }}</a-button>
            <!-- 转办 -->
            <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
            <!-- 批量导出 -->
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
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
              :disabledCheck="props.searchKey === '0'"
              @update:checkList="(selectedKeys, selectedRows) => handleSubTableSelected(selectedKeys, selectedRows, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ref, inject } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getAuditpage, exportmoldaudit, exportMoldBySAPTemplate, exportMoldNoForSAP, auditTransfer } from '/@/api/engineering/mould';
  import { COLUMNS, APPLY_DETAIL_COLUMNS, R_SEARCH_FORM_SCHEMA, downloadMoldDrawings } from '../components/config';
  import { downloadByUrl } from '/@/utils/file/download';
  import FileListCell from '/@/views/engineering/mouldBusiness/components/fileListCell.vue';
  import { DETAIL_POPUP_MODE, ITEM_TYPE_ENUM } from '../components/detailPopup/config';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table/use-vxe-grid';
  import { useExpandedTable } from '/@/views/engineering/mouldBusiness/components/expandTable';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import dayjs from 'dayjs';

  const openDetailPopFn: any = inject('openDetailPopFn');

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const { t } = useI18n();
  const isLoading = ref(false);
  const { ExpandedTable, openExpandCustomModal } = useExpandedTable();
  const showTerminatedData = ref<boolean>(false);
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
      schema: R_SEARCH_FORM_SCHEMA(props.searchKey === '0'),
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldBusiness-review',
      api: getAuditpage,
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
    const _p = { ...params };
    _p.type = props.searchKey;
    if (props.searchKey === '1') {
      _p.isGetTerminatedData = showTerminatedData.value;
    }
    if (Array.isArray(_p.applyDate) && _p.applyDate.length === 2) {
      _p.applyStartDate = dayjs(_p.applyDate[0]).startOf('day').valueOf();
      _p.applyEndDate = dayjs(_p.applyDate[1]).endOf('day').valueOf();
      delete _p.applyDate;
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

  const { createMessage } = useMessage();

  function downloadFn() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.pleaseCheckTheDrawingsToBeDownloaded'));
    }
    downloadMoldDrawings(rows);
  }

  async function downloadDrop({ key }) {
    console.log(key);

    const selectedKeys = getSelectRowKeys();
    const exportSap = async exportType => {
      if (selectedKeys.length) {
        try {
          //加载遮罩loading
          isLoading.value = true;
          const { data, code, msg } = await exportMoldNoForSAP({ ids: selectedKeys.toString(), exportType: exportType });
          if (code == '200' && data.url) {
            downloadByUrl({
              url: data.url,
            });
            createMessage.success(t('sys.api.operationSuccess'));
            initFn();
          } else {
            createMessage.error(msg);
          }
        } finally {
          isLoading.value = false;
        }
      } else {
        createMessage.warning(t('common.checkOperationText'));
      }
    };
    let funcs = [
      handleExport,
      exportSap.bind(null, 1),
      async () => {
        if (selectedKeys.length) {
          try {
            //加载遮罩loading
            isLoading.value = true;
            const { data, code, msg } = await exportMoldBySAPTemplate({ ids: selectedKeys.toString() });
            if (code == '200' && data.url) {
              downloadByUrl({
                url: data.url,
              });
              createMessage.success(t('sys.api.operationSuccess'));
              initFn();
            } else {
              createMessage.error(msg);
            }
          } finally {
            isLoading.value = false;
          }
        } else {
          createMessage.warning(t('common.checkOperationText'));
        }
      },
      exportSap.bind(null, 3),
      exportSap.bind(null, 4),
    ];
    funcs[key]();
  }
  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportmoldaudit,
      selectIds: gridApi.getSelectRows().flatMap(item => item.subSelectedRowKeys),
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
      ids: record.detailList?.map?.(item => item.id) || [],
      title: t('common.detailText'),
      mode: DETAIL_POPUP_MODE.详情,
    });
  }

  /** 审核 */
  function handleAduit() {
    const subRows = getSelectRows().flatMap(item => item.detailList);
    if (subRows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    const itemType = subRows[0].itemType;
    if (subRows.some(item => item.itemType !== itemType)) {
      return createMessage.warning(t('dict.MoldApply.requiredSameItemTypeTip'));
    }

    openDetailPopFn({
      ids: subRows.map(item => item.id),
      title: t('common.detailText'),
      mode: DETAIL_POPUP_MODE.审核,
      isModify: subRows.some(item => `${item.itemType}` === `${ITEM_TYPE_ENUM.修改审批}`),
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
    const ids = getSelectRows().flatMap(item => item.subSelectedRowKeys || []);
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    openModal(true, {
      ids: ids || [],
      api: auditTransfer,
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
