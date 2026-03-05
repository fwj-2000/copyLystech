import { BasicColumn } from '/@/components/Table';
import { transformI18nVxeTable } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

export const columns = searchKey => {
  return [
    {
      title: '模具类型',
      dataIndex: 'moldTypeName',
      width: 120,
    },
    { title: '厂内模号', dataIndex: 'factoryMoldNo' },
    { title: '模具编号', dataIndex: 'moldNo' },
    { title: '工单号', dataIndex: 'workOrderNo' },
    { title: '项目名称', dataIndex: 'projectName' },
    { title: '产品名称', dataIndex: 'productName' },
    { title: '版本', dataIndex: 'version' },
    { title: 'T0交期', dataIndex: 't0DeliveryDate', format: 'date|YYYY-MM-DD' },
    {
      title: '加工要求附件',
      dataIndex: 'processDemandAttaFile',
      i18nField: 'CommonCol.processingFile',
    },
    {
      title: '客户图纸',
      dataIndex: 'customerDrawAttaFile',
      i18nField: 'CommonCol.customerDraw',
    },
    {
      title: '3D组立图',
      dataIndex: 'drawing3dFile',
      i18nField: 'CommonCol.drawing3d',
    },
    {
      title: '2D图纸',
      dataIndex: 'drawing2dFile',
      i18nField: 'CommonCol.drawing2d',
    },
    {
      title: 'DFM附件',
      dataIndex: 'dfmAttaFile',
      i18nField: 'CommonCol.DFMFile',
    },
    {
      title: '特殊做法文件',
      dataIndex: 'drawingSpecialFile',
      i18nField: 'CommonCol.drawingSpecial',
    },
    {
      title: '厂区',
      dataIndex: 'factoryAreaName',
      i18nField: 'CommonCol.factoryArea',
    },
    {
      title: '创建人',
      dataIndex: 'creatorUserName',
      i18nField: 'CommonCol.creatorUserName',
    },
    {
      title: '创建时间',
      dataIndex: 'creatorTime',
      format: 'date|YYYY-MM-DD hh:mm:ss',
      i18nField: 'CommonCol.creatorTime',
    },
    {
      title: '下发人',
      dataIndex: 'issueUserName',
      i18nField: 'CommonCol.issueUserName',
      ifShow: () => {
        // 已下发tab才有下发人和下发时间
        return searchKey === '1';
      },
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      format: 'date|YYYY-MM-DD hh:mm:ss',
      i18nField: 'CommonCol.issueTime',
      ifShow: () => {
        // 已下发tab才有下发人和下发时间
        return searchKey === '1';
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      i18nField: 'CommonCol.remark',
    },
  ];
};

export function schemas() {
  const route = useRoute();
  return [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '工单号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'moldNo',
      label: '',
      component: 'Input',
      defaultValue: route.query.moldNo || '',
      componentProps: {
        placeholder: '模具编号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'factoryMoldNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '厂内模号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'partNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '零件编号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'partName',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '零件名称',
      },
      colProps: { span: 4 },
    },
  ];
}

export const sub_columns = () => {
  return transformI18nVxeTable(
    [
      {
        title: '工单号',
        dataIndex: 'workOrderNo',
        width: 120,
        // ellipsis: true,
      },
      {
        title: '是否打印',
        dataIndex: 'isPrint',
        i18nField: 'CommonCol.isPrint',
        width: 70,
      },
      {
        title: '版本号',
        dataIndex: 'bomVersion',
        width: 60,
        // ellipsis: true,
        i18nField: 'CommonCol.version',
      },
      {
        title: '零件编号',
        dataIndex: 'partNo',
        width: 80,
        // ellipsis: true,
      },
      {
        title: '零件名称',
        dataIndex: 'partName',
        width: 100,
        // ellipsis: true,
      },
      {
        title: '类别',
        dataIndex: 'category',
        width: 60,
        // ellipsis: true,
        i18nField: 'CommonCol.category',
      },
      {
        title: '零件规格',
        width: 160,
        // ellipsis: true,
        dataIndex: 'specification',
        i18nField: 'CommonCol.specification',
      },
      {
        title: '材质',
        dataIndex: 'material',
        width: 100,
        // ellipsis: true,
        i18nField: 'CommonCol.materialQuality',
      },
      {
        title: '是否委外',
        dataIndex: 'isOutsource',
        width: 80,
        // ellipsis: true,
        i18nField: 'CommonCol.isOutsource',
      },
      {
        title: '是否提供原材料',
        dataIndex: 'isProvideMaterials',
        width: 120,
        // ellipsis: true,
        i18nField: 'CommonCol.isProvideMaterials',
      },
      {
        title: '零件数量',
        dataIndex: 'quantity',
        i18nField: 'partQuantity',
        width: 70,
        // ellipsis: true,
      },
      // { title: '零件加工图纸', dataIndex: 'partDrawFile' },
      {
        title: '零件工艺路线',
        dataIndex: 'routeMap',
        i18nField: 'CommonCol.routeMap',
        // width: 120
      },
      {
        title: '下发人',
        dataIndex: 'issueUserName',
        width: 100,
        // ellipsis: true,
        i18nField: 'CommonCol.issueUserName',
      },
      {
        title: '下发时间',
        dataIndex: 'issueTime',
        // format: 'date|YYYY-MM-DD hh:mm:ss',
        width: 100,
        // ellipsis: true,
        i18nField: 'CommonCol.issueTime',
      },
      { title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 60 },
    ].map(item => ({
      ...item,
      field: item.dataIndex,
    })),
    'MoldApplyColumn',
  );
};

