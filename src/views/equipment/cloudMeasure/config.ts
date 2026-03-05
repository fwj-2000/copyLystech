export const getFormConfig = () => {
  return [
    {
      fieldName: 'factoryName',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '请输入厂区名称或者厂区编码',
      },
    },
    {
      fieldName: 'documentNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '请输入单据号',
      },
    },
    {
      fieldName: 'orderNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        // placeholder: '请输入工单号',
      },
    },
    {
      fieldName: 'materialCode',
      label: '',
      component: 'Input',
      componentProps: {
        // placeholder: '请输入物料号',
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        allowClear: false,
      },
    },
  ];
};
export const getColumn = () => {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '厂区名称', field: 'factoryName' },
    { title: '单据号', field: 'documentNumber' },
    { title: '工单号', field: 'orderNumber' },
    { title: '物料号', field: 'materialCode' },
    { title: '批次号', field: 'avr' },
    //{ title: '数量', field: 'qty' },
    { title: '送检单位', field: 'inspectionDep' },
    { title: '机台号', field: 'machineNumber' },
    { title: '产品名称', field: 'materialName' },
    { title: '产品描述', field: 'materialDesc' },
    { title: '生产楼层', field: 'productionFloor' },
    { title: '测量设备', field: 'measureEquipment' },
    { title: '模穴号', field: 'modelHoleNumber' },
    { title: '送检人员', field: 'inspectionPerson' },
    { title: '班别', field: 'className' },
    {
      title: '送检时间',
      field: 'inspectionTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '检验类别', field: 'measureType' },
    { title: '模具号', field: 'mouldNumber' },
    { title: '工艺类型', field: 'craftType' },
    { title: '样品数量', field: 'sampleQty' },
    { title: '测量人员', field: 'measurePerson' },
    {
      title: '测量开始时间',
      field: 'measureBeginTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '测量完成时间',
      field: 'measureEndTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '修改人', field: 'lastModifyUserName' },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
};
