<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_add'" type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <a-button v-auth="'btn_add'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
            <!-- <a-dropdown>
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item v-if="hasBtnP('btn_upload')" key="import">{{ t('common.batchImport') }}</a-menu-item>
                  <a-menu-item v-if="hasBtnP('btn_download')" key="export">{{ t('common.batchExport') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown> -->
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'statusDesc'">
              <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.statusDesc }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'typeDesc'">
              <a-tag :color="record.type === 1 ? 'success' : record.type === 2 ? 'warning' : record.type === 3 ? 'blue' : 'error'">{{ record.typeDesc }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'processTypeDesc'">
              <a-tag :color="record.processType === 1 ? 'success' : record.processType === 2 ? 'warning' : 'blue'">{{ record.processTypeDesc }}</a-tag>
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
  import { ActionItem, BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { blukDeleteProcessPara, deleteProcessPara, exportProcessParaExcel, getProcessPara } from '/@/api/engineering/process';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';

  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const { t } = useI18n();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const columns: BasicColumn[] = [
    { title: '工艺类型', dataIndex: 'typeCodeName' },
    { title: '刀数', dataIndex: 'numberOfKnives' },
    {
      title: '步距范围',
      dataIndex: 'stepRange',
      align: 'center',
      children: [
        {
          title: t('dict.ProcessParaColumn.stepDistanceFrom') + '(＞)',
          dataIndex: 'stepDistanceFrom',
          key: 'street',
          align: 'center',
        },
        {
          title: t('dict.ProcessParaColumn.stepDistanceTo') + '(≤)',
          dataIndex: 'stepDistanceTo',
          key: 'street',
          align: 'center',
        },
      ],
    },
    // {
    //   title: '模切单位',
    //   align: 'center',
    //   children: [
    //     {
    //       title: '速度',
    //       dataIndex: 'dieCutSpeed',
    //       key: 'street',
    //       align: 'center',
    //     },
    //     {
    //       title: '单位',
    //       dataIndex: 'dieCutSpeedUnit',
    //       key: 'street',
    //       align: 'center',
    //     },
    //   ],
    // },
    { title: '主机手技能', dataIndex: 'mainOperatorStaffingName' },
    { title: '辅机手技能', dataIndex: 'auxiliaryOperatorStaffingName' },
    {
      title: '建议开机速度',
      align: 'center',
      dataIndex: 'suggestedStartupSpeedField',
      children: [
        {
          title: t('dict.PCCColumn.speed'),
          dataIndex: 'suggestedStartupSpeed',
          // key: 'street',
          align: 'center',
        },
        {
          title: t('dict.PCCPackingType.unit'),
          dataIndex: 'suggestedStartupSpeedUnit',
          // key: 'street',
          align: 'center',
        },
      ],
    },
    { title: '建议调机时间', dataIndex: 'suggestedAdjustmentTime' },
    {
      title: '建议良率',
      dataIndex: 'suggestedYield',
      customRender: ({ record }) => {
        return record.suggestedYield ? record.suggestedYield * 100 + '%' : '';
      },
    },
    { title: '建议调机米数', dataIndex: 'suggestedAdjustmentMetres' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'typeCode',
      label: '',
      i18nField: 'typeCodeName',
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
      field: 'numberOfKnives',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入刀数',
      },
      colProps: { span: 4 },
    },
  ];

  const [registerTable, { getRowSelection, clearSelectedRowKeys, reload, getFetchParams, getForm }] = useTable({
    api: getProcessPara,
    title: '',
    columns,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      i18nConfig: {
        moduleCode: 'ProcessParaColumn',
        transferRange: ['placeholder'],
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
    i18nConfig: {
      moduleCode: 'ProcessParaColumn',
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
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    openFormModal(true, { record });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteProcessPara(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
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
            const { code } = await blukDeleteProcessPara(list);
            if (code == 200) {
              message.warning(t('common.delSuccess'));
            }
            clearSelectedRowKeys();
            reload();
          } catch (e) {
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
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }
  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportProcessParaExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'ProcessParaColumn',
      },
    });
  }
</script>
