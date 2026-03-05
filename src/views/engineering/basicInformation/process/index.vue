<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="waitReload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerBatchImportPop" @reload="waitReload" @close="waitReload"></ImportModal>
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getProcess, deleteProcess, blukDeleteProcess, exportProcessExcel, importPreview, importSave, templateDownload } from '/@/api/engineering/process';
  import { getProcessColumns, getCommonColumns, getQuotaFormConfig } from '/@/views/engineering/basicInformation/process/config';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-basicInformation-process' });

  interface State {
    typeList: any[];
    processTypeList: any[];
  }

  const state = reactive<State>({
    typeList: [],
    processTypeList: [],
  });
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();
  const [
    Grid,
    {
      getSelectRows: waitGetSelectRows,
      getSelectRowKeys: waitGetSelectRowKeys,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      setLoading: waitSetLoading,
      reload: waitReload,
      setFieldValue: waitSetFieldValue,
      getFetchParams,
    },
  ] = useVbenVxeGrid({
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
      i18nConfig: {
        moduleCode: 'ProcessColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-process-list',
      columns: getProcessColumns(),
      showIndexColumn: true,
      showFooter: false,
      api: getProcess,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
          iconType: 'delete',
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record, typeList: state.typeList, processTypeList: state.processTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcess(record.id).then(res => {
      createMessage.success(res.msg);
      waitReload();
    });
  }

  // 批量删除
  async function handleDeleteList() {
    const list = waitGetSelectRowKeys() ?? [];

    if (list.length === 0) {
      waitClearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        void (async () => {
          try {
            const { code } = await blukDeleteProcess(list);
            if (code === 200) {
              message.success(t('common.delSuccess'));
            }
          } finally {
            waitClearSelectedRowKeys();
            waitReload();
          }
        })();
      },
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }
  //导入
  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      previewColumn: getCommonColumns(),
      excludeFields: ['createTime', 'updateTime'],
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
      //
    });
  }
  //导出
  const handleExport = async () => {
    console.log(getCommonColumns(), 'getCommonColumns');

    openExportModal(true, {
      api: exportProcessExcel,
      listQuery: await getFetchParams(),
      exportOptions: getCommonColumns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
    });
  };
  onMounted(async () => {
    const typeList = (await baseStore.getDictionaryData('Process.ProduceType')) as any[];
    const optionsTypeList = typeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.typeList = optionsTypeList;
    const processTypeList = (await baseStore.getDictionaryData('Process.Type')) as any[];
    const optionsProcessTypeList = processTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.processTypeList = optionsProcessTypeList;
  });
</script>
