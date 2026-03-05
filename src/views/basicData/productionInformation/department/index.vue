<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button v-if="hasBtnP('btn_download')" @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
                <button v-if="hasBtnP('btn_upload')" @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_download') || hasBtnP('btn_upload')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <template #action="{ row }">
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
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getDepartment, deleteDepartment, blukDeleteDepartment, exportDepartmentExcel } from '/@/api/basicData/department';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import { formatTableDefaultText } from '/@/utils';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ImportModal from './components/ImportModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';

  defineOptions({ name: 'basicData-productionInformation-department' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const STATUS = [
    { id: 1, fullName: t('common.yes'), theme: 'green' },
    { id: 2, fullName: t('common.no'), theme: 'red' },
  ];

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '部门编码', field: 'Code', align: 'center' },
    { title: '部门名称', field: 'Name' },
    { title: '所属厂区', field: 'FactoryAreaName' },
    { title: '责任人', field: 'DutyUserName' },
    {
      title: '是否启用',
      field: 'Status',
      cellRender: {
        name: 'Tag',
        options: STATUS,
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
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
  ];

  const searchFormSchema = [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.DepartmentColumn.Code']), //'请输入部门编码',
      },
    },
    {
      fieldName: 'Name',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.DepartmentColumn.Name']), //'请输入部门名称',
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        submitOnPressEnter: true,
        placeholder: [t('common.PrintStartTime'), t('common.PrintEndTime')],
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  // const [registerTable, { getRowSelection, reload, getFetchParams }] = useTable({
  //   api: getDepartment,
  //   title: '',
  //   columns,
  //   rowKey: 'Id',
  //   isCanResizeParent: true,
  //   canResize: true, //自适应高度
  //   formConfig: {
  //     //搜索框
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
  //     autoAdvancedLine: 1, //自动展开行
  //   },
  //   striped: true,
  //   useSearchForm: true, //使用搜索表单
  //   showTableSetting: true, //刷新按钮,默认打开
  //   bordered: true, //显示表格边框
  //   showIndexColumn: true, //显示序号
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   rowSelection: {
  //     type: 'checkbox',
  //   },
  //   actionColumn: {
  //     width: 70,
  //     title: '操作',
  //     dataIndex: 'action', //字段
  //     fixed: 'right', //显示在右边
  //   },
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  //   i18nConfig: {
  //     moduleCode: `DepartmentColumn`,
  //   },
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'DepartmentColumn',
        transferRange: ['placeholder'],
        excludeFields: ['pickerVal'],
      },
    },
    gridOptions: {
      id: 'productionInformation-department-list',
      columns: columns,
      api: getDepartment,
      isCanResizeParent: true,
      canResize: true, //自适应高度
      useSearchForm: true,
      bordered: true,
      showIndexColumn: true,
      striped: true,
      showTableSetting: true, //刷新按钮,默认打开
      transformCellText: ({ text }) => formatTableDefaultText(text),
      i18nConfig: {
        moduleCode: 'DepartmentColumn',
      },
      pagerConfig: {
        pageSize: 30,
        size: 'small',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, clearSelectedRowKeys } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
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
    deleteDepartment(record.Id).then(res => {
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
            const { code } = await blukDeleteDepartment(list);
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
    openImportModal(true, {});
  }

  //导出
  async function handleExport() {
    const listQuery = {
      ...(await getFetchParams()),
    };
    openExportModal(true, {
      api: exportDepartmentExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DepartmentColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
