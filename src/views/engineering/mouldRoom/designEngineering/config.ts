import { BasicColumn, FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';
import { transformI18nVxeTable } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
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

export const URGENTLEVEL_OPTIONS = [
  // 1-一般 2-紧急 3-特急
  { id: 1, theme: 'blue', color: '#1890FF', fullName: t('dict.urgentLevel.1'), rowKey: 'statusName' },
  { id: 2, theme: 'yellow', color: '#FAAD14', fullName: t('dict.urgentLevel.2'), rowKey: 'statusName' },
  { id: 3, theme: 'red', color: '#FF4D4F', fullName: t('dict.urgentLevel.3'), rowKey: 'statusName' },
];

export const schemas = [
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
    defaultValue: '',
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

export const sub_columns = () => {
  return transformI18nVxeTable(
    [
      { title: '工单号', dataIndex: 'workOrderNo', width: '140px' },
      {
        title: '版本号',
        dataIndex: 'bomVersion',
        i18nField: 'CommonCol.version',
      },
      { title: '零件编号', dataIndex: 'partNo' },
      { title: '零件名称', dataIndex: 'partName' },
      {
        title: '类型',
        dataIndex: 'category',
        width: 80,
        i18nField: 'CommonCol.category',
      },
      {
        title: '零件规格',
        dataIndex: 'specification',
        i18nField: 'CommonCol.specification',
      },
      {
        title: '材质',
        dataIndex: 'material',
        i18nField: 'CommonCol.materialQuality',
      },

      {
        title: '是否委外',
        dataIndex: 'isOutsource',
        i18nField: 'CommonCol.isOutsource',
      },
      {
        title: '是否提供原材料',
        dataIndex: 'isProvideMaterials',
        i18nField: 'CommonCol.isProvideMaterials',
      },
      {
        title: '终止状态',
        dataIndex: 'stopStatus',
        width: 100,
        i18nField: 'CommonCol.terminationStatus',
        cellRender: {
          name: 'Tag',
          options: [
            { id: 0, fullName: t('dict.stopStatus.0'), theme: 'green', rowKey: 'statusDesc' },
            { id: 1, fullName: t('dict.stopStatus.1'), theme: 'yellow', rowKey: 'statusDesc' },
            { id: 2, fullName: t('dict.stopStatus.2'), theme: 'red', rowKey: 'statusDesc' },
          ],
        },
      },
      {
        title: '零件数量',
        dataIndex: 'quantity',
        i18nField: 'partQuantity',
      },
      // { title: '零件形状', dataIndex: 'partShape' },
      {
        title: '是否加工',
        dataIndex: 'isNeedProcessName',
      },
      {
        title: '下发人',
        dataIndex: 'issueUserName',
        i18nField: 'CommonCol.issueUserName',
      },
      {
        title: '下发时间',
        dataIndex: 'issueTime',
        // format: 'date|YYYY-MM-DD hh:mm:ss',
        i18nField: 'CommonCol.issueTime',
      },
      { title: '操作', dataIndex: 'action', width: 60 },
    ].map(item => ({
      ...item,
      field: item.dataIndex,
    })),
    'MoldApplyColumn',
  );
};

export const newMoldColumns = searchKey => {
  return [
    {
      title: '模具类型',
      dataIndex: 'moldTypeName',
      width: 120,
    },
    { title: '厂内模号', dataIndex: 'factoryMoldNo' },
    { title: '模具编号', dataIndex: 'moldNo' },
    { title: '工单号', dataIndex: 'workOrderNo' },
    {
      title: '制作状态',
      dataIndex: 'bomMakeStatus',
      format: 'tag|' + JSON.stringify(BOMMAKE_STATUS_OPTIONS),
    },
    // {
    //   title: '下发状态',
    //   dataIndex: 'designIssueStatus',
    //   format: 'tag|' + JSON.stringify(ISSUE_STATUS_OPTIONS),
    // },
    { title: '项目名称', dataIndex: 'projectName' },
    { title: '产品名称', dataIndex: 'productName' },
    { title: '版本', dataIndex: 'version' },
    { title: 'T0交期', dataIndex: 't0DeliveryDate', format: 'date|YYYY-MM-DD' },
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
      title: '客户图纸',
      dataIndex: 'customerDrawAttaFile',
      i18nField: 'CommonCol.customerDraw',
    },
    {
      title: '厂区',
      dataIndex: 'factoryAreaName',
      i18nField: 'CommonCol.factoryArea',
    },
    {
      title: '特殊做法文件',
      dataIndex: 'drawingSpecialFile',
      i18nField: 'CommonCol.drawingSpecial',
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

export const repairMoldColumns = searchKey => {
  return [
    { title: '模具编号', dataIndex: 'moldNo' },
    {
      title: '旧模具编号',
      dataIndex: 'oldMoldNo',
      i18nField: 'CommonCol.oldMoldNo',
    },
    {
      title: '制作状态',
      dataIndex: 'bomMakeStatus',
      format: 'tag|' + JSON.stringify(BOMMAKE_STATUS_OPTIONS),
    },
    { title: '项目名称', dataIndex: 'projectName' },
    { title: '产品名称', dataIndex: 'productName' },
    { title: '版本', dataIndex: 'version' },
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
      title: 'PD负责人',
      dataIndex: 'pdUserName',
      i18nField: 'CommonCol.pdUserName',
    },
    {
      title: '完成时间',
      dataIndex: 'successTime',
      format: 'date|YYYY-MM-DD hh:mm:ss',
      i18nField: 'CommonCol.successTime',
    },
    {
      title: '紧急程度',
      dataIndex: 'urgentLevel',
      format: 'tag|' + JSON.stringify(URGENTLEVEL_OPTIONS),
      i18nField: 'urgentLevelName',
    },
    {
      title: '附件',
      dataIndex: 'attachmentFile',
      i18nField: 'CommonCol.file',
    },
    {
      title: 'DFM文件',
      dataIndex: 'dfmAttaFile',
      i18nField: 'CommonCol.DFMFile',
    },
    {
      title: '特殊做法文件',
      dataIndex: 'drawingSpecialFile',
      i18nField: 'CommonCol.drawingSpecial',
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

export const newFormSchemas = [
  {
    field: 'factoryMoldNo',
    label: '厂内模号',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
  },
  {
    field: 'moldNo',
    label: '模具编号',
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

export const repairFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
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
    field: 'pdUserName',
    label: 'PD负责人',
    component: 'Input',
    componentProps: { placeholder: '请输入', disabled: true },
    i18nField: 'CommonCol.pdUserName',
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
];

export const BASIC_SEARCH_FORM_SCHEMA: FormSchema[] = [
  {
    field: 'poNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具需求单号',
    },
    colProps: { span: 4 },
  },
  {
    field: 'moldNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具编号',
    },
    colProps: { span: 4 },
  },
  {
    field: 'pickerVal',
    label: '',
    labelWidth: 100,
    component: 'DateRange',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
    colProps: { span: 4 },
  },
  {
    field: 'status',
    i18nField: 'statusName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.Status'),
      placeholder: '状态',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 3 },
  },
  {
    field: 'factory',
    i18nField: 'factoryName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      placeholder: '工厂',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    colProps: { span: 3 },
  },
];

export const SEARCH_FORM_SCHEMA: FormSchema[] = [...BASIC_SEARCH_FORM_SCHEMA];

export const COLUMNS: BasicColumn[] = [
  { title: '模具需求单号', dataIndex: 'poNo' },
  { title: '模具图纸', dataIndex: 'moldDrawingsName' },
  // { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 260 },
  { title: '工厂', dataIndex: 'factoryName' },
  { title: '创建人', dataIndex: 'creatorUser' },
  { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD hh:mm:ss' },
];

export const SUB_COLUMNS: BasicColumn[] = transformI18nVxeTable(
  [
    { title: '模具编号', dataIndex: 'moldNo' },
    { title: '收货厂址', dataIndex: 'deliveryAddress' },
    { title: '供应商', dataIndex: 'supplier' },
    { title: '状态', dataIndex: 'statusName', width: 80 },
    { title: '当前处理人', dataIndex: 'currentProcessorName' },
    { title: '当前节点', dataIndex: 'currentNodeName' },
    { title: '节点记录', dataIndex: 'opera' },
    { title: '模具类型', dataIndex: 'moldTypeName' },
    { title: '产品类型', dataIndex: 'productTypeName' },
    { title: '客户要求交期', dataIndex: 'requireDeliveryTime', format: 'date|YYYY-MM-DD' },
    { title: '备注', dataIndex: 'moldRemark' },
  ].map(item => ({
    ...item,
    field: item.dataIndex,
  })),
  'MouldRoomSubColumn',
);
