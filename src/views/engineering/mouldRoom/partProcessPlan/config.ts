import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { transformI18nVxeTable } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import ProcessDom from './components/ProcessDom.vue';

const baseStore = useBaseStore();
const { t } = useI18n();

export const BOMMAKE_STATUS_OPTIONS = [
  // 0-未做计划 1-已做计划
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.planMakeStatus.0'), rowKey: 'statusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: t('dict.planMakeStatus.1'), rowKey: 'statusName' },
];

export const STATUS_OPTIONS = [
  // 0-未制作 1-已制作
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.planProgress.0'), rowKey: 'statusName' },
  { id: 1, theme: 'blue', color: '#1890FF', fullName: t('dict.planProgress.1'), rowKey: 'statusName' },
  { id: 2, theme: 'green', color: '#52C41A', fullName: t('dict.planProgress.2'), rowKey: 'statusName' },
];

export const ISSUE_STATUS_OPTIONS = [
  // 0-未下发 1-已下发
  { id: 0, theme: 'gray', color: '#999999', fullName: t('dict.issueStatus.0'), rowKey: 'statusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: t('dict.issueStatus.1'), rowKey: 'statusName' },
];

export const STOP_STATUS_OPTIONS = [
  { id: 0, theme: 'green', color: '#52C41A', fullName: t('dict.stopStatus.0'), rowKey: 'statusName' },
  { id: 1, theme: 'yellow', color: '#FAAD14', fullName: t('dict.stopStatus.1'), rowKey: 'statusName' },
  { id: 2, theme: 'red', color: '#FF4D4F', fullName: t('dict.stopStatus.2'), rowKey: 'statusName' },
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
    field: 'category',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '类型',
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

export const sub_columns: BasicColumn[] = transformI18nVxeTable(
  [
    {
      title: '电极单号',
      dataIndex: 'workOrderNo',
      // minWidth: 120,
      width: 80,
      // ellipsis: true,
      i18nField: 'CommonCol.electrodeNumber',
    },
    {
      title: '电极名称',
      dataIndex: 'electrodeName',
      width: 100,
    },
    {
      title: '生产进度',
      dataIndex: 'status',
      width: 90,
      i18nField: 'CommonCol.productSchedule',
    },
    {
      title: '制作状态',
      dataIndex: 'planStatus',
      i18nField: 'CommonCol.productionStatus',
      width: 100,
    },
    {
      title: '电极材质',
      dataIndex: 'electrodeMaterial',
      width: 50,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 50,
      i18nField: 'CommonCol.Quantity',
    },
    {
      title: '下料尺寸',
      dataIndex: 'cuttingSize',
      width: 60,
    },
    {
      title: '是否委外',
      dataIndex: 'isOutsource',
      i18nField: 'CommonCol.isOutsource',
      width: 50,
    },
    {
      title: '下发状态',
      dataIndex: 'issueStatus',
      i18nField: 'CommonCol.issueStatus',
      width: 90,
    },
    {
      title: '下发人',
      dataIndex: 'issueUserName',
      i18nField: 'CommonCol.issueUserName',
      width: 80,
      ellipsis: true,
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      i18nField: 'CommonCol.issueTime',
      width: 100,
      // ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      i18nField: 'CommonCol.remark',
    },
    {
      title: '电极工艺路线',
      dataIndex: 'routeMap',
      width: 100,
      i18nField: 'CommonCol.electrodeRoute',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
    },
  ].map(item => ({
    ...item,
    field: item.dataIndex,
  })),
  'MoldPartPlanColumn',
);

export const columns = [
  {
    title: '模具类型',
    dataIndex: 'moldTypeName',
    width: 120,
  },
  { title: '厂内模号', dataIndex: 'factoryMoldNo' },
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '工单号', dataIndex: 'workOrderNo' },
  {
    title: '零件编号',
    dataIndex: 'partNo',
  },
  {
    title: '是否委外',
    dataIndex: 'isOutsource',
    i18nField: 'CommonCol.isOutsource',
  },
  {
    title: '生产进度',
    dataIndex: 'status',
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    i18nField: 'CommonCol.productSchedule',
  },
  // {
  //   title: '制作状态',
  //   dataIndex: 'planStatus',
  //   format: 'tag|' + JSON.stringify(BOMMAKE_STATUS_OPTIONS),
  //   i18nField: 'CommonCol.productionStatus',
  // },
  // {
  //   title: '下发状态',
  //   dataIndex: 'issueStatus',
  //   format: 'tag|' + JSON.stringify(ISSUE_STATUS_OPTIONS),
  //   i18nField: 'CommonCol.issueStatus',
  // },
  {
    title: '零件名称',
    dataIndex: 'partName',
  },
  { title: '版本号', dataIndex: 'bomVersion' },
  { title: '类型', dataIndex: 'category' },
  { title: '零件规格', dataIndex: 'specification' },
  {
    title: '零件数量',
    dataIndex: 'quantity',
    i18nField: 'CommonCol.partsNumber',
  },
  {
    title: '零件加工图纸',
    dataIndex: 'processDemandAtta',
    i18nField: 'CommonCol.partProcessDrawings',
  },
  {
    title: '特殊做法文件',
    dataIndex: 'drawingSpecialFile',
    i18nField: 'CommonCol.drawingSpecial',
  },
  {
    title: '零件工艺路线',
    dataIndex: 'routeMap',
    i18nField: 'CommonCol.routeMap',
  },
  // {
  //   title: '下发人',
  //   dataIndex: 'issueUserName',
  //   i18nField: 'CommonCol.issueUserName',
  // },
  // {
  //   title: '下发时间',
  //   dataIndex: 'issueTime',
  //   format: 'date|YYYY-MM-DD hh:mm:ss',
  //   i18nField: 'CommonCol.issueTime',
  // },
  {
    title: '申请人',
    dataIndex: 'creatorUserName',
    i18nField: 'CommonCol.applyUserId',
  },
  {
    title: '申请时间',
    dataIndex: 'creatorTime',
    format: 'date|YYYY-MM-DD hh:mm:ss',
    i18nField: 'CommonCol.applyTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    i18nField: 'CommonCol.remark',
  },
];

export const partSubColumns = transformI18nVxeTable(
  [
    // { title: '厂内模号', dataIndex: 'factoryMoldNo' },
    // { title: '模具编号', dataIndex: 'moldNo' },
    { title: '工单号', dataIndex: 'workOrderNo', width: 80 },
    {
      title: '零件编号',
      dataIndex: 'partNo',
      width: 60,
    },
    {
      title: '是否委外',
      dataIndex: 'isOutsource',
      i18nField: 'CommonCol.isOutsource',
      width: 50,
    },
    {
      title: '生产进度',
      dataIndex: 'status',
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      i18nField: 'CommonCol.productSchedule',
      width: 90,
    },
    {
      title: '制作状态',
      dataIndex: 'planStatus',
      format: 'tag|' + JSON.stringify(BOMMAKE_STATUS_OPTIONS),
      i18nField: 'CommonCol.productionStatus',
      width: 100,
    },
    {
      title: '下发状态',
      dataIndex: 'issueStatus',
      format: 'tag|' + JSON.stringify(ISSUE_STATUS_OPTIONS),
      i18nField: 'CommonCol.issueStatus',
      width: 90,
    },
    {
      title: '终止状态',
      dataIndex: 'stopStatus',
      format: 'tag|' + JSON.stringify(STOP_STATUS_OPTIONS),
      i18nField: 'CommonCol.terminationStatus',
      width: 90,
    },
    {
      title: '零件名称',
      dataIndex: 'partName',
      width: 70,
    },
    {
      title: '版本号',
      dataIndex: 'bomVersion',
      width: 60,
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 60,
    },
    {
      title: '零件规格',
      dataIndex: 'specification',
      width: 100,
    },
    {
      title: '零件数量',
      dataIndex: 'quantity',
      i18nField: 'CommonCol.partsNumber',
      width: 60,
    },
    // {
    //   title: '零件加工图纸',
    //   dataIndex: 'processDemandAtta',
    //   i18nField: 'CommonCol.partProcessDrawings',
    // },
    // {
    //   title: '特殊做法文件',
    //   dataIndex: 'drawingSpecialFile',
    //   i18nField: 'CommonCol.drawingSpecial',
    // },
    {
      title: '零件工艺路线',
      dataIndex: 'routeMap',
      i18nField: 'CommonCol.routeMap',
    },
    {
      title: '下发人',
      dataIndex: 'issueUserName',
      i18nField: 'CommonCol.issueUserName',
      width: 80,
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      i18nField: 'CommonCol.issueTime',
      width: 100,
    },
    // {
    //   title: '申请人',
    //   dataIndex: 'creatorUserName',
    //   i18nField: 'CommonCol.applyUserId',
    // },
    // {
    //   title: '申请时间',
    //   dataIndex: 'creatorTime',
    //   format: 'date|YYYY-MM-DD hh:mm:ss',
    //   i18nField: 'CommonCol.applyTime',
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      i18nField: 'CommonCol.remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'right',
    },
  ].map(item => ({
    ...item,
    field: item.dataIndex,
  })),
  'MoldApplyColumn',
);

