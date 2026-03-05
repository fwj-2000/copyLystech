import dayjs from 'dayjs';
export const STATUS_OPTIONS = [
  { id: 'SN', fullName: 'SN', value: 'SN', label: 'SN', theme: 'green' }, //启用
  { id: 'SmallPouch', fullName: '小袋', value: 'SmallPouch', label: '小袋', theme: 'green' }, //禁用
  { id: 'InnerCarton', fullName: '内包', value: 'InnerCarton', label: '内包', theme: 'green' }, //禁用
  { id: 'OuterCarton', fullName: '外箱', value: 'OuterCarton', label: '外箱', theme: 'green' }, //禁用
];

// 主页form配置
export const formSchema = [
  {
    fieldName: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'billNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '单据号',
      allowClear: true,
    },
  },

  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '工单号',
      allowClear: true,
    },
  },
  {
    fieldName: 'uniqueCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '唯一码',
      allowClear: true,
    },
    i18nField: 'CommonCol.uniqueCode',
  },
];

export const snFormSchema = [
  {
    fieldName: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'snCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'SnNo',
      allowClear: true,
    },
  },
  {
    fieldName: 'uniqueCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '唯一码',
      allowClear: true,
    },
    i18nField: 'CommonCol.uniqueCode',
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '单据号',
    // sortable: true,
    field: 'billNumber',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 180,
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    width: 160,
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 150,
  },
  {
    title: '班次',
    field: 'classesName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 160,
  },
  {
    title: '出货类型',
    field: 'shipPatternName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 160,
  },
  {
    title: '直接客户',
    field: 'immediateCustomerName',
    // sortable: true,
    i18nField: 'immediateCustomer',
    width: 160,
  },
  {
    title: '唯一码（小袋）',
    field: 'uniqueCodeSmPouch',
    // sortable: true,
    width: 150,
  },
  {
    title: '唯一码（内包）',
    field: 'uniqueCodeInPack',
    width: 150,
  },
  {
    title: '唯一码（外箱）',
    field: 'uniqueCodeOutBox',
    // sortable: true,
    width: 150,
  },
  {
    title: '数量（PCS）',
    field: 'qty',
    // sortable: true,
    width: 160,
  },
  {
    title: '打印人',
    field: 'printPersonName',
    width: 160,
  },
  {
    title: '打印时间',
    field: 'printTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 140,
  },
  // {
  //   title: '备注',
  //   field: 'remark',
  //   width: 160,
  // },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const snColumn = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 150,
  },
  {
    title: '工厂',
    field: 'factoryName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 150,
  },

  {
    title: '班次',
    field: 'classesName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 160,
  },
  {
    title: '唯一码（内包）',
    field: 'uniqueCodeInPack',
    width: 150,
  },
  {
    title: '唯一码（外箱）',
    field: 'uniqueCodeOutBox',
    // sortable: true,
    width: 150,
  },
  {
    title: 'SN数量',
    field: 'qty',
    // sortable: true,
    width: 160,
  },
  {
    title: '打印人',
    field: 'printPersonName',
    width: 160,
  },
  {
    title: '打印时间',
    field: 'printTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minWidth: 140,
  },
  // {
  //   title: '备注',
  //   field: 'remark',
  //   width: 160,
  // },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const printFormSchema = [
  {
    field: 'labelTemplateId',
    i18nField: 'CommonCol.labelTemplate',
    label: '标签模板',
    component: 'Select',
    componentProps: {
      placeholder: '请选择标签模板',
      showSearch: true,
      notFoundContent: null,
      immediate: true,
      allowClear: false,
      filterOption: (value: string, option: { fullName: string }) => {
        return option.fullName.includes(value);
      },
    },
    required: true,
  },
  {
    field: 'packDate',
    label: '包装日期',
    component: 'DatePicker',
    defaultValue: dayjs(),
    i18nField: 'CommonCol.packageDate',
    componentProps: {
      disabledDate: current => {
        const eightOClock = dayjs().hour(8).minute(0).second(0);
        return current && (dayjs().isAfter(eightOClock) ? current > dayjs() : current > dayjs().subtract(1, 'day'));
      },
    },
    required: true,
  },
  {
    field: 'workOrderNo',
    label: '工单号',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'innerMaterialNumber',
    label: '产品内部料号',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true,
    },
    i18nField: 'innerMaterialCode',
  },
  {
    field: 'peQty',
    label: '包装数量',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true,
    },
    i18nField: 'CommonCol.packageQuantity',
  },
  {
    field: 'printQty',
    label: '打印数量',
    component: 'InputNumber',
    required: true,
    componentProps: {
      disabled: true,
    },
    // ifShow: ({ values }) => {
    //   return values.labelTemplateId;
    // },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
  },
];

