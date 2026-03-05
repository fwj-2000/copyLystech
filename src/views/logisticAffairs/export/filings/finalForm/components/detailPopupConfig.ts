import { getunitList } from '/@/api/common/constant';

export const baseFormConfig: any = [
  {
    label: '项目名称',
    field: 'terminalCustomerProjectCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户料号',
    field: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户备案品名',
    field: 'goodsName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '规格尺寸',
    field: 'specSize',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户商品编码',
    field: 'goodsCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户备案单重(KG)',
    field: 'weight',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '申报要素',
    field: 'declElements',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '产品内部料号：',
    field: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户',
    field: 'immediateCustomerName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '口岸',
    field: 'protName',
    component: 'Input',
    i18nField: 'prot',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '账册类型',
    field: 'accountType',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '申报单位',
    field: 'declUnit',
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      placeholder: '',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      disabled: true,
    },
  },
  {
    label: '法定单位',
    field: 'legalUnit',
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      placeholder: '',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      disabled: true,
    },
  },
  {
    label: '客服',
    field: 'customersName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      autoSize: { minRows: 1 },
      disabled: true,
    },
  },
  {
    label: '材质成分',
    field: 'materialQuality',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '原产国',
    field: 'originCountry',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '境内货源地',
    field: 'goodDomesticSource',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '创建人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.creatorUserName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '创建日期',
    field: 'creatorTime',
    component: 'DatePicker',
    i18nField: 'CommonCol.creatorTime',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
];

export const outboundFormConfig: any = [
  {
    label: '项目名称',
    field: 'terminalCustomerProjectCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客户料号',
    field: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '产品内部料号：',
    field: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '品名',
    field: 'goodsName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '商编',
    field: 'goodsCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  // {
  //   label: 'CIQ代码',
  //   field: 'ciqCode',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '/',
  //     disabled: true,
  //   },
  // },
  {
    label: '单重(KG)',
    field: 'weight',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '申报要素',
    field: 'declElements',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备案规格(MM)',
    field: 'specSize',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '材质成分',
    field: 'materialQuality',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '用途',
    field: 'purpose',
    component: 'Textarea',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '申报单位',
    field: 'declUnit',
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      placeholder: '',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      disabled: true,
    },
  },
  {
    label: '法定单位',
    field: 'legalUnit',
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      placeholder: '',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      disabled: true,
    },
  },
  {
    label: '原产国',
    field: 'originCountry',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '地区',
    field: 'area',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客服',
    field: 'customersName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '创建人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.creatorUserName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '创建日期',
    field: 'creatorTime',
    component: 'DatePicker',
    i18nField: 'CommonCol.creatorTime',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  // {
  //   label: '备注',
  //   field: 'remark',
  //   component: 'Textarea',
  //   colProps: { span: 16 },
  //   componentProps: {
  //     placeholder: '/',
  //     rows: 1,
  //     showCount: true,
  //     maxlength: 200,
  //     disabled: true,
  //   },
  // },
];
