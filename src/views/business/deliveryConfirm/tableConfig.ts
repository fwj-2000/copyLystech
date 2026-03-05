import { BasicColumn } from '/@/components/Table';
import { formatTableDefaultText } from '/@/utils';
import { STATUS_OPTIONS, PRODUCTION_LIST } from '/@/components/CustomComponents/src/quality/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const IS_SATISFY_LIST = [
  { id: 1, fullName: t('dict.OpinionTypeEnum.Satisfy'), value: 1, label: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: 0, fullName: t('dict.OpinionTypeEnum.Discontent'), value: 2, label: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

export const statusOptions = [
  { id: '0', fullName: t('status.applyStatus.waiting'), color: '#FF7B00' },
  { id: '1', fullName: t('status.applyStatus.not'), color: '#B2B2B2' },
  { id: '2', fullName: t('status.applyStatus.applied'), color: '#52C41A' },
];

export const columns: BasicColumn[] = [
  { title: t('views.productionPlan.applyNo'), dataIndex: 'applyNo', sorter: true, width: 150 },
  { title: '需求类型', dataIndex: 'demandType', width: 150, i18nField: 'CommonCol.demandType' },
  { title: t('views.productionPlan.insidePartNumber'), dataIndex: 'innerMaterialNumber', sorter: true, width: 180 },
  {
    title: '客户要求交期',
    dataIndex: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    width: 120,
    format: 'date|YYYY-MM-DD',
  },
  {
    title: '首批交期',
    dataIndex: 'firstBatchTime',
    i18nField: 'firstBatchDateTime',
    width: 120,
    format: 'date|YYYY-MM-DD',
  },
  {
    title: '是否满足',
    dataIndex: 'isSatisfy',
    width: 120,
    i18nField: 'isSatisfyDesc',
    format: 'tag|' + JSON.stringify(IS_SATISFY_LIST),
  },
  {
    title: '工厂',
    dataIndex: 'factory',
    width: 160,
  },
  {
    title: '终端客户料号',
    dataIndex: 'terminalCustomerPartNumber',
    width: 160,
  },
  {
    title: '直接客户料号',
    dataIndex: 'immediateCustomerPartNumber',
    width: 160,
  },
  {
    title: '状态',
    dataIndex: 'status',
    i18nField: 'CommonCol.status',
    width: 100,
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 160,
  },
  {
    title: '当前处理人',
    dataIndex: 'currentProcessor',
    i18nField: 'CommonCol.currentNodeUser',
    width: 220,
  },
  {
    title: '节点记录',
    dataIndex: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 120,
  },
  {
    title: '需求数量(PCS)',
    dataIndex: 'peakQty',
    width: 160,
  },
  {
    title: '生产类型',
    dataIndex: 'productionType',
    i18nField: 'productionTypeDesc',
    width: 120,
    format: text => {
      return PRODUCTION_LIST.find(el => el.id == text)?.fullName;
    },
  },
  {
    title: '产品描述',
    dataIndex: 'productDesc',
    width: 120,
  },
  // {
  //   title: 'PD',
  //   dataIndex: 'pdName',
  //   width: 180,
  // },
  {
    title: '终端项目阶段',
    dataIndex: 'projectPhase',
    width: 160,
  },
  // { title: t('views.productionPlan.demandQtyPC'), dataIndex: 'DemandQty', key: 'DemandQty', width: 140, sorter: true },
  // { title: t('views.productionPlan.estimatedProductionTime'), dataIndex: 'EstimatedProductionTime', key: 'EstimatedProductionTime', width: 130, sorter: true },
  // { title: t('views.productionPlan.peakQty'), dataIndex: 'PeakQty', key: 'PeakQty', width: 120, sorter: true },
  // { title: t('views.productionPlan.currentProcessor'), dataIndex: 'CurrentProcessor', key: 'CurrentProcessor', width: 180, sorter: true },
];

export const tabelConfig: any = {
  columns,
  useSearchForm: true,
  striped: true,
  ellipsis: true,
  rowSelection: { type: 'checkbox' },
  i18nConfig: {
    moduleCode: 'QuantitativeDeliveryConfirmColumn',
  },
  formConfig: {
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    labelAlign: 'left',
    labelWidth: 70,
    actionColOptions: {
      span: 12,
    },
    schemas: [
      {
        field: 'applyNo',
        component: 'Input',
        labelWidth: 100,
        componentProps: {
          placeholder: t('common.inputText') + t('views.productionPlan.applyNo'),
          maxlength: 50,
        },
      },
      {
        field: 'innerMaterialNumber',
        component: 'Input',
        componentProps: { placeholder: t('common.inputText') + t('views.productionPlan.insidePartNumber'), maxlength: 50 },
      },
      {
        field: 'currentProcessor',
        component: 'Input',
        labelWidth: 100,
        componentProps: { placeholder: t('common.inputText') + t('views.productionPlan.currentProcessor'), maxlength: 50 },
      },
      {
        field: 'applyTime',
        labelWidth: 100,
        component: 'DateRange',
        componentProps: {
          placeholder: [t('views.productionPlan.applyDate') + t('common.startTime'), t('views.productionPlan.applyDate') + t('common.endTime')],
        },
      },
      {
        field: 'confirmStatus',
        i18nField: 'CommonCol.status',
        component: 'Select',
        componentProps: {
          placeholder: t('common.chooseText') + t('views.productionPlan.status'),
          submitOnPressEnter: true,
          options: statusOptions,
        },
      },
    ],
    fieldMapToTime: [['applyTime', ['startTime', 'endTime']]],
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
      transferRange: ['placeholder'],
    },
  },
  actionColumn: {
    width: 80,
    title: t('common.action'),
    dataIndex: 'action',
  },
  isCanResizeParent: true,
  canResize: true,
  pagination: {
    pageSize: 100,
  },
  transformCellText: ({ text }) => formatTableDefaultText(text),
};
