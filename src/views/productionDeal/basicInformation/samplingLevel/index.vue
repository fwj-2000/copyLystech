<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <a-button type="primary" @click="handleExport">{{ t('common.batchExport') }} </a-button>
            <a-button @click="handleImport">{{ t('common.batchImport') }} </a-button>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getSamplingLevel, deleteSamplingLevel, blukDeleteSamplingLevel, exportSamplingLevelExcel } from '/@/api/productionDeal/samplingLevel';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { dateUtil } from '/@/utils/dateUtil';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
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
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '批量上限', field: 'BatchLimit' },
    { title: '批量下限', field: 'BatchLowerLimit' },
    { title: '所属组织', field: 'OrgName' },
    { title: 'AQL值', field: 'AQLValue' },
    { title: '样本大小', field: 'SampleSize' },
    { title: '检验水平', field: 'TestingLevelName' },
    { title: '允许数量', field: 'AllowQuantity' },
    { title: '拒收数量', field: 'RejectQuantity' },
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
      fieldName: 'BatchLimit',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.BatchLimit']), //'请输入批量上限',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'BatchLowerLimit',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.BatchLowerLimit']), //'请输入批量下限',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'AQLValue',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.AQLValue']), //'请输入AQL值',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'SampleSize',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.SampleSize']), //'请输入样本大小',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'TestingLevel',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.TestingLevelName']), //'请选择检验水平',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'AllowQuantity',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.AllowQuantity']), //'请输入允许数量',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'RejectQuantity',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.SamplingLevelColumn.RejectQuantity']), //'请输入拒收数量',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
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
      showCollapseButton: true,
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
      id: 'productionDeal-basicInformation-samplingLevel',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getSamplingLevel,
      rowConfig: {
        keyField: 'Id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: `SamplingLevelColumn`,
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
    deleteSamplingLevel(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteSamplingLevel(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportSamplingLevelExcel,
      listQuery: await getFetchParams(),
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'SamplingLevelColumn',
      },
    });
  }

  onMounted(async () => {
    baseStore.getDictionaryData('TestingLevelType').then(res => {
      state.typeOption = res as any[];
      updateSchema([
        {
          fieldName: 'TestingLevel',
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
