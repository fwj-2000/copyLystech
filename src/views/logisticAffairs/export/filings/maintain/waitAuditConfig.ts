import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const statusOptions = [{ id: 10, fullName: t('dict.FilingsApplyStatusEnum.10'), theme: 'gray' }];

export function getFormConfig() {
  return [
    {
      fieldName: 'filingsApplyNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '需求单号/备案需求单号', allowClear: true },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerName',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户信息', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户料号', allowClear: true },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '终端客户料号', allowClear: true },
    },
    {
      fieldName: 'customersId',
      label: '',
      i18nField: 'customersName',
      component: 'CustomUserSelect',
      componentProps: { placeholder: '客服', allowClear: true },
    },
    {
      fieldName: 'customsPersonId',
      label: '',
      i18nField: 'customsPersonName',
      component: 'CustomUserSelect',
      componentProps: { placeholder: '关务', allowClear: true },
    },
    {
      fieldName: 'pdPersonId',
      label: '',
      i18nField: 'pdPersonName',
      component: 'CustomUserSelect',
      componentProps: { placeholder: 'PD', allowClear: true },
    },
    // {
    //   fieldName: 'makeReviewUserId',
    //   label: '',
    //   i18nField: 'makeReviewUserName',
    //   component: 'CustomUserSelect',
    //   componentProps: { placeholder: '复核人' },
    // },
    {
      fieldName: 'makeStatus',
      label: '',
      component: 'Select',
      i18nField: 'status',
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
  ];
}

export function getColumns() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '备案需求单号',
      field: 'filingsApplyNo',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    {
      title: '状态',
      field: 'makeStatus',
      i18nField: 'status',
      width: 160,
      // sortable: true,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      i18nField: 'CommonCol.currentNodeUser',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNode',
      i18nField: 'CommonCol.currentNode',
      width: 200,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 200,
      slots: {
        default: 'nodeDetail',
      },
    },
    { title: '直接客户料号', field: 'immediateCustomerPartNumber', width: 200 },
    { title: '直接客户简称', field: 'immediateCustomerName', width: 200 },
    { title: '终端客户料号', field: 'terminalCustomerPartNumber', width: 200 },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    { title: '客服', field: 'customersName', width: 200 },
    { title: '关务', field: 'customsPersonName', width: 200 },
    { title: 'PD', field: 'pdPersonName', width: 200 },
    // { title: '复核人', field: 'makeReviewUserName', width: 200 },
    {
      title: t('common.action'),
      width: 50,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}
