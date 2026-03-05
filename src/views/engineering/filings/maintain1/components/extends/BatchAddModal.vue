<template>
  <BasicModal v-bind="$attrs" :width="900" :height="600" :title="props.title" destroyOnClose class="batch-modal" @register="registerModal" @ok="handleSubmit">
    <BasicTable :style="{ minHeight: '400px' }" @register="registerSubTable"></BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { formatTableDefaultText, getMenuId } from '/@/utils';
  import { getInnermaterialnumber, getFactorysList } from '/@/api/business/quantitation';
  // import { getFactorylist } from '/@/api/business/member';

  const emit = defineEmits(['reload', 'register']);
  const props = defineProps({
    title: {
      type: String,
      default: '批量添加',
    },
  });

  const [registerModal, { closeModal }] = useModalInner(init);
  function init(data) {
    console.log(data);
  }
  const [registerSubTable, { getSelectRows }] = useTable({
    api: getInnermaterialnumber,
    columns: [
      { title: '产品内部料号', dataIndex: 'InsidePartNumber', width: 180 },
      { title: '工厂', dataIndex: 'FactoryFullName', width: 120 },
      { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 120 },
      { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 120 },
      {
        title: '脱敏图纸',
        dataIndex: 'DesensitizedDrawingsName',
        width: 120,
        helpMessage: ['只筛选出有脱敏图纸的料号'],
        customRender: ({ text }) => {
          return text ? '有' : '无';
        },
      },
      { title: '产品描述', dataIndex: 'ProductDesc', width: 120 },
      { title: '成品编码申请单号', dataIndex: 'ApplyCode', width: 120 },
      {
        title: '直接客户名称',
        dataIndex: 'ImmediateCustomerCode',
        width: 180,
        customRender: ({ record }) => {
          return record.ImmediateCustomerName + '/' + record.ImmediateCustomerCode;
        },
      },
    ],
    useSearchForm: true,
    formConfig: {
      baseColProps: {
        span: 8,
      },
      schemas: [
        {
          field: 'ApplyCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: '成品编码申请单号', maxlength: 50 },
        },
        {
          field: 'InsideProjectCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: '内部项目代码', maxlength: 50 },
        },
        {
          field: 'ImmediateCustomerCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: '直接客户代码', maxlength: 50 },
        },
        {
          field: 'FactoryId',
          label: '',
          component: 'ApiSelect',
          labelWidth: 100,
          componentProps: {
            placeholder: '工厂',
            api: getFactorysList,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'factoryCode',
            },
            resultField: 'data',
            labelField: 'Name',
            valueField: 'Id',
            immediate: true,
            nameFormat: ['Name', '/', 'Code'],
          },
        },
      ],
    },
    rowKey: 'InsidePartNumber',
    striped: true,
    ellipsis: true,
    showTableSetting: false,
    isCanResizeParent: true,
    canResize: true,
    scroll: {
      y: 400,
    },
    rowSelection: { type: 'checkbox' },
    resizeHeightOffset: 20,
    showIndexColumn: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function handleSubmit() {
    closeModal();
    emit('reload', getSelectRows());
  }
</script>
