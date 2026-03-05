<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- 出口内地备案表 制作 -->
            <a-button type="primary" v-auth="'btn_export_mainland_filings'" @click="() => createFilingForm(FILING_TYPE_ENUM.出口内地备案表)">{{
              t('views.finalFilingForm.exportMainlandFilingForm')
            }}</a-button>
            <!-- 出港备案表 制作 -->
            <a-button type="primary" v-auth="'btn_outbound_declaration_filings'" @click="() => createFilingForm(FILING_TYPE_ENUM.出港备案表)">{{
              t('views.finalFilingForm.outboundFilingForm')
            }}</a-button>
            <a-dropdown v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">
              <template #overlay>
                <a-menu v-if="hasBtnP('btn_upload')" @click="batchImportOrExport">
                  <a-sub-menu key="import" :title="t('common.importText')">
                    <!-- 出口内地备案表 导入 -->
                    <a-menu-item :key="`import-${FILING_TYPE_ENUM.出口内地备案表}`">
                      {{ t('views.finalFilingForm.exportMainlandFilingForm') }}
                    </a-menu-item>
                    <!-- 出港备案表 导入 -->
                    <a-menu-item :key="`import-${FILING_TYPE_ENUM.出港备案表}`">
                      {{ t('views.finalFilingForm.outboundFilingForm') }}
                    </a-menu-item>
                  </a-sub-menu>

                  <a-sub-menu v-if="hasBtnP('btn_download')" key="export" :title="t('common.exportText')">
                    <!-- 出口内地备案表 导出 -->
                    <a-menu-item :key="`export-${FILING_TYPE_ENUM.出口内地备案表}`">
                      {{ t('views.finalFilingForm.exportMainlandFilingForm') }}
                    </a-menu-item>
                    <!-- 出港备案表 导出 -->
                    <a-menu-item :key="`export-${FILING_TYPE_ENUM.出港备案表}`">
                      {{ t('views.finalFilingForm.outboundFilingForm') }}
                    </a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <ApplyPop @register="registerApplyPop" @reload="reload" />
    <DetailPop @register="registerDetailPop" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getFormConfig, getColumns, importColumnsMap, FILING_TYPE_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPop from './components/ApplyPop.vue';
  import DetailPop from './components/detailPopup.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import {
    getList,
    exportExcel,
    template,
    importPreview,
    importTask,
    importTaskData,
    cancelImportTask,
    importTaskRead,
    saveImportData,
  } from '/@/api/logisticAffairs/filingsFinalForm';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { ImportModal } from '/@/components/ImportModal';
  import { useModal } from '/@/components/Modal';
  import { omit } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'logisticAffairs-export-filings-finalForm' });

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();

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
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'logisticAffairs-export-filings-finalForm-list',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, getSelectRows } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: goDetail.bind(null, record),
      },
    ];
  }

  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  function goDetail(row: any) {
    openDetailPopup(true, { id: row.id, type: 'edit' });
  }

  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  function createFilingForm(type: `${FILING_TYPE_ENUM}`) {
    const ids = getSelectRowKeys();
    const rows = getSelectRows();
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    openApplyPopup(true, {
      type,
      ids,
      list: rows.map(item => {
        return {
          customsAffairsApplyId: item.id,
          insidePartNumber: item.insidePartNumber,
          terminalCustomerProjectCode: item.terminalCustomerProjectCode,
          immediateCustomerPartNumber: item.immediateCustomerPartNumber,
          immediateCustomerName: item.immediateCustomerName,
          prot: item.prot,
          customersName: item.customersName,
          materialQuality: item.materialQuality,
          purpose: item.purpose,
        };
      }),
    });
  }

  /**
   * 导出、导出处理
   * @param param0 key，关键词，内容为: `${具体操作}-${终版备案类型}`，终版备案类型：1-内地，2-出港
   */
  function batchImportOrExport({ key }: { key: string }) {
    const [action, finalVersionType] = key.split('-');

    const openMethod = action === 'import' ? batchImportFile : handleExport;
    openMethod(finalVersionType as `${FILING_TYPE_ENUM}`);
  }

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  // 批量导入
  const batchImportFile = (finalVersionType: `${FILING_TYPE_ENUM}`) => {
    if (!finalVersionType) {
      return false;
    }

    const columns = importColumnsMap[finalVersionType];

    openImportPopup(true, {
      importPreviewApi: (params: any) => importPreview({ ...params, finalVersionType }),
      importSaveApi: (batchCode: string) => saveImportData(batchCode, finalVersionType),
      templateApi: () => template(finalVersionType),
      previewColumn: columns,
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: () => importTask(finalVersionType),
        getTaskDataList: (params: any) => importTaskData({ ...params, finalVersionType }),
        cancelTask: () => cancelImportTask(finalVersionType),
        taskRead: () => importTaskRead(finalVersionType),
      },
      // @ts-ignore
      i18nConfig: {
        moduleCode: 'CustomsAffairsFinalVersion',
      },
    });
  };

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // 导出
  const handleExport = async (finalVersionType: `${FILING_TYPE_ENUM}`) => {
    if (!finalVersionType) {
      return false;
    }

    const params = await gridApi.getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total') },
      api: exportExcel,
      exportOptions: [],
      nameProps: 'title',
      idProps: 'field',
      beforeFetch: (params: any) => {
        return { ...params, finalVersionType };
      },
    });
  };

  useRouteParams({ id: {} }, params => {
    const { id } = params;
    if (id) {
      goDetail({ id });
    }
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