// export const sub_columns =
//   [
//     { title: '工单号', field: 'workOrderNo' },
//     {
//       title: '版本号',
//       field: 'bomVersion',
//       i18nField: 'CommonCol.version',
//     },
//     { title: '零件编号', field: 'partNo' },
//     { title: '零件名称', field: 'partName' },
//     {
//       title: '类别',
//       field: 'category',
//       width: 80,
//       i18nField: 'CommonCol.category',
//     },
//     {
//       title: '零件规格',
//       field: 'specification',
//       i18nField: 'CommonCol.specification',
//     },
//     {
//       title: '材质',
//       field: 'material',
//       i18nField: 'CommonCol.materialQuality',
//     },
//     {
//       title: '是否委外',
//       field: 'isOutsource',
//       slots: { default: 'isOutsource' },
//       i18nField: 'CommonCol.isOutsource',
//     },
//     {
//       title: '是否提供原材料',
//       field: 'isProvideMaterials',
//       slots: { default: 'isProvideMaterials' },
//       i18nField: 'CommonCol.isProvideMaterials',
//     },
//     {
//       title: '零件数量',
//       field: 'quantity',
//       i18nField: 'partQuantity',
//     },
//     {
//       title: '零件工艺路线',
//       field: 'routeMap',
//       i18nField: 'CommonCol.routeMap',
//     },
//     {
//       title: '操作',
//       field: 'action',
//       slots: { default: 'action' },
//       fixed: 'right',
//       width: 60
//     },
//   ];

export const baseFrorm = [
  {
    field: 'factoryMoldNo',
    label: '厂内模号',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'factoryAreaName',
    label: '厂区',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.factoryArea',
  },
  {
    field: 't0DeliveryDate',
    label: 'T0交期',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  // {
  //   field: 'drawing3dName',
  //   label: '3D组立图',
  //   component: 'Input',
  //   componentProps: { placeholder: '请输入', disabled: true },
  // },
  // {
  //   field: 'drawing2dName',
  //   label: '2D图纸',
  //   component: 'Input',
  //   componentProps: { placeholder: '请输入', disabled: true },
  // },
  // {
  //   field: 'drawingSpecialName',
  //   label: '特殊做法文件',
  //   component: 'Input',
  //   componentProps: { placeholder: '请输入', disabled: true },
  // },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.remark',
  },
  {
    field: 'creatorUserName',
    label: '创建人',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.creatorUserName',
  },
];

export const partColumn = [
  {
    title: '版本号',
    sortable: true,
    field: 'bomVersion',
    i18nField: 'CommonCol.version',
  },
  {
    title: '零件编号',
    field: 'partNo',
  },
  {
    title: '零件名称',
    field: 'partName',
  },
  {
    title: '零件数量',
    field: 'quantity',
    i18nField: 'partQuantity',
    width: 100,
  },
  {
    title: '零件工艺路线',
    field: 'routeMap',
    width: 460,
    i18nField: 'CommonCol.routeMap',
  },
  {
    title: '上传人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.uploadUserName',
  },
  {
    title: '上传时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD hh:mm:ss',
    },
    i18nField: 'CommonCol.uploadTime',
  },
];

export const NGColumn = [
  {
    title: '工序',
    field: 'processName',
    i18nField: 'CommonCol.process',
  },
  {
    title: '预设时间',
    field: 'presetDuration',
    i18nField: 'CommonCol.presetDuration',
  },
  {
    title: '备注信息',
    field: 'remark',
    width: '800',
    i18nField: 'CommonCol.remark',
  },
  // {
  //   title: 'NG路线',
  //   field: 'ngRouteMap',
  //   width: '400',
  //   i18nField: 'CommonCol.NGRouteDecision',
  // },
];

export const partbindrouteSchema = [
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具编号',
      allowClear: true,
    },
  },
  {
    fieldName: 'partNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '零件编号',
      allowClear: true,
    },
  },
  {
    fieldName: 'partName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '零件名称',
      allowClear: true,
    },
  },
  {
    fieldName: 'factoryMoldNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入厂内模号',
    },
    i18nField: t('CommonCol.factoryMoldNo'),
  },
];

export const partbindrouteColumn = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: t('dict.CommonCol.seq'),
    type: 'seq',
    field: 'index',
    width: 50,
    i18nField: 'number',
  },
  {
    title: '工单号',
    field: 'workOrderNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '模具编号',
    field: 'moldNo',
    width: 160,
  },
  {
    title: '版本号',
    i18nField: 'bomVersion',
    field: 'version',
    width: 100,
  },
  {
    title: '零件编号',
    field: 'partNo',
    width: 100,
  },
  {
    title: '零件名称',
    field: 'partName',
    width: 120,
  },
  {
    title: '厂内模号',
    field: 'factoryMoldNo',
    width: 160,
  },
  {
    title: '工艺路线',
    field: 'routeMap',
    width: 300,
    i18nField: 'CommonCol.processRoute',
  },
  {
    title: '加工要求',
    field: 'processRequired',
    width: 300,
    i18nField: 'CommonCol.processRequirements',
  },
];
