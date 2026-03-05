<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
            <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })">{{ t('common.batchExport') }} </button>
              </template>
              <a-button>{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Status'">
              <a-tag :color="record.Status === 1 ? 'success' : 'error'">{{ record.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
            </template>
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
  import { getPackingInfo, deletePackingInfo, blukDeletePackingInfo, exportPackingInfoExcel } from '/@/api/productionDeal/packingInfo';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { formatTableDefaultText } from '/@/utils';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    packingType: any[];
  }

  const state = reactive<State>({
    packingType: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns: BasicColumn[] = [
    { title: '内部料号', dataIndex: 'InnerMaterialCode', align: 'center' },
    { title: '包装类型', dataIndex: 'PackingTypeDes' },
    { title: '数量(pcs)', dataIndex: 'Quantity' },
    { title: '纸盒规格', dataIndex: 'PaperBoxSpec' },
    { title: '纸箱规格', dataIndex: 'PaperCartonSpec' },
    { title: '生产日期', dataIndex: 'DateCode' },
    { title: '批次规格', dataIndex: 'LotNo' },
    { title: '标签模板', dataIndex: 'LabelTemplateName' },
    { title: '是否启用', dataIndex: 'Status' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'LastModifyUserName' },
    { title: '修改时间', dataIndex: 'LastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const exprotColumns: BasicColumn[] = [
    { title: '内部料号', dataIndex: 'InnerMaterialCode', align: 'center' },
    { title: '包装类型', dataIndex: 'PackingTypeDes' },
    { title: '数量(pcs)', dataIndex: 'Quantity' },
    { title: '纸盒规格', dataIndex: 'PaperBoxSpec' },
    { title: '纸想规格', dataIndex: 'PaperCartonSpec' },
    { title: '生产日期', dataIndex: 'DateCode' },
    { title: '批次规格', dataIndex: 'LotNo' },
    { title: '标签模板', dataIndex: 'LabelTemplateName' },
    { title: '是否启用', dataIndex: 'StatusName' },
    { title: '创建人', dataIndex: 'CreatorUserName' },
    { title: '创建时间', dataIndex: 'CreatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '修改人', dataIndex: 'LastModifyUserName' },
    { title: '修改时间', dataIndex: 'LastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'InnerMaterialCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.PackingInfoColumn.InnerMaterialCode']), //'请输入内部料号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'PackingType',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: t(['common.selectPlaceholder', 'dict.PackingInfoColumn.PackingTypeDes']), //'请选择包装类型',
      },
      colProps: { span: 4 },
    },
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ];

  //getRowSelection获取行id, reload刷新表单，getFetchParams获取表单数据
  const [registerTable, { getRowSelection, reload, getFetchParams, getForm }] = useTable({
    api: getPackingInfo,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

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
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: `PackingInfoColumn`,
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
    openFormModal(true, { id, packingType: state.packingType });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deletePackingInfo(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getRowSelection().selectedRowKeys;
    if (list?.length === 0) {
      getRowSelection().selectedRowKeys = [];
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeletePackingInfo(list);
            if (code == 200) {
              getRowSelection().selectedRowKeys = [];
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            getRowSelection().selectedRowKeys = [];
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
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportPackingInfoExcel,
      listQuery,
      exportOptions: exprotColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'PackingInfoColumn',
      },
    });
  }

  onMounted(async () => {
    baseStore.getDictionaryData('PackingType').then(res => {
      state.packingType = res as any[];
      getForm().updateSchema({
        field: 'PackingType',
        componentProps: {
          options: res,
          fieldNames: { value: 'enCode' },
        },
      });
    });
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
