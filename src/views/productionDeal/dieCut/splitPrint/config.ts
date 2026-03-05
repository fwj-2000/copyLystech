// 主页form配置
export function getFormSchema() {
  return [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
      },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品编码',
      },
    },
    {
      field: 'rawMatCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '原材料号',
      },
    },
    {
      field: 'uniqueCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '分切唯一码',
      },
    },
    {
      field: 'rawUniqueCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '原材唯一码',
      },
    },
  ];
}
