<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button type="primary" v-auth="'btn_add'" @click="handleAdd">
                {{ t('common.add2Text') }}
              </a-button>
              <!-- 复制新增 -->
              <a-button type="primary" ghost v-auth="'btn_copy'" @click="handleCopyAdd">
                {{ t('common.copyNoText') }}
              </a-button>
              <!-- 调整 -->
              <a-button v-auth="'btn_edit'" @click="handleAdjust">
                {{ t('common.adjust') }}
              </a-button>
              <!-- 撤回 -->
              <ModelConfirmButton
                v-auth="'btn_recall'"
                v-bind="{
                  modelConfirm: {
                    title: t('common.tipTitle'),
                    content: t('views.filings.sureRevokeData'),
                    onOk: handleRecall.bind(null),
                  },
                }">
                <span>{{ t('common.revoke') }}</span>
              </ModelConfirmButton>
              <vShowDropdown>
                <template #overlay>
                  <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                  <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <!-- 终止 -->
              <a-button type="primary" ghost danger v-auth="'btn_stop'" @click="handleStop">
                {{ t('common.stopText') }}
              </a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" danger @click="handleDel">{{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>

          <template #changeRecord="{ row }">
            <div class="text-orange-400 cursor-pointer" @click="handleShowChangeRecord(row)"> {{ t('common.detailText') }} </div>
          </template>

          <template #nodeDetail="{ row }">
            <div class="text-orange-400 cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
          </template>

          <template #action="{ row }">
            <i class="icon-ym icon-ym-btn-preview text-orange-400 cursor-pointer mx-1" @click="handleEdit(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <StopModal @register="registerStopModal" @reload="reload" />
    <NodeModal @register="registerNodeModal" />
    <RecordModal @register="registerRecordModal" />
    <AddPopup @register="registerAddPopup" @reload="reload" />
    <AdjustPopup @register="registerAdjustPopup" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { omit } from 'lodash-es';
  import {
    getList,
    bulkDelete,
    withdraw,
    stop,
    exportExcel,
    template,
    importPreview,
    importTask,
    importTaskData,
    cancelImportTask,
    importTaskRead,
    saveImportData,
  } from '/@/api/engineering/alternative';
  import { usePopup } from '/@/components/Popup';
  import { getFormConfig, getColumn, mainProcessOptions, getMainProcessOptions, getImportColumn } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  import { ModelConfirmButton } from '/@/components/Button';
  import { ImportModal } from '/@/components/ImportModal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import RecordModal from './components/recordModal.vue';
  import AddPopup from './components/addPopup.vue';
  import AdjustPopup from './components/adjustPopup.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'engineering-basicInformation-alternative' });

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();

  const [Grid, gridApi] = useVbenVxeGrid({
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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      columns: getColumn(),
      api: getTableData,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'AltMaterialColumn',
      },
    },
  });

  const { getSelectRowKeys, getSelectRows, getFetchParams, reload, clearSelectedRowKeys } = gridApi;

  async function getTableData(params: any) {
    if (mainProcessOptions.length === 0) {
      await getMainProcessOptions();
    }

    return getList({ ...params, dataFilter: 1 }).then(res => {
      const list = Array.isArray(res?.data?.list) ? res.data.list : [];
      if (list.length > 0) {
        list.forEach(item => {
          item.mainProcessName = mainProcessOptions.find(item => item.value === item.value)?.label || '';
        });
      }
      return res;
    });
  }

  /** 撤回 */
  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return withdraw(idList).finally(reload);
    }
    createMessage.warning(t('common.selectText'));
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  // 批量导入
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const batchImportFile = () => {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: template,
      previewColumn: getImportColumn(),
      usePolling: true,
      pollingParams: {
        interval: 10000,
        getTaskStatus: importTask,
        getTaskDataList: importTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      i18nConfig: {
        moduleCode: '',
      },
    });
  };

  /** 导出 */
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    const cloumns = getColumn().reduce((list: Array<any>, item) => {
      if (item.type) {
        return list;
      }
      if (!Array.isArray(item.children) || item.children.length === 0) {
        list.push(item);
      } else {
        list.push(
          ...item.children.map(c => {
            return {
              ...c,
              title: `${c.title}(${item.title})`,
            };
          }),
        );
      }
      return list;
    }, []);

    openExportModal(true, {
      listQuery: { ...params, ...omit(pager, 'total'), isPurchaseUser: false },
      api: exportExcel,
      exportOptions: cloumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: '',
      },
    });
  };

  const [registerStopModal, { openModal: openStopModal }] = useModal();
  /** 终止 */
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    openStopModal(true, {
      api: stop,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: idList,
          remark: params.remark,
        };
      },
    });
  }

  /** 批量删除 */
  async function handleDel() {
    const selectRows = getSelectRows();

    const selectedRowKeys = selectRows.map(item => item.id);
    if (selectedRowKeys?.length === 0) return createMessage.error(t('views.business.quota.inputDeleteLine'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: async () => {
        try {
          const { msg, code } = await bulkDelete(selectedRowKeys);
          if (code === 200) {
            clearSelectedRowKeys();
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          clearSelectedRowKeys();
          reload();
        }
      },
    });
  }

  const [registerAddPopup, { openPopup: openAddPopup }] = usePopup();
  /** 新增 */
  function handleAdd() {
    openAddPopup(true, {});
  }

  /**
   * 修改
   */
  function handleEdit(row: any) {
    // 如果存在`rootId`，说明是调整的数据；并且如果是`待提交(1)`、`处理中(2)`、`撤回(4)`、`驳回(5)`的状态，说明是修改调整的数据，进入调整作业界面
    if (row.rootId && [1, 2, 4, 5].includes(row.status)) {
      return openAdjustPopup(true, { data: [row], ids: [row.id] });
    }

    // 否则，进入详情页面
    openAddPopup(true, { data: [row], type: 'edit' });
  }

  /** 复制新增 */
  function handleCopyAdd() {
    const selectRows = getSelectRows();

    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    openAddPopup(true, { data: selectRows, type: 'copyAdd' });
  }

  const [registerAdjustPopup, { openPopup: openAdjustPopup }] = usePopup();
  /** 调整 */
  function handleAdjust() {
    const selectRows = getSelectRows();

    /** 只有`已处理(3)`数据可以调整 */
    if (selectRows.some(row => +row.status !== 3)) {
      createMessage.warning(t('common.selectProcessedDataTip'));
      return false;
    }

    if (selectRows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    openAdjustPopup(true, { data: selectRows, ids: selectRows.map(item => item.id) });
  }

  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  /** 变更记录 */
  function handleShowChangeRecord(row: any) {
    openRecordModal(true, {
      id: row.id,
    });
  }

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  /** 节点记录 */
  function handleNodeModal(row) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: row.id,
    });
  }
</script>
