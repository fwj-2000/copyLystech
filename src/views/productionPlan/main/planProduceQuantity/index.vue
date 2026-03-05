<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
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
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getPlanProduceQuantity,
    deletePlanProduceQuantity,
    blukDeletePlanProduceQuantity,
    exportPlanProduceQuantityExcel,
  } from '/@/api/productionPlan/planProduceQuantity';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { onMounted } from 'vue';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { hasBtnP } = usePermission();

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns: BasicColumn[] = [
    { title: '归属厂区', dataIndex: 'factoryAreaName' },
    { title: '控制者', dataIndex: 'controlPerson' },
    { title: '产品料号', dataIndex: 'innerMaterialNumber' },
    { title: '周一', dataIndex: 'mondayQuantity' },
    { title: '周二', dataIndex: 'tuesdayQuantity' },
    { title: '周三', dataIndex: 'wednesdayQuantity' },
    { title: '周四', dataIndex: 'thursdayQuantity' },
    { title: '周五', dataIndex: 'fridayQuantity' },
    { title: '周六', dataIndex: 'saturdayQuantity' },
    { title: '周日', dataIndex: 'sundayQuantity' },
    { title: '创建人', dataIndex: 'creatorUserName' },
    { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'searchDate',
      label: '周数',
      component: 'WeekPicker',
      componentProps: {
        placeholder: '请选择周数',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 5 },
    },
    {
      field: 'factoryArea',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入归属厂区',
      },
      colProps: { span: 5 },
    },
    {
      field: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入产品料号',
      },
      colProps: { span: 4 },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getForm }] = useTable({
    api: getPlanProduceQuantity,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      transformDateFunc: date => {
        return `${date.year()}WK${date.week().toString().padStart(2, '0')}`;
      },
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开
    bordered: true, //显示表格边框
    showIndexColumn: true, //显示序号
    pagination: {
      pageSize: 30,
      size: 'small',
    },
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 70,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
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
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    const searchDate = getForm().getFieldsValue().searchDate;
    if (!searchDate) {
      return createMessage.warning('请先选择周数');
    }
    openFormModal(true, { record, searchDate: searchDate });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deletePlanProduceQuantity(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      return createMessage.warning('请选中需要删除的行');
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: '此操作将永久删除该数据, 是否继续？',
        onOk: async () => {
          try {
            const { code } = await blukDeletePlanProduceQuantity(list);
            if (code == 200) {
              createMessage.warning(t('common.delSuccess'));
            }
          } finally {
            clearSelectedRowKeys();
            reload();
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
    const searchDate = getForm().getFieldsValue().searchDate;
    if (!searchDate) {
      return createMessage.warning('请先选择周数');
    }
    openImportPopup(true, {
      title: t('common.add'),
      searchDate: searchDate,
      isDevPlatform: false,
    });
  }
  //导出
  function handleExport() {
    const searchDate = getForm().getFieldsValue().searchDate;
    if (!searchDate) {
      return createMessage.warning('请先选择周数');
    }
    openExportModal(true, {
      api: exportPlanProduceQuantityExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  onMounted(async () => {});
</script>
