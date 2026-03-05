// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'serialNumber',
      label: '',
      component: 'Textarea',
      componentProps: {
        rows: 1,
        placeholder: '成品SN',
      },
    },
    //
    {
      fieldName: 'stackMaterialSnCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模切SN',
      },
      i18nField: 'stackMaterialSn',
    },
    {
      fieldName: 'documentNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单据号',
      },
    },
  ];
}

export const columns = [
  {
    title: '成品SN',
    field: 'serialNumber',
  },
  {
    title: '模切SN',
    field: 'stackMaterialSnCode',
    visible: true,
    showOverflow: false,
    resizable: true,
    height: 'auto',
    slots: { default: 'stackMaterialSnCode' },
    i18nField: 'stackMaterialSn',
  },
  {
    title: '单据号',
    field: 'documentNumber',
    visible: true,
    showOverflow: false,
    resizable: true,
    height: 'auto',
  },
  {
    title: '产品编码',
    field: 'productCode',
  },
  {
    title: '工单号',
    field: 'workOrderNo',
  },
];