function renderIsSyncTableCell(row: any) {
  return h(ProcessDom, { row });
}

export const importColumns = [
  {
    title: '厂内模号',
    dataIndex: 'factoryMoldNo',
    minWidth: 200,
  },
  {
    title: '零件编号',
    dataIndex: 'partNo',
    minWidth: 200,
  },
  {
    title: '加工数量',
    dataIndex: 'quantity',
    minWidth: 120,
  },
  {
    title: '类型',
    dataIndex: 'category',
    minWidth: 120,
  },
  {
    title: '版本',
    dataIndex: 'bomVersion',
    minWidth: 120,
  },
  {
    title: '备注',
    dataIndex: 'planRemark',
    minWidth: 260,
  },
  {
    title: '加工工序内容',
    dataIndex: 'processDom',
    visible: true,
    showOverflow: false,
    resizable: true,
    width: 'auto',
    minWidth: 200,
    slots: {
      default: ({ row }) => renderIsSyncTableCell(row),
    },
  },
];

export const partColumns = [
  {
    title: '模具类型',
    dataIndex: 'moldTypeName',
    width: 120,
  },
  { title: '厂内模号', dataIndex: 'factoryMoldNo' },
  { title: '模具编号', dataIndex: 'moldNo' },
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
    title: '备注',
    dataIndex: 'remark',
    i18nField: 'CommonCol.remark',
  },
];

