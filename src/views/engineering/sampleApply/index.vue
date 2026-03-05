<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleRequirementApply">
                {{ t('common.add2Text') }}
              </a-button>
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('views.filings.sureRevokeData'),
                    onOk: handleRecall.bind(null),
                  },
                  type: 'primary',
                  ghost: true,
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <a-button type="primary" ghost danger v-auth="'btn_stop'" @click="handleStop">
                {{ t('common.stopText') }}
              </a-button>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_batchRemove'" danger @click="handleDel">{{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>
          <template #applyNumber="{ row }">
            <span class="table-a" @click="handleEditByApplyNumber(row)">
              {{ row.applyNumber }}
            </span>
          </template>
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
          </template>
          <template #action="{ rowIndex, row }">
            <i class="icon-ym icon-ym-btn-preview text-orange-400 cursor-pointer mx-1" @click="handleEdit(rowIndex, row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ViewDetail @register="registerDetail" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ApplyPop @register="registerApply" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <StopModal @register="registerStopModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { STATUS_ENUM } from './configVxe';
  import {
    getApplyList,
    getNodeList,
    exportExcel,
    recallPro,
    stopPro,
    batchDelete,
    downloadImportTemplate,
    importPreviewBatch,
    importSaveBatch,
    getImportTask,
    cancelImportTask,
    getImportTaskData,
    importTaskRead,
  } from '/@/api/engineering/sample';
  import ViewDetail from './components/ViewPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPop from './components/ApplyPopVxe.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { getFormConfig, getColumn, importColumn } from './configVxe';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  defineOptions({ name: 'engineering-sampleApply' });
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerApply, { openPopup: openApplyQuota }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const { t } = useI18n();
  const { createConfirm } = useMessage();

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
        moduleCode: 'SampleApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-sampleApply-list',
      columns: getColumn(),
      api: getApplyList,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        // searchField: ['requestStartDate', 'requestEndDate'],
        if (params.applyDate && params.applyDate.length > 0) {
          params.applyDateStart = dateUtil(params.applyDate[0]).format('YYYY-MM-DD');
          params.applyDateEnd = dateUtil(params.applyDate[1]).format('YYYY-MM-DD');
          delete params.applyDate;
        }
        if (params.requestArrivalDate && params.requestArrivalDate.length > 0) {
          params.requestArrivalDateStart = dateUtil(params.requestArrivalDate[0]).format('YYYY-MM-DD');
          params.requestArrivalDateEnd = dateUtil(params.requestArrivalDate[1]).format('YYYY-MM-DD');
          delete params.requestArrivalDate;
        }
        return params;
      },
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    },
  });

  const { getSelectRowKeys, getSelectRows, clearSelectedRowKeys, getFetchParams, reload } = gridApi;

  const EditApplyStatus = [STATUS_ENUM.暂存, STATUS_ENUM.撤回, STATUS_ENUM.驳回];
  const handleEdit = (_, record: any) => {
    openDetail(true, {
      ...record,
      isShowReplyInfo: false,
      isCanEdit: !!record.applyStatus && EditApplyStatus.includes(record.applyStatus),
      isCanStopOrRevoke: record.applyStatus === STATUS_ENUM.在办,
    });
  };

  function handleEditByApplyNumber(row: any) {
    openApplyQuota(true, {
      applyNumber: row.applyNumber,
      type: 'edit',
      title: t('common.editText'),
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  const handleRequirementApply = () => {
    openApplyQuota(true, {
      title: t('common.addText'),
    });
  };

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return recallPro(idList).finally(reload);
    }
    message.info(t('common.selectText'));
  }

  //  终止
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    openStopModal(true, {
      api: stopPro,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          idList: idList,
          remark: params.remark,
        };
      },
    });
  }

  // 批量导入
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importPreviewBatch,
      importSaveApi: importSaveBatch,
      templateApi: downloadImportTemplate,
      previewColumn: importColumn,
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
        moduleCode: 'SampleApplyColumn',
      },
    });
  };

  // 删除
  async function handleDel() {
    const selectRows = getSelectRows();

    if (selectRows.some(item => item.applyStatus !== STATUS_ENUM.暂存)) {
      message.warning(t('dict.SampleApply.applyDeleteTip'));
      return false;
    }

    const selectedRowKeys = selectRows.map(item => item.id);
    if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: async () => {
        try {
          const { msg, code } = await batchDelete(selectedRowKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            message.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  // 导出
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), isPurchaseUser: false },
      api: exportExcel,
      exportOptions: getColumn()
        .slice(2, -1)
        .map(col => (col.field === 'applyStatus' ? { ...col, field: 'applyStatusDesc' } : col)),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SampleApplyColumn',
      },
    });
  };
  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    getApplyList({ id: params.id }).then(res => {
      if (res.data?.list && res.data.list.length > 0) {
        handleEdit(0, res.data.list[0]);
      }
    });
  });
</script>
