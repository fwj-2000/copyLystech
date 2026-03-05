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
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
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
            <div class="table-a" @dblclick="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <template #action="{ rowIndex, row }">
            <i v-if="hasBtnP('btn_detail')" class="icon-ym icon-ym-btn-preview table-a" @click="handleEdit(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ViewDetail @register="registerDetail" @reload="reloadTable()" />
    <ExportModal @register="registerExportModal" />
    <ApplyQuota @register="registerApply" @reload="reloadTable()" />
    <ImportModal @register="registerImportPop" @refresh="reloadTable()"></ImportModal>
    <Preview ref="filePreviewRef" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <StopModal @register="registerStopModal" @reload="reloadTable()" />
  </div>
</template>

<script lang="ts" setup>
  import { BasicColumn } from '/@/components/Table';
  import {
    cancelImportTask,
    deleteQuotationRequirements,
    getImportTask,
    getImportTaskData,
    getQuotaTemplateDownload,
    getQuotationRequirements,
    getQuotationRequirementsList,
    getQuotationRequirementDetail,
    importQuotationRequirements,
    importTaskRead,
    postQuotationRequirements,
    exportQuotationRequirementsExcel,
    stopQuotationRequirements,
    withdrawQuota,
  } from '/@/api/business/quota';
  import { useModal } from '/@/components/Modal';
  import ViewDetail from './components/ViewDetail.vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getQuotaColumns, getQuotaFormConfig, QUOTA_COLUMNS, getCommonColumns } from '/@/views/business/quota/config';
  import ApplyQuota from '/@/views/business/quota/components/ApplyQuota.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { ImportModal } from '/@/components/ImportModal';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ModelConfirmButton } from '/@/components/Button';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'business-quota' });
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerApply, { openPopup: openApplyQuota }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  const { t } = useI18n();
  const { createConfirm, createMessage } = useMessage();

  const columns: BasicColumn[] = QUOTA_COLUMNS;

  const [Grid, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, setLoading, reload, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getQuotaFormConfig(),
    },
    gridOptions: {
      id: 'business-quota-list',
      columns: getQuotaColumns(),
      beforeFetch: params => {
        if (params.PurposeName) {
          params.Purpose = params.PurposeName;
          delete params.PurposeName;
        }
        return params;
      },
      showIndexColumn: true,
      api: getQuotationRequirements,
      rowConfig: {
        keyField: 'Id',
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
    },
  });

  const handleEdit = (index, record) => {
    setLoading(true);
    const { ApplyCode } = record;
    getQuotationRequirementsList({
      ApplyCode,
    }).then(({ data }) => {
      setLoading(false);
      openDetail(true, {
        cacheList: data,
        index: 0,
      });
    });
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.Id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
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
          createMessage.success(msg);
        } else {
          createMessage.error(msg);
        }
        reloadTable();
      });
    }
    createMessage.info(t('common.selectText'));
  }

  // 批量导入
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importQuotationRequirements,
      importSaveApi: postQuotationRequirements,
      templateApi: getQuotaTemplateDownload,
      previewColumn: columns,
      excludeFields: ['ApplyCode', 'Status', 'HandlerName', 'currentNodeName', 'nodeDetail', 'ApplyUserName', 'ApplyDate'],
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
    if (selectedRowKeys?.length === 0) return createMessage.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: async () => {
        try {
          const { msg, code } = await deleteQuotationRequirements(selectedRowKeys);
          if (code === 200) {
            clearSelectedRowKeys([]);
            createMessage.success(msg);
            reloadTable();
          }
        } catch (e) {
          console.log(e);
          clearSelectedRowKeys([]);
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
    createMessage.info(t('common.selectText'));
  }

  // 导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportQuotationRequirementsExcel,
      listQuery: await getFetchParams(),
      nameProps: 'title',
      idProps: 'field',
      exportOptions: getCommonColumns(),
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
    if (!rparams.id) return;
    // 执行页面状态更新逻辑
    getQuotationRequirementDetail(rparams.id).then(({ data }) => {
      handleEdit(0, { ApplyCode: data.ApplyCode });
    });
  });
</script>
