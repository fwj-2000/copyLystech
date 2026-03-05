import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
// 主页form配置
export const schema = [
  // {
  //   fieldName: 'factoryArea',
  //   label: '',
  //   i18nField: 'CommonCol.factoryArea',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: ListByUserfactory,
  //     placeholder: '所属厂区',
  //     showSearch: true,
  //     resultField: 'data',
  //     filterOption: (inputValue, path) => {
  //       return [path].some(option => option.label.includes(inputValue));
  //     },
  //     notFoundContent: null,
  //     immediate: true,
  //     labelField: 'Name',
  //     valueField: 'Code',
  //     defaultFirstOption: true,
  //     allowClear: false,
  //   },
  // },
  // {
  //   fieldName: 'gxCode',
  //   label: '',
  //   component: 'Select',
  //   componentProps: {
  //     fieldNames: {
  //       value: 'code',
  //       label: 'name',
  //     },
  //     options: [],
  //     placeholder: '工序',
  //   },
  //   // i18nField: 'LineTypeName',
  // },
  {
    fieldName: 'snCode',
    label: '',
    component: 'Textarea',
    componentProps: {
      placeholder: 'SN',
      allowClear: true,
      rows: 1,
    },
  },
  // {
  //   fieldName: 'pickerVal',
  //   label: '',
  //   component: 'RangePicker',
  //   componentProps: {
  //     allowClear: false,
  //   },
  // },
  // {
  //   fieldName: 'reportUserId',
  //   label: '',
  //   component: 'CustomUserSelect',
  //   componentProps: {
  //     placeholder: '报工人员',
  //     allowClear: true,
  //   },
  // },
];

// 主页表格column配置
export const column = [
  { type: 'expand', width: 60, slots: { content: 'expand_content' } },
  {
    title: 'SN',
    field: 'snCode',
    width: 200,
  },
  {
    title: '工序1',
    field: 'processName1',
    width: 220,
  },
  {
    title: '工序2',
    field: 'processName2',
    width: 220,
  },
  {
    title: '工序3',
    field: 'processName3',
    width: 220,
  },
  {
    title: '工序4',
    field: 'processName4',
    width: 220,
  },
  {
    title: '工序5',
    field: 'processName5',
    width: 220,
  },
  {
    title: '工序6',
    field: 'processName6',
    width: 220,
  },
  {
    title: '工序7',
    field: 'processName7',
    width: 220,
  },
  {
    title: '工序8',
    field: 'processName8',
    width: 220,
  },
  {
    title: '工序9',
    field: 'processName9',
    width: 220,
  },
  {
    title: '工序10',
    field: 'processName10',
    width: 220,
  },
  {
    title: '工序11',
    field: 'processName11',
    width: 240,
  },
  {
    title: '工序12',
    field: 'processName12',
    width: 220,
  },
];

export const detailGridColumn: any[] = [
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
  },
  {
    title: 'SN',
    width: 120,
    field: 'snCode',
  },
  {
    title: '日期',
    width: 120,
    field: 'classesDate',
  },
  {
    title: '班次',
    field: 'classesName',
    width: 120,
  },
  {
    title: '结果',
    field: 'decideResultName',
    width: 120,
  },
  {
    title: '线体',
    field: 'lineCodeName',
    width: 120,
  },
  {
    title: '操作人',
    field: 'creatorUserName',
    width: 160,
  },
  {
    title: '操作时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 160,
  },
];
export const detailColumn = [
  { field: 'processName', title: '工序' },
  { field: 'classesName', title: '班次' },
  { field: 'lineCodeName', title: '线体名称', i18nField: 'lineName' },
  { field: 'lineCode', title: '线体编码', i18nField: 'lineCoding' },
  { field: 'status', title: '状态', slots: { default: 'status' } },
  { field: 'creatorUserName', title: '操作人' },
  {
    field: 'creatorTime',
    title: '操作时间',
    cellRender: {
      name: 'Date',
    },
  },
];
