<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <!-- <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item v-if="hasBtnP('btn_upload')" key="import">{{ t('common.batchImport') }}</a-menu-item>
                  <a-menu-item v-if="hasBtnP('btn_download')" key="export">{{ t('common.batchExport') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown> -->
            <!-- <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button> -->
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
  <add @register="registerForm" @reload="reload" />
  <!-- <ExportModal @register="registerExportModal" />
  <BatchUpload @register="registerBatchImportPop" @reload="reload" /> -->
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getProcessCode, deleteProcessCode, blukDeleteProcessCode, exportProcessCodeExcel } from '/@/api/engineering/process';
  import { useModal } from '/@/components/Modal';
  // import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive } from 'vue';
  import { useBaseStore } from '/@/store/modules/base';

  import add from './components/add.vue';
  // import ExportModal from '/@/components/ExportModal/index.vue';
  // import BatchUpload from './components/importPop.vue';

  const { t } = useI18n();
  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-basicInformation-processCode' });

  interface State {
    typeList: any[];
    processTypeList: any[];
  }

  const state = reactive<State>({
    typeList: [],
    processTypeList: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  // const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 40 },
    { title: '类型', field: 'type' },
    { title: '类型名称', field: 'typeCodeName' },
    { title: '代码', field: 'code' },
    { title: '名称', field: 'name' },
    {
      title: '操作',
      field: 'actions',
      slots: { default: 'action' },
      fixed: 'right',
      width: 100,
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'typeCode',
      label: '',
      i18nField: 'type',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择类型',
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        colProps: { span: 4 },
      },
    },
    {
      fieldName: 'code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入代码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入名称',
      },
      colProps: { span: 4 },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'ProcessCodeColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-processCode-list',
      columns: columns,
      showIndexColumn: true,
      api: getProcessCode,
      toolbarConfig: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'ProcessCodeColumn',
      },
    },
  });

  const { reload } = gridApi;

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
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record, typeList: state.typeList, processTypeList: state.processTypeList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessCode(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  // async function handleDeleteList() {
  //   const ids = getSelectRowKeys();
  //   if (ids?.length === 0) {
  //     return createMessage.warning(t('common.selectDelDatasTip'));
  //   } else {
  //     createConfirm({
  //       iconType: 'warning',
  //       title: t('common.tipTitle'),
  //       content: t('common.delTip'),
  //       onOk: async () => {
  //         try {
  //           const { code, msg } = await blukDeleteProcessCode(ids);
  //           if (code == 200) {
  //             createMessage.warning(msg);
  //           }
  //           reload();
  //         } catch (e) {
  //           reload();
  //         }
  //       },
  //     });
  //   }
  // }
  // function batchImportOrExport({ key }) {
  //   const openMethod = key === 'import' ? handleImport : handleExport;
  //   openMethod();
  // }
  // //导入
  // function handleImport() {
  //   openImportPopup(true, {
  //     title: t('common.add'),
  //     isDevPlatform: false,
  //   });
  // }
  // //导出
  // function handleExport() {
  //   openExportModal(true, {
  //     api: exportProcessCodeExcel,
  //     listQuery: {
  //       ...getFetchParams(),
  //     },
  //     exportOptions: columns,
  //     nameProps: 'title',
  //     idProps: 'field',
  //     i18nConfig: {
  //       moduleCode: 'ProcessCodeColumn',
  //     },
  //   });
  // }
</script>
