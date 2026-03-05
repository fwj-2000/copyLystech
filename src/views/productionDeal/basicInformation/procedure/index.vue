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
  import { getProcedure, deleteProcedure, blukDeleteProcedure, exportProcedureExcel } from '/@/api/productionDeal/procedure';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: '50' },
    { title: '工位名称', field: 'Name' },
    { title: '产能主体', field: 'Mainstay' },
    { title: '所属组织', field: 'OrgName' },
    { title: '关联工序', field: 'ProcessName' },
    { title: '所属车间', field: 'WorkshopName' },
    { title: '制单人员', field: 'CreateOrderUserName' },
    { title: '所属于产线', field: 'ProductLineName' },
    {
      title: '制单日期',
      field: 'CreateOrderDate',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
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
      fieldName: 'Name',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.ProcedureColumn.Name']), //'请输入工位信息',
        allowClear: true,
      },
    },
    {
      fieldName: 'Mainstay',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.ProcedureColumn.Mainstay']), //'请输入产体主能',
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
      id: 'productionDeal-basicInformation-procedure',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getProcedure,
      i18nConfig: {
        moduleCode: `ProcedureColumn`,
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
    openFormModal(true, { id });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcedure(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
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
            const { code } = await blukDeleteProcedure(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.log(e);
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
      api: exportProcedureExcel,
      listQuery: await getFetchParams(),
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProcedureColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