export const printSNFormSchema = [
  {
    field: 'immediateCustomer',
    label: '直接客户',
    component: 'Select',
    componentProps: {
      placeholder: '直接客户',
      allowClear: true,
      filterOption: (value: string, option: { fullName: string }) => {
        return option.fullName.includes(value);
      },
      immediate: true,
    },
    required: true,
  },

  {
    field: 'packDate',
    label: '包装日期',
    component: 'DatePicker',
    defaultValue: dayjs(),
    i18nField: 'CommonCol.packageDate',
    componentProps: {
      disabledDate: current => {
        const eightOClock = dayjs().hour(8).minute(0).second(0);
        return current && (dayjs().isAfter(eightOClock) ? current > dayjs() : current > dayjs().subtract(1, 'day'));
      },
    },
    required: true,
  },
  // {
  //   field: 'workOrderNo',
  //   label: '工单号',
  //   component: 'Input',
  //   required: true,
  //   componentProps: {
  //     disabled: true,
  //   },
  // },
  {
    field: 'innerMaterialNumber',
    label: '产品内部料号',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true,
    },
    i18nField: 'innerMaterialCode',
  },
  {
    field: 'labelTemplateId',
    i18nField: 'CommonCol.labelTemplate',
    label: '标签模板',
    component: 'Select',
    componentProps: {
      placeholder: '请选择标签模板',
      showSearch: true,
      notFoundContent: null,
      immediate: true,
      allowClear: false,
      filterOption: (value: string, option: { fullName: string }) => {
        return option.fullName.includes(value);
      },
    },
    required: true,
  },
  {
    field: 'peQty',
    label: '包装数量',
    component: 'InputNumber',
    required: true,
    componentProps: {
      disabled: true,
    },
    i18nField: 'CommonCol.packageQuantity',
  },
  // {
  //   field: 'printQty',
  //   label: '打印数量',
  //   component: 'InputNumber',
  //   required: true,
  //   componentProps: {
  //     disabled: true,
  //   },
  //   // ifShow: ({ values }) => {
  //   //   return values.labelTemplateId;
  //   // },
  // },
  {
    field: 'remark',
    label: '专案/阶段',
    component: 'Input',
    required: true,
  },
];

export const printCustomerSNFormSchema = [
  {
    field: 'labelTemplateId',
    i18nField: 'CommonCol.labelTemplate',
    label: '标签模板',
    component: 'Select',
    componentProps: {
      placeholder: '请选择标签模板',
      showSearch: true,
      notFoundContent: null,
      immediate: true,
      allowClear: false,
      filterOption: (value: string, option: { fullName: string }) => {
        return option.fullName.includes(value);
      },
    },
    required: true,
  },
  {
    field: 'innerMaterialCode',
    i18nField: 'CommonCol.innerMaterialCode',
    label: '内部料号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
  },
];

export const editPackageFormSchema = [
  {
    field: 'remark',
    label: '阶段',
    component: 'Input',
    required: true,
  },
  {
    field: 'config',
    label: 'config',
    component: 'Input',
    required: true,
  },
  {
    field: 'packDate',
    label: '包装时间',
    component: 'DatePicker',
    required: true,
  },
];
