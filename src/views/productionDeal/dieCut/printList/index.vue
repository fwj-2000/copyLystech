<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handlePrint" v-auth="'btn_print'">{{ t('common.print') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <DescModal @register="registerAddForm" @reload="reload" />
    <PrintPopup @register="registerPrintPopupForm" @refresh="reload" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getDieCutPerPrint } from '/@/api/productionDeal/dieCutPerPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import DescModal from './components/descModal.vue';
  import PrintPopup from './components/printPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const [registerPrintPopupForm, { openPopup: openPrintPopup }] = usePopup();

  const { t } = useI18n();
  const columns: BasicColumn[] = [
    { title: '工单号', dataIndex: 'workOrderNo' },
    { title: '内部料号', dataIndex: 'innerMaterialNumber' },
    { title: '工单数量', dataIndex: 'workOrderQuantity' },
    { title: '当班计划数（K）', dataIndex: 'plansQuantity', sorter: true },
    { title: '机台号', dataIndex: 'machineNo', sorter: true },
    { title: '操作员', dataIndex: 'operatorName' },
    { title: '班次', dataIndex: 'classesName', sorter: true },
    { title: '打印张数', dataIndex: 'printQuantity' },
    { title: '每张数量', dataIndex: 'sheetQuantity' },
    { title: '生产日期', dataIndex: 'productionDate', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true },
    { title: '线体', dataIndex: 'lineCodeName' },
    { title: '厂别', dataIndex: 'factoryName' },
    { title: '打印人', dataIndex: 'printUserName', sorter: true },
    { title: '打印时间', dataIndex: 'printDate', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编码',
      },
      colProps: { span: 4 },
    },
    {
      field: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '请输入内部料号' },
      colProps: { span: 4 },
    },
    {
      field: 'produceDate',
      label: '',
      component: 'DateRange',
      componentProps: {
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ];

  const [registerAddForm, { openModal: openFormModal, setModalProps }] = useModal();

  const [registerTable, { getForm, reload }] = useTable({
    api: getDieCutPerPrint,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

    showIndexColumn: true, //显示序号

    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 70,
      title: t('common.action'),
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetails.bind(null, record),
      },
    ];
  }

  function handlePrint(id) {
    openPrintPopup(true, { title: t('common.print') });
  }

  function handleDetails(data) {
    setModalProps({ height: 660, width: 800, useWrapper: false });
    openFormModal(true, data);
  }

  onMounted(() => {
    getForm().setProps({
      showResetButton: false,
      submitButtonOptions: {
        text: t('common.searchText'),
        type: 'ghost',
      },
    });
  });
</script>
