import { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { productTypeOptions, getYesOrNoLabel, getProductTypeLabel, getStatusLabel } from '../utils';
import { useBaseStore } from '/@/store/modules/base';
// import dayjs from 'dayjs';

const { t } = useI18n();
const baseStore = useBaseStore();

const columnFilterDatePicker = {
  filters: [{ data: '', key: 'index' }],
  filterRender: { name: 'DatePicker', props: { valueFormat: 'YYYY-MM-DD' } },
};

/**
 * 需求类型枚举，取值于`DemandTypeEnum`字典
 * 因只取`量试需求(Quantitative)`、`商务样品需求(BusinessSamples)`、`工程样品需求(EngineeringSamples)`，所以直接使用枚举记录
 */
export enum DemandTypeEnum {
  量试需求 = 'Quantitative',
  商务样品需求 = 'BusinessSamples',
  工程样品需求 = 'EngineeringSamples',
}

/**
 * @description 需求类型枚举
 */
export const demandTypeOptions = [
  { label: t('dict.DemandTypeEnum.Quantitative'), value: DemandTypeEnum.量试需求 },
  { label: t('dict.DemandTypeEnum.BusinessSamples'), value: DemandTypeEnum.商务样品需求 },
  { label: t('dict.DemandTypeEnum.EngineeringSamples'), value: DemandTypeEnum.工程样品需求 },
];

/**
 * 处理状态筛选
 */
export const statusOptions = [
  { label: t('common.todoText'), value: 6 },
  { label: t('common.doneText'), value: 7 },
];

const columnFilterInput = () => ({
  filters: [{ data: '' }],
  filterRender: { name: 'Input' },
});

function createColumnFilterSelect(dictCode: string, options: Array<{ label: string; value: any }> = []) {
  return {
    filters: [{ data: '' }],
    filterRender: {
      name: dictCode ? 'ApiSelect' : 'ASelect',
      props: {
        api: () => baseStore.getDictionaryData(dictCode),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        options,
      },
    },
  };
}

/**
 * 样品组回复列
 */
const sampleDeliveryReplyColumns: VxeGridPropTypes.Columns = [
  // 样品组回复状态
  {
    title: t('dict.QuantitativeReportColumn.sampleDeliveryReplyStatus'),
    field: 'sampleDeliveryReplyStatus',
    width: 120,
    showOverflow: 'tooltip',
    formatter: ({ cellValue, row }) => getStatusLabel(row.sampleDeliveryReplyStatusEnum, cellValue),
  },
  // 样品组回复处理日期
  {
    title: t('dict.QuantitativeReportColumn.sampleDeliveryReplyDate'),
    field: 'sampleDeliveryReplyDate',
    width: 220,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue, row }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : row.sampleDeliveryReplyDateTime || ''),
    cellRender: {
      name: 'Date',
    },
  },
  // 样品组回复处理时长
  {
    title: t('dict.QuantitativeReportColumn.sampleDeliveryReplyHandlerDuration'),
    field: 'sampleDeliveryReplyHandlerDuration',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 样品组回复处理人
  {
    title: t('dict.QuantitativeReportColumn.sampleDeliveryReplyUserName'),
    field: 'sampleDeliveryReplyUserName',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 样品组详情
  {
    title: '样品组详情',
    field: 'sampleDeliveryReplyId',
    width: 120,
    showOverflow: 'tooltip',
    slots: { default: 'sampleDeliveryReplyId' },
  },
];

/**
 * 根据需求类型，使用不同的列配置
 */
export const vxeDynamicsColumns: Record<DemandTypeEnum, VxeGridPropTypes.Columns> = {
  [DemandTypeEnum.量试需求]: [
    // 量试订单评审状态
    {
      title: t('dict.QuantitativeReportColumn.quantitativeInformationStatus'),
      field: 'quantitativeInformationStatus',
      width: 220,
      showOverflow: 'tooltip',
      formatter: ({ cellValue, row }) => getStatusLabel(row.quantitativeInformationStatusEnum, cellValue),
    },
    // 量试订单评审处理日期
    {
      title: t('dict.QuantitativeReportColumn.quantitativeInformationDate'),
      field: 'quantitativeInformationDate',
      width: 220,
      showOverflow: 'tooltip',
      // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
      cellRender: {
        name: 'Date',
      },
    },
    // 量试订单评审处理时长
    {
      title: t('dict.QuantitativeReportColumn.quantitativeInformationHandlerDuration'),
      field: 'quantitativeInformationHandlerDuration',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 量试订单评审处理人
    {
      title: t('dict.QuantitativeReportColumn.quantitativeInformationUserName'),
      field: 'quantitativeInformationUserName',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 量试订单评审详情
    {
      title: '量试订单评审详情',
      field: 'quantitativeInformationId',
      width: 220,
      showOverflow: 'tooltip',
      slots: { default: 'quantitativeInformationId' },
    },
    // 主计划排产状态
    {
      title: t('dict.QuantitativeReportColumn.mainPlanStatus'),
      field: 'mainPlanStatus',
      width: 120,
      showOverflow: 'tooltip',
      formatter: ({ cellValue, row }) => getStatusLabel(row.mainPlanStatusEnum, cellValue),
    },
    // 主计划提交日期
    {
      title: '主计划提交日期',
      field: 'mainPlanApplyDate',
      width: 120,
      showOverflow: 'tooltip',
      // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
      cellRender: {
        name: 'Date',
      },
    },
    // 主计划处理时长
    {
      title: '主计划处理时长',
      field: 'mainPlanHandlerDuration',
      width: 120,
      showOverflow: 'tooltip',
    },
    // 主计划处理人
    {
      title: '主计划处理人',
      field: 'mainPlanUserName',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 主计划排产详情
    {
      title: '主计划排产详情',
      field: 'mainPlanId',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'mainPlanId' },
    },
    // 材料交期状态
    {
      title: t('dict.QuantitativeReportColumn.deliveryMcStatus'),
      field: 'deliveryMcStatus',
      width: 120,
      showOverflow: 'tooltip',
      formatter: ({ cellValue, row }) => getStatusLabel(row.deliveryMcStatusEnum, cellValue),
    },
    // 材料交期处理日期
    {
      title: t('dict.QuantitativeReportColumn.deliveryMcApplyDate'),
      field: 'deliveryMcApplyDate',
      width: 220,
      showOverflow: 'tooltip',
      // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
      cellRender: {
        name: 'Date',
      },
    },
    // 材料交期处理时长
    {
      title: t('dict.QuantitativeReportColumn.deliveryMcHandlerDuration'),
      field: 'deliveryMcHandlerDuration',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 材料交期处理人
    {
      title: t('dict.QuantitativeReportColumn.deliveryMcCurrentUserName'),
      field: 'deliveryMcCurrentUserName',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 材料交期详情
    {
      title: '材料交期详情',
      field: 'deliveryMcId',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'deliveryMcId' },
    },
    // 模切计划状态
    {
      title: t('dict.QuantitativeReportColumn.quantitativeDiecuttingPlanStatus'),
      field: 'quantitativeDiecuttingPlanStatus',
      width: 120,
      showOverflow: 'tooltip',
      formatter: ({ cellValue, row }) => getStatusLabel(row.quantitativeDiecuttingPlanStatusEnum, cellValue),
    },
    // 模切计划处理日期
    {
      title: t('dict.QuantitativeReportColumn.quantitativeDiecuttingPlanDate'),
      field: 'quantitativeDiecuttingPlanDate',
      width: 220,
      showOverflow: 'tooltip',
      // formatter: ({ cellValue, row }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : row.quantitativeDiecuttingPlanDateTime || ''),
      cellRender: {
        name: 'Date',
      },
    },
    // 模切计划处理时长
    {
      title: t('dict.QuantitativeReportColumn.quantitativeDiecuttingPlanHandlerDuration'),
      field: 'quantitativeDiecuttingPlanHandlerDuration',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 模切计划处理人
    {
      title: t('dict.QuantitativeReportColumn.quantitativeDiecuttingPlanUserName'),
      field: 'quantitativeDiecuttingPlanUserName',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 模切计划详情
    {
      title: '模切计划详情',
      field: 'quantitativeDiecuttingPlanId',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'quantitativeDiecuttingPlanId' },
    },
    // 交货计划状态
    {
      title: t('dict.QuantitativeReportColumn.deliveryPlanStatus'),
      field: 'deliveryPlanStatus',
      width: 120,
      showOverflow: 'tooltip',
      formatter: ({ cellValue, row }) => getStatusLabel(row.deliveryPlanStatusEnum, cellValue),
    },
    // 交货计划处理日期
    {
      title: t('dict.QuantitativeReportColumn.deliveryPlanApplyDate'),
      field: 'deliveryPlanApplyDate',
      width: 220,
      showOverflow: 'tooltip',
      // formatter: ({ cellValue, row }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : row.deliveryPlanApplyDateTime || ''),
      cellRender: {
        name: 'Date',
      },
    },
    // 交货计划处理时长
    {
      title: t('dict.QuantitativeReportColumn.deliveryPlanHandlerDuration'),
      field: 'deliveryPlanHandlerDuration',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 交货计划处理人
    {
      title: t('dict.QuantitativeReportColumn.deliveryPlanUserName'),
      field: 'deliveryPlanUserName',
      width: 220,
      showOverflow: 'tooltip',
    },
    // 交货计划详情
    {
      title: '交货计划详情',
      field: 'deliveryPlanId',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'deliveryPlanId' },
    },
  ],
  [DemandTypeEnum.工程样品需求]: sampleDeliveryReplyColumns,
  [DemandTypeEnum.商务样品需求]: sampleDeliveryReplyColumns,
};

export const columns: VxeGridPropTypes.Columns = [
  // {
  //   field: 'checkbox',
  //   type: 'checkbox',
  //   width: '50',
  //   align: 'center',
  // },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 单号
  {
    title: t('dict.SampleLabelPrintColumn.applyCode'),
    field: 'applyNo',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  {
    title: t('dict.CommonCol.status'),
    field: 'statusName', // status
    width: 100,
  },
  // 需求类型
  // {
  //   title: t('dict.SampleLabelPrintColumn.demandTypeName'),
  //   field: 'demandType',
  //   width: 120,
  //   showOverflow: 'tooltip',
  // },
  // 申请人
  {
    title: t('dict.SampleLabelPrintColumn.applyUserName'),
    field: 'applyUserName',
    width: 220,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 提交时间
  {
    title: t('dict.FillingBillCustomerTemplate.ApplyDate'),
    field: 'applyDate',
    width: 160,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    ...columnFilterDatePicker,
  },
  // 产品内部料号
  {
    title: t('dict.SampleLabelPrintColumn.insidePartNumber'),
    field: 'insidePartNumber',
    width: 220,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 工厂
  {
    title: t('dict.QuotationRequirementsColumn.Factory'),
    field: 'factory',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 终端项目代码
  {
    title: t('dict.ProjectColumn.TerminalCustomerProjectCode'),
    field: 'terminalCustomerProjectCode',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 客户要求交期
  {
    title: t('dict.SampleLabelPrintColumn.customerDeliveryTime'),
    field: 'customerDeliverytime',
    width: 120,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => {
    //   return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    // },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // 预估材料交期
  {
    title: t('dict.QuantitativePlanColumn.estimatedMaterialsTime'),
    field: 'estimatedMaterialsTime',
    width: 120,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => {
    //   return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    // },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // 备注(材料交期)
  {
    title: t('dict.QuantitativeDiecuttingPlanColumn.mcRemark'),
    field: 'mcRemark',
    width: 120,
    showOverflow: 'tooltip',
  },
  // 需求数量(PCS)
  {
    title: t('dict.SampleLabelPrintColumn.demandQty'),
    field: 'demandQty',
    width: 120,
    showOverflow: 'tooltip',
  },
  // 排产数量(PCS)
  {
    title: t('dict.QuantitativeDiecuttingPlanColumn.demandQty'),
    field: 'planDemandQty',
    width: 120,
    showOverflow: 'tooltip',
  },
  // 要求排产时间
  {
    title: t('dict.QuantitativePlanColumn.requirementProduction'),
    field: 'requirementProduction',
    width: 120,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => {
    //   return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    // },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // 交付计划
  {
    title: t('dict.QuantitativeDiecuttingPlanColumn.diecuttingPlanRemark'),
    field: 'deliveryPlan',
    width: 120,
    showOverflow: 'tooltip',
  },
  // 终端项目阶段
  {
    title: t('dict.QuantitativeReportColumn.projectPhase'),
    field: 'projectPhase',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 是否报关
  {
    title: t('dict.QuantitativeReportColumn.isDeclareCustoms'),
    field: 'isDeclareCustoms',
    width: 120,
    showOverflow: 'tooltip',
    ...createColumnFilterSelect('StateEnum'),
    formatter: ({ cellValue, row }) => getYesOrNoLabel(row.isDeclareCustomsEnum, cellValue),
  },
  // 直接客户料号
  {
    title: t('dict.QuotationRequirementsColumn.ImmediateCustomerPartNumber'),
    field: 'immediateCustomerPartNumber',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 直接客户简称
  {
    title: t('dict.CustomerColumn.name'),
    field: 'immediateCustomerName',
    width: 220,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 终端客户料号
  {
    title: t('dict.FillingBillCustomerTemplate.TerminalCustomerMaterialNumber'),
    field: 'terminalCustomerPartNumber',
    width: 120,
    showOverflow: 'tooltip',
    ...columnFilterInput(),
  },
  // 产品描述
  {
    title: t('dict.FillingBillCustomerTemplate.ProductDesc'),
    field: 'productDesc',
    width: 120,
    showOverflow: 'tooltip',
  },
  // 生产类型
  {
    title: t('dict.ProcessColumn.typeDesc'),
    field: 'productionType',
    width: 120,
    showOverflow: 'tooltip',
    ...createColumnFilterSelect('', productTypeOptions),
    formatter: ({ cellValue, row }) => getProductTypeLabel(row.productionTypeEnum, cellValue),
  },
  // 需求评审状态
  {
    title: t('dict.QuantitativeApplyColumn.epmStatusDesc'),
    field: 'epmStatus',
    width: 120,
    showOverflow: 'tooltip',
    formatter: ({ cellValue, row }) => getStatusLabel(row.epmStatusEnum, cellValue),
  },
  // 需求评审处理日期
  {
    title: t('dict.QuantitativeReportColumn.epmDate'),
    field: 'epmDate',
    width: 220,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
    },
  },
  // 需求评审时长
  {
    title: t('dict.QuantitativeReportColumn.epmHandlerDuration'),
    field: 'epmHandlerDuration',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 需求评审人
  {
    title: t('dict.QuantitativeReportColumn.epmUserName'),
    field: 'epmUserName',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 需求评审详情
  {
    title: '需求评审详情',
    field: 'id',
    width: 120,
    showOverflow: 'tooltip',
    slots: { default: 'id' },
  },
  // 图纸评审状态
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewStatus'),
    field: 'drawingsReviewStatus',
    width: 120,
    showOverflow: 'tooltip',
    formatter: ({ cellValue, row }) => getStatusLabel(row.drawingsReviewStatusEnum, cellValue),
  },
  // 图纸评审处理日期
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewApplyDate'),
    field: 'drawingsReviewApplyDate',
    width: 220,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
    },
  },
  // 图纸评审时长
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewHandlerDuration'),
    field: 'drawingsReviewHandlerDuration',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 图纸评审人
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewCurrentProcessor'),
    field: 'drawingsReviewCurrentProcessor',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 图纸评审详情
  {
    title: '图纸评审详情',
    field: 'drawingsReviewId',
    width: 120,
    showOverflow: 'tooltip',
    slots: { default: 'drawingsReviewId' },
  },
  ...vxeDynamicsColumns[DemandTypeEnum.量试需求],
  // 商务确认状态
  {
    title: '商务确认状态',
    field: 'deliveryConfirmStatus',
    width: 120,
    showOverflow: 'tooltip',
    formatter: ({ cellValue, row }) => getStatusLabel(row.deliveryConfirmStatusEnum, cellValue),
  },
  // 商务确认处理日期
  {
    title: '商务确认处理日期',
    field: 'deliveryConfirmApplyDate',
    width: 220,
    showOverflow: 'tooltip',
    // formatter: ({ cellValue, row }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : row.deliveryConfirmApplyDateTime || ''),
    cellRender: {
      name: 'Date',
    },
  },
  // 商务确认处理时长
  {
    title: '商务确认处理时长',
    field: 'deliveryConfirmHandlerDuration',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 商务确认处理人
  {
    title: '商务确认处理人',
    field: 'deliveryConfirmUserName',
    width: 220,
    showOverflow: 'tooltip',
  },
  // 商务确认详情
  {
    title: '商务确认详情',
    field: 'deliveryConfirmId',
    width: 120,
    showOverflow: 'tooltip',
    slots: { default: 'deliveryConfirmId' },
  },
  // 商务确认结果
  {
    title: t('dict.QuantitativeApplyColumn.confirmOpinion'),
    field: 'confirmOpinion',
    width: 120,
    showOverflow: 'tooltip',
  },
];
