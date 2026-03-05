import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), value: 1, label: t('common.enableText'), theme: 'green' },
  { id: 2, fullName: t('common.disableText'), value: 2, label: t('common.disableText'), theme: 'red' },
];

export const columns = [
  {
    type: 'checkbox',
    field: 'checkbox',
    align: 'center',
    width: '50',
  },
  // {
  //   type: 'seq',
  //   field: 'seq',
  //   align: 'center',
  //   width: '50',
  // },
  {
    title: '物理位置编码',
    field: 'LocationAreaCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '车间名称',
    field: 'WorkshopName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '车间编码',
    field: 'WorkshopCode',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '物理位置',
    field: 'LocationArea',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '是否启用',
    field: 'Status',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    width: '120',
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: statusOptions,
    },
  },
  {
    title: '备注',
    field: 'Remark',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建人',
    field: 'CreatorUserName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'LastModifyUserName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const searchFormSchema = [
  {
    fieldName: 'WorkshopName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t(['common.inputPlaceholder', 'dict.LocationAreaColumn.WorkshopName']), //'请输入车间名称',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'WorkshopCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t(['common.inputPlaceholder', 'dict.LocationAreaColumn.WorkshopCode']), //'请输入车间编码',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'LocationArea',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t(['common.inputPlaceholder', 'dict.LocationAreaColumn.LocationArea']), //'请输入物理位置',
    },
    colProps: { span: 4 },
  },
  // {
  //   fieldName: 'pickerVal',
  //   label: '',
  //   component: 'RangePicker',
  //   componentProps: {
  //     format: 'YYYY-MM-DD',
  //     placeholder: ['开始时间', '结束时间'],
  //     width: '400px',
  //   },
  // },
];