export const parentFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'workOrderNo',
    label: '工单号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'partNo',
    label: '零件编号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'quantity',
    label: '加工数量',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'routeMap',
    label: '工艺路线',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'planRemark',
    label: '备注',
    component: 'Input',
  },
  {
    field: 'creatorUserName',
    label: '创建人',
    component: 'Input',
    componentProps: { disabled: true },
    i18nField: 'CommonCol.creatorUserName',
  },
];

export const childrenFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'workOrderNo',
    label: '订单号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'partNo',
    label: '零件编号',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'electrodeName',
    label: '电极名称',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'quantity',
    label: '加工数量',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'routeMap',
    label: '工艺路线',
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    field: 'planRemark',
    label: '备注',
    component: 'Input',
  },
  {
    field: 'creatorUserName',
    label: '创建人',
    component: 'Input',
    componentProps: { disabled: true },
    i18nField: 'CommonCol.creatorUserName',
  },
];

export const PlanPartColumn: any[] = [
  {
    title: '计划开工时间',
    field: 'planStartTime',
    minWidth: 160,
    // editRender: {
    //   name: 'DatePicker',
    //   props: {
    //     valueFormat: 'YYYY-MM-DD',
    //   },
    // },
    slots: {
      default: 'PlanStartTime',
    },
  },
  {
    title: '工序名称',
    field: 'processName',
    minWidth: 120,
    // editRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '状态',
    field: 'status',
    minWidth: 120,
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('planProgress'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        apiSearch: {
          show: false,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.planProgress.0'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.planProgress.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.planProgress.2'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '计划完工时间',
    field: 'planEndTime',
    minWidth: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.planCompleteTime',
  },
  {
    title: `${t('dict.MoldPartPlanColumn.presetDuration')}(${t('common.automaticCalculationText')})`,
    field: 'presetDuration',
    minWidth: 120,
  },
  {
    title: `${t('dict.MoldPartPlanColumn.actualDuration')}(${t('common.automaticCalculationText')})`,
    field: 'actualDuration',
    minWidth: 120,
  },
  {
    title: `${t('dict.MoldPartPlanColumn.waitReceiveDuration')}(${t('common.automaticCalculationText')})`,
    field: 'waitReceiveDuration',
    minWidth: 130,
  },
  {
    title: `${t('dict.MoldPartPlanColumn.actualCompletionTime')}(${t('common.automaticCalculationText')})`,
    field: 'actualCompletionTime',
    minWidth: 120,
  },
];
