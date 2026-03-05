import { BasicColumn } from '/@/components/Table';
import { transformI18nVxeTable } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const BOMMAKE_STATUS_OPTIONS = [
  // 0-未制作 1-已制作
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.bomMakeStatus.0'), rowKey: 'statusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: t('dict.bomMakeStatus.1'), rowKey: 'statusName' },
];
export const ISSUE_STATUS_OPTIONS = [
  // 0-未下发 1-已下发
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.newMoldStatus.1'), rowKey: 'statusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: t('dict.newMoldStatus.2'), rowKey: 'statusName' },
];

export const columns = searchKey => {
  return [
    {
      title: '模具类型',
      dataIndex: 'moldTypeName',
      width: 120,
    },
    { title: '厂内模号', dataIndex: 'factoryMoldNo' },
    { title: '工单号', dataIndex: 'workOrderNo' },
    { title: '版本号', dataIndex: 'bomVersion' },
    {
      title: '是否电极',
      dataIndex: 'isElectrode',
      i18nField: 'CommonCol.factoryArea',
      width: 100,
    },

    {
      title: '制作状态',
      dataIndex: 'electrodeBomStatus',
      format: 'tag|' + JSON.stringify(BOMMAKE_STATUS_OPTIONS),
    },
    { title: '模具编号', dataIndex: 'moldNo' },
    {
      title: '钢料程式',
      dataIndex: 'programAtta',
      width: 120,
    },
    {
      title: '放电图纸',
      dataIndex: 'dischargeDraw',
      width: 120,
      i18nField: 'CommonCol.dischargeDrawing',
    },
    { title: '零件编号', dataIndex: 'partNo' },
    {
      title: '零件名称',
      dataIndex: 'partName',
      i18nField: 'CommonCol.processingFile',
    },
    {
      title: '类型',
      dataIndex: 'category',
      i18nField: 'CommonCol.customerDraw',
    },
    {
      title: '零件规格',
      dataIndex: 'specification',
    },
    {
      title: '材质',
      dataIndex: 'material',
    },
    {
      title: '零件数量',
      dataIndex: 'quantity',
    },
    {
      title: '特殊做法文件',
      dataIndex: 'drawingSpecialFile',
      i18nField: 'CommonCol.drawingSpecial',
    },
    // {
    //   title: '零件形状',
    //   dataIndex: 'partShape',
    // },
    {
      title: '是否加工',
      dataIndex: 'isNeedProcessName',
    },
    {
      title: '零件工艺路线',
      dataIndex: 'routeMap',
      i18nField: 'CommonCol.routeMap',
      width: 260,
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

export const schemas = [
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
  {
    field: 'pickerVal',
    label: '',
    component: 'DateRange',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
    colProps: { span: 4 },
  },
  {
    field: 'material',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '材质',
    },
    colProps: { span: 4 },
  },
  {
    field: 'bomVersion',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '版本号',
    },
    colProps: { span: 4 },
  },
];

export const sub_columns = () => {
  return transformI18nVxeTable(
    [
      { title: '电极单号', dataIndex: 'workOrderNo', width: 120 },
      {
        title: '电极名称',
        dataIndex: 'electrodeName',
        width: 100,
        i18nField: 'CommonCol.version',
      },
      {
        title: '电极材质',
        dataIndex: 'electrodeMaterial',
        width: 80,
      },
      {
        title: '总数量',
        dataIndex: 'quantity',
        width: 70,
      },
      {
        title: '电极程式',
        dataIndex: 'programAtta',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        i18nField: 'CommonCol.category',
      },
      {
        title: '下料尺寸',
        dataIndex: 'cuttingSize',
        i18nField: 'CommonCol.specification',
        width: 80,
      },
      {
        title: '是否委外',
        dataIndex: 'isOutsource',
        width: 80,
        i18nField: 'CommonCol.materialQuality',
      },
      {
        title: '电极工艺路线',
        dataIndex: 'routeMap',
        i18nField: 'CommonCol.isOutsource',
      },
      {
        title: '下发人',
        dataIndex: 'issueUserName',
        i18nField: 'CommonCol.issueUserName',
        width: 100,
      },
      {
        title: '下发时间',
        dataIndex: 'issueTime',
        // format: 'date|YYYY-MM-DD hh:mm:ss',
        i18nField: 'CommonCol.issueTime',
        width: 100,
      },
      { title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 60 },
    ].map(item => ({
      ...item,
      field: item.dataIndex,
    })),
    'MoldApplyColumn',
  );
};

export const baseFrorm = [
  {
    field: 'bomVersion',
    label: '版本',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'partNo',
    label: '零件编号',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'partName',
    label: '零件名称',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'quantity',
    label: '零件数量',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.factoryArea',
  },
  {
    field: 'category',
    label: '类别',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'material',
    label: '材质',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
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
  {
    field: 'routeMap',
    label: '零件工艺路线',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.routeMap',
  },
];

export const electrodebomColumn = [
  {
    field: 'seq',
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '电极名称',
    sortable: true,
    field: 'electrodeName',
    i18nField: 'CommonCol.version',
  },
  {
    title: '下料尺寸',
    field: 'cuttingSize',
  },
  {
    title: '净尺寸',
    field: 'netSize',
  },
  {
    title: '材质',
    field: 'material',
    i18nField: 'partQuantity',
    width: 100,
  },
  {
    title: '总数量',
    field: 'quantity',
    width: 100,
    i18nField: 'CommonCol.totalNumber',
  },
  {
    title: '精',
    field: 'fine',
  },
  {
    title: '中',
    field: 'medium',
  },
  {
    title: '粗',
    field: 'rough',
    width: 100,
  },
  {
    title: '重量(kg)',
    field: 'weight',
    i18nField: 'CommonCol.weight',
    width: 100,
  },
  {
    title: '备注',
    field: 'remark',
    width: 100,
  },
  {
    title: '电极工艺路线',
    field: 'routeMap',
    i18nField: 'CommonCol.electrodeRoute',
    width: 460,
  },
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
];

export const partbindrouteColumn = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: t('dict.CommonCol.seq'),
    type: 'seq',
    field: 'index',
    width: 50,
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
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '零件编号',
    field: 'partNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '零件名称',
    field: 'partName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '电极名称',
    field: 'electrodeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
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
