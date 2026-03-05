import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const formConfig = {
  showActionButtonGroup: true,
  showAdvancedButton: false,
  compact: true,
  labelAlign: 'left',
  labelWidth: 70,
  schemas: [
    {
      field: 'applyNumber',
      component: 'Input',
      componentProps: { placeholder: '请输入申请单号', maxlength: 50 },
    },
    {
      field: 'applyType',
      component: 'Select',
      labelWidth: 100,
      componentProps: { placeholder: '请选择申请类型', maxlength: 50, options: [{ id: 1, fullName: '样品申请' }] },
    },
    {
      field: 'status',
      component: 'Select',
      labelWidth: 100,
      componentProps: { placeholder: '请选择状态', maxlength: 50 },
    },
  ],
};

export const columns: BasicColumn[] = [
  { title: '申请单号', dataIndex: 'applyNumber', sorter: true, width: 180 },
  { title: '申请类型', dataIndex: 'applyTypeDesc', sorter: true, width: 140 },
  {
    title: '状态',
    dataIndex: 'statusDesc',
    sorter: true,
    width: 100,
    customRender: ({ text, record }) => {
      if (record.newsEngineeringStatus == 1) {
        return h('span', { class: 'news-dot right' }, text);
      }
      return text;
    },
  },
  { title: '月份', dataIndex: 'month', sorter: true, width: 100 },
  { title: '周别', dataIndex: 'week', sorter: true, width: 100 },
  { title: '申请人', dataIndex: 'applyUserName', key: 'applyUserName', width: 170, sorter: true },
  { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 140, sorter: true, format: 'date|YYYY-MM-DD' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'ApplyCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('views.business.quota.batchCode'),
      },
      width: 100,
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('views.business.quota.internalPartNumber'),
      },
    },
    {
      fieldName: 'ProjectLeaderName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'PDT Leader',
      },
    },
    {
      fieldName: 'RequireDate',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择',
      },
    },
  ];
}

export function getColumn() {
  return [
    {
      field: 'applyCode',
      title: '单号',
    },
  ];
}
