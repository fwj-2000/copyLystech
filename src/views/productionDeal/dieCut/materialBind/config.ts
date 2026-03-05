// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'documentNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单据号',
      },
    },
    {
      fieldName: 'snCodes',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'SN',
      },
      i18nField: 'snCode',
    },
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品编码',
      },
    },
    {
      fieldName: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
      },
    },
  ];
}

export const columns = [
  {
    title: '层数',
    field: 'layers',
    width: 60,
    // i18nField: 'DFMPart',
  },
  {
    title: '单据号',
    field: 'documentNumber',
    // i18nField: 'DFMPart',
  },
  {
    title: 'SN',
    field: 'snCode',
    // i18nField: 'DFMPart',
  },
  {
    title: '产品编码',
    field: 'productCode',
    // i18nField: 'DFMPart',
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    // i18nField: 'DFMPart',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'creatorUserId',
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
  // {
  //   title: '操作',
  //   field: 'action',
  //   slots: { default: 'action' },
  //   width: 60,
  //   fixed: 'right',
  // },
];
