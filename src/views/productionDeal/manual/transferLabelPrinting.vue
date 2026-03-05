<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handlePrint" v-auth="'btn_print'">{{ t('common.print') }}</a-button>
          </template>
          <!-- <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <TableAction :actions="getTableActions(record)" />
              </template>
            </template> -->
        </BasicTable>
      </div>
    </div>
    <printModal @register="registerAddForm" @reload="reload" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { getManuallabelprint } from '/@/api/productionDeal/dieCutPerPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import printModal from './components/printModal.vue';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const { t } = useI18n();
  const columns: BasicColumn[] = [
    { title: '工单号', dataIndex: 'workOrderNo', align: 'left' },
    { title: '内部料号', dataIndex: 'innerMaterialNumber', align: 'left' },
    { title: '工单数量', dataIndex: 'workOrderQuantity', align: 'left' },
    { title: '线体', dataIndex: 'lineCodeName', align: 'left' },
    { title: '厂别', dataIndex: 'factoryName', align: 'left' },
    { title: '机台号', dataIndex: 'machineNo', sorter: true, align: 'left' },
    { title: '当班计划数（K）', dataIndex: 'plansQuantity', sorter: true, align: 'left' },
    { title: '操作员', dataIndex: 'operatorName', align: 'left' },
    { title: '班次', dataIndex: 'classesName', sorter: true, align: 'left' },
    { title: '打印张数', dataIndex: 'printQuantity', align: 'left' },
    { title: '每张数量', dataIndex: 'sheetQuantity', align: 'left' },
    { title: '生产日期', dataIndex: 'productionDate', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true, align: 'left' },
    { title: '打印人', dataIndex: 'printUserName', sorter: true, align: 'left' },
    { title: '打印时间', dataIndex: 'printDate', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true, align: 'left' },
    { title: '备注', dataIndex: 'remark' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单号',
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
      field: 'classes',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
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
    api: getManuallabelprint,
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
  });

  function handlePrint(data) {
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

<style lang="less" scoped>
  ::v-deep(.ant-table-container) {
    padding: 0 0 0 10px !important;
  }
</style>
