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
            <TableAction :actions="getTableActions(row)" />
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
  import { getTolerance, getProcessList, deleteTolerance, blukDeleteTolerance, exportToleranceExcel } from '/@/api/productionDeal/tolerance';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  const { t } = useI18n();

  interface State {
    processList: any[];
  }

  const state = reactive<State>({
    processList: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '项目号', field: 'ProjectNo' },
    { title: '工序', field: 'ProcessName' },
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
    { title: 'FAI_NO', field: 'FAINo' },
    { title: '图纸管控上限', field: 'DrawingControlUpperLimit' },
    { title: '图纸管控下限', field: 'DrawingControlLowerLimit' },
    { title: '出货管控上限', field: 'ShipmentControlUpperLimit' },
    { title: '出货管控下限', field: 'ShipmentControlLowerLimit' },
    { title: '停机管控上限', field: 'ShutdownControlUpperLimit' },
    { title: '停机管控下限', field: 'ShutdownControlLowerLimit' },
    { title: '建议首件上限', field: 'FirstArticleUpperLimit' },
    { title: '建议首件下限', field: 'FirstArticleLowerLimit' },
    { title: '版本说明', field: 'Remark' },
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
      fieldName: 'ProjectNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.ToleranceColumn.ProjectNo']), //'请输入项目号',
        allowClear: true,
      },
    },
    {
      fieldName: 'ProcessId',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: t(['common.selectPlaceholder', 'dict.ToleranceColumn.ProcessName']), //'请选择工序',
        showSearch: true,
        optionFilterProp: 'name',
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
      id: 'productionDeal-basicInformation-tolerance',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getTolerance,
      rowConfig: {
        keyField: 'Id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: `ToleranceColumn`,
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
    openFormModal(true, { id, processList: state.processList });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteTolerance(record.Id).then(res => {
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
            const { code } = await blukDeleteTolerance(list);
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

  //导入
  function handleImport() {
    openImportModal(true, {});
  }

  //导出
  async function handleExport() {
    openExportModal(true, {
      api: exportToleranceExcel,
      listQuery: await getFetchParams(),
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ToleranceColumn',
      },
    });
  }
  onMounted(async () => {
    const optionList = await getProcessList('');
    const processList = optionList.data.map(i => {
      return {
        id: i.id,
        fullName: i.name,
      };
    });
    state.processList = processList as any[];
    updateSchema([
      {
        fieldName: 'ProcessId',
        componentProps: {
          placeholder: t(['common.selectPlaceholder', 'dict.ToleranceColumn.ProcessName']), //'请选择工序',
          options: optionList.data,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
      },
    ]);
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
