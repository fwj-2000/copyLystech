<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"> </i>{{ t('common.exportText') }}</a-button>
          </template>
        </BasicTable>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import { getBSJPage, exportData } from '../../../../../api/equipment/aoiUpload';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import dayjs from 'dayjs';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const { t } = useI18n();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const searchFormSchema: FormSchema[] = [
    {
      field: 'equipmentNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入机台号',
      },
      colProps: { span: 5 },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产品料号',
      },
      colProps: { span: 5 },
    },
    {
      field: 'pickerVal',
      label: '订单日期',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: { defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] },
        placeholder: ['开始时间', '结束时间'],
      },
    },
  ];

  const columns: BasicColumn[] = [
    { title: '机台号', dataIndex: 'equipmentNumber', width: 120 },
    { title: '产品料号', dataIndex: 'productCode', width: 120 },
    { title: '主料单据号', dataIndex: 'mainNumber', width: 120 },
    { title: '辅料单据号', dataIndex: 'auxiliaryNumber', width: 120 },
    { title: '开始时间', dataIndex: 'startTime', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '结束时间', dataIndex: 'endTime', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '单卷运行时间(秒)', dataIndex: 'singleRunTime', width: 120 },
    { title: '单卷稼动率', dataIndex: 'singleUtilization', width: 120 },
    { title: '机台稼动率', dataIndex: 'equipmentUtilization', width: 120 },
    { title: '设定速度', dataIndex: 'setSpeed', width: 120 },
    { title: '设定数量', dataIndex: 'setQty', width: 120 },
    { title: '实际数量', dataIndex: 'realQty', width: 120 },
    { title: '抛料数量', dataIndex: 'throwQty', width: 120 },
    { title: '设备名称', dataIndex: 'equipmentName', width: 120 },
    { title: '供应商', dataIndex: 'supplier', width: 120 },
    { title: '设备出厂编号', dataIndex: 'equipmentCode', width: 120 },
    { title: '位置', dataIndex: 'position', width: 120 },
    { title: '本地时间', dataIndex: 'localDate', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '上传时间', dataIndex: 'creatorTime', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const [registerTable, { getFetchParams }] = useTable({
    api: getBSJPage,
    columns,
    rowKey: 'id',
    useSearchForm: true, //使用搜索表单
    bordered: true, //显示表格边框
    formConfig: {
      //搜索框
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 1, //自动展开行
      fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'BSJUtilizationRateColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
    },
    pagination: {
      pageSize: 50,
      size: 'small',
      // simple: true
    },
    i18nConfig: {
      moduleCode: 'BSJUtilizationRateColumn',
    },
  });

  //导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportData,
      listQuery: {
        ...getFetchParams(),
        type: 'BSJ',
      },
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'BSJUtilizationRateColumn',
      },
    });
  };
</script>
