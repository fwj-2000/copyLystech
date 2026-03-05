<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleRequirementApply">
                {{ t('views.business.quota.apply') }}
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="batchImportOrExport">
                    <a-menu-item v-auth="'btn_upload'" key="import">{{ t('common.batchImport') }} </a-menu-item>
                    <a-menu-item v-auth="'btn_download'" key="export">{{ t('component.excel.exportModalTitle') }} </a-menu-item>
                  </a-menu>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </a-dropdown>
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('common.withdrawSelectedData'),
                    onOk: handleRecall.bind(null),
                  },
                  type: 'primary',
                  ghost: true,
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <a-button v-auth="'btn_stop'" @click="handleTerminate" type="primary" ghost>{{ t('common.stopText') }} </a-button>
              <a-button v-auth="'btn_remove'" @click="handleDel">{{ t('views.business.quota.delete') }} </a-button>
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <ApplyQuota @register="registerApply" @reload="reloadTable()" />
    <ImportModal @register="registerImportPop" @refresh="reloadTable()"></ImportModal>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <StopModal @register="registerStopModal" @reload="reloadTable()" />
  </div>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import {
    cancelImportTask,
    deleteQuotationRequirements,
    getImportTask,
    getImportTaskData,
    getQuotaTemplateDownload,
    getQuotationRequirements,
    getQuotationRequirementDetail,
    importQuotationRequirements,
    importTaskRead,
    postQuotationRequirements,
    exportQuotationRequirementsExcel,
    stopQuotationRequirements,
    withdrawQuota,
  } from '/@/api/business/quota';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getQuotaFormConfig, tableColumns } from './config';
  import ApplyQuota from '/@/views/business/quota/components/ApplyQuota.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { ImportModal } from '/@/components/ImportModal';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ModelConfirmButton } from '/@/components/Button';
  import { TableAction, ActionItem } from '/@/components/Table';

  // !!! 缓存唯一标识，一般是路由code
  defineOptions({ name: 'pageDemo-singlePage' });
  const { hasBtnP } = usePermission();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerApply, { openPopup: openApplyQuota }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const [Grid, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, reload, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getQuotaFormConfig(),
    },
    gridOptions: {
      // !!! 表格唯一标识，一般是路由code拼接
      id: 'pageDemo-singlePage-list',
      columns: tableColumns,
      showIndexColumn: true,
      api: getQuotationRequirements,
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
      toolbarConfig: {
        // 确认接口是否开启高级查询
        // superQuery: true,
      },
    },
  });

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.Id,
    });
  }

  function getTableActions(_record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        // onClick: goDetail.bind(null, record.applyNo),
        auth: 'btn_detail',
        tooltip: t('common.view'),
      },
    ];
  }

  const handleRequirementApply = () => {
    openApplyQuota(true, {});
  };

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return withdrawQuota(idList).then(({ code, msg }) => {
        if (code == 200) {
          message.success(msg);
        } else {
          message.error(msg);
        }
        reloadTable();
      });
    }
    message.info(t('common.selectText'));
  }

  // 批量导入
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importQuotationRequirements,
      importSaveApi: postQuotationRequirements,
      templateApi: getQuotaTemplateDownload,
      previewColumn: tableColumns,
      excludeFields: ['ApplyCode', 'Status', 'HandlerName', 'currentNodeName', 'nodeDetail', 'ApplyUserName', 'ApplyDate'],
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn', // 字典分类EnCode
      },
    });
  };

  function reloadTable() {
    reload();
    clearSelectedRowKeys();
  }

  // 删除
  async function handleDel() {
    const selectedRowKeys = getSelectRowKeys();
    if (selectedRowKeys?.length === 0) return message.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { msg, code } = await deleteQuotationRequirements(selectedRowKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            message.success(msg);
            reloadTable();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reloadTable();
        }
      },
    });
  }

  // 终止
  function handleTerminate() {
    const idList = getSelectRows().map(item => item.Id) || [];
    if (idList.length) {
      return openStopModal(true, {
        api: stopQuotationRequirements,
        idList,
        listParamName: 'ids',
        listParamValue: 'idList',
      });
    }
    message.info(t('common.selectText'));
  }

  // 导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportQuotationRequirementsExcel,
      listQuery: await getFetchParams(),
      nameProps: 'title',
      idProps: 'field',
      exportOptions: tableColumns,
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
    });
  };
  // 定义参数处理配置
  const paramConfig = {
    id: {},
  };
  // 使用自定义 Hook
  useRouteParams(paramConfig, rparams => {
    console.log('处理后的参数:', rparams);
    if (!rparams.id) return;
    // 执行页面状态更新逻辑
    getQuotationRequirementDetail(rparams.id).then((/*{ data }*/) => {
      // handleEdit(0, { ApplyCode: data.ApplyCode });
    });
  });
</script>
