import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 条件选项
const ErrorStatus = [
  { fullName: t('无异常'), id: 0, theme: 'green' },
  { fullName: t('有异常'), id: 1, theme: 'red' },
];
// const ConfirmStatus = [
//   { fullName: t('已确认'), id: 1, theme: 'green' },
//   { fullName: t('待确认'), id: 0, theme: 'red' },
// ];
// 查询条件
export const schemaFormConfig = () => [
  {
    fieldName: 'hasError',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
      options: ErrorStatus,
      placeholder: t('common.dataValidate'),
    },
  },
  // {
  //   fieldName: 'isConfirm',
  //   label: '',
  //   component: 'Select',
  //   componentProps: {
  //     fieldNames: {
  //       label: 'fullName',
  //       value: 'id',
  //     },
  //     options: ConfirmStatus,
  //     placeholder: '状态',
  //   },
  // },
  {
    fieldName: 'createUserId',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: t('dict.SalesForecastColumn.ImportUserName'),
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      placeholder: t('dict.SalesForecastColumn.ImportDateTime'),
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: t('common.fileName'),
    field: 'fileName',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: 'Project',
    field: 'projectName',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: t('common.dataValidate'),
    field: 'hasError',
    width: 150,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: ErrorStatus,
    },
    sortable: true,
  },
  // {
  //   title: '状态',
  //   field: 'isConfirm',
  //   width: 120,
  //   cellRender: {
  //     name: 'Tag',
  //     cSharpType: 'int',
  //     options: ConfirmStatus,
  //   },
  //   sortable: true,
  // },
  { title: t('dict.SalesForecastColumn.ImportUserName'), field: 'createUserName', minWidth: 180, sortable: true },
  {
    title: t('dict.SalesForecastColumn.ImportDateTime'),
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
    minWidth: 150,
    sortable: true,
  },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
