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
  import { getAOIPage, exportData } from '../../../../../api/equipment/aoiUpload';
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
      field: 'equipmentName',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入设备名称',
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
    { title: '设备名称', dataIndex: 'equipmentName', width: 120 },
    { title: '设备供应商', dataIndex: 'supplier', width: 120 },
    { title: '设备出厂编号', dataIndex: 'equipmentCode', width: 120 },
    { title: '设备位置', dataIndex: 'position', width: 120 },
    { title: '时间段', dataIndex: 'timeSlot', width: 120 },
    { title: '产出数量', dataIndex: 'produceQty', width: 120 },
    { title: '良品数量', dataIndex: 'okQty', width: 120 },
    { title: '良率', dataIndex: 'okRate', width: 120 },
    { title: '运行时间', dataIndex: 'runTime', width: 120 },
    { title: '稼动率', dataIndex: 'utilizationRate', width: 120 },
    { title: '本地日期', dataIndex: 'localDate', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '产品料号', dataIndex: 'productCode', width: 120 },
    { title: '工位1-膜皱', dataIndex: 'workOne', width: 120 },
    { title: '工位1-总不良品占比', dataIndex: 'workOneRate', width: 120 },
    { title: '工位2-缺料', dataIndex: 'workTwo', width: 120 },
    { title: '工位2-总不良品占比', dataIndex: 'workTwoRate', width: 120 },
    { title: '工位3-压印', dataIndex: 'workThree', width: 120 },
    { title: '工位3-总不良品占比', dataIndex: 'workThreeRate', width: 120 },
    { title: '工位4', dataIndex: 'workFour', width: 120 },
    { title: '工位4-总不良品占比', dataIndex: 'workFourRate', width: 120 },
    { title: '工位5', dataIndex: 'workFive', width: 120 },
    { title: '工位5-总不良品占比', dataIndex: 'workFiveRate', width: 120 },
    { title: '工位6', dataIndex: 'workSix', width: 120 },
    { title: '工位6-总不良品占比', dataIndex: 'workSixRate', width: 120 },
    { title: '防呆相机（NG次数)', dataIndex: 'cameraNgQty', width: 120 },
    { title: '上传时间', dataIndex: 'creatorTime', width: 120, format: 'date|YYYY-MM-DD HH:mm:ss' },
  ];

  const [registerTable, { getFetchParams }] = useTable({
    api: getAOIPage,
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
        moduleCode: 'UtilizationRateColumn',
        transferRange: ['placeholder'], // 可以配置表单的`label`和`placeholder`，或者只配置其中的一项
      },
    },
    pagination: {
      pageSize: 50,
      size: 'small',
      // simple: true
    },
    i18nConfig: {
      moduleCode: 'UtilizationRateColumn',
    },
  });

  //导出
  const handleExport = async () => {
    openExportModal(true, {
      api: exportData,
      listQuery: {
        ...getFetchParams(),
        type: 'AOI',
      },
      nameProps: 'title',
      idProps: 'dataIndex',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'UtilizationRateColumn',
      },
    });
  };
</script>
