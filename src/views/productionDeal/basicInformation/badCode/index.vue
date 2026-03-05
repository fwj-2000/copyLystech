<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
          </template>
          <template #Status="{ rowIndex, row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getBadeCode, deleteBadCode, blukDeleteBadCode, exportBadCodeExcel } from '/@/api/productionDeal/badCode';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    typeOption: any[];
  }

  const state = reactive<State>({
    typeOption: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '检验项目', field: 'CheckProjectName' },
    { title: '检验类别', field: 'CheckClass' },
    { title: '不良代码', field: 'Code' },
    { title: '不良代码描述', field: 'Description' },
    { title: '所属组织', field: 'OrgName' },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: [
          { id: 2, fullName: t('common.disableText'), theme: 'red' },
          { id: 1, fullName: t('common.enableText'), theme: 'green' },
        ],
      },
    },
    { title: '备注', field: 'Remark' },
    { title: '创建人', field: 'CreatorUserName' },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '修改人', field: 'LastModifyUserName' },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: '70',
      fixed: 'right',
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.BadCodeColumn.Code']), //'请输入不良代码',
        allowClear: true,
      },
    },

    {
      fieldName: 'Description',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.BadCodeColumn.Description']), //'请输入不良代码描述',
        allowClear: true,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
        allowClear: true,
      },
    },
  ];
  const [
    Grid,
    {
      getSelectRows,
      getSelectRowKeys,
      clearSelectedRowKeys,
      setLoading: waitSetLoading,
      reload,
      setFieldValue: waitSetFieldValue,
      getFetchParams,
      updateSchema,
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
      schema: searchFormSchema,
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-badCode-index.vue',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getBadeCode,
      rowConfig: {
        keyField: 'Id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: `BadCodeColumn`,
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, typeOption: state.typeOption });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteBadCode(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteBadCode(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
            throw e;
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  //导入
  function handleImport() {
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportBadCodeExcel,
      listQuery: await getFetchParams(),
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'BadCodeColumn',
      },
    });
  }

  onMounted(async () => {
    baseStore.getDictionaryData('ClassesName').then(res => {
      state.typeOption = res as any[];
      updateSchema([
        {
          field: 'Name',
          componentProps: {
            options: res,
            fieldNames: {
              label: 'fullName',
              value: 'enCode',
            },
          },
        },
      ]);
    });
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
