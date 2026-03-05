import type Dayjs from 'dayjs';
import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { productTypeOptions } from '../utils';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
const { t } = useI18n();
dayjs.extend(duration);

const columnFilterInput = () => ({
  filters: [{ data: '' }],
  filterRender: { name: 'Input' },
});

const columnFilterDatePicker = () => ({
  filters: [{ data: '', key: 'index' }],
  filterRender: { name: 'DatePicker', props: { valueFormat: 'YYYY-MM-DD' } },
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
 * 处理状态筛选
 */
export const statusOptions = [
  { label: t('common.todoText'), value: 6 },
  { label: t('common.doneText'), value: 7 },
];

/**
 * 计算两个时间之间相差的天数、小时数、分钟数和秒数
 * @param startTime 开始时间字符串
 * @param endTime 结束时间字符串
 * @returns 格式化的字符串，例如 "1天2小时3分4秒"
 */
export function calculateTimeDifference(startTime: Dayjs.ConfigType, endTime: Dayjs.ConfigType): string {
  const start = dayjs(startTime).tz();
  const end = dayjs(endTime).tz();

  if (!startTime || !endTime || !(start.isValid() && end.isValid())) {
    return '';
  }

  const duration = dayjs.duration(end.diff(start));
  return `${Math.floor(duration.asDays())}天${duration.hours()}小时${duration.minutes()}分${duration.seconds()}秒`;
}

export const vxeTableColumns: VxeGridPropTypes.Columns = [
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
    field: 'applyCode',
    showOverflow: 'tooltip',
    width: '160',
    ...columnFilterInput(),
  },
  // 需求类型
  {
    title: t('dict.SampleLabelPrintColumn.demandTypeName'),
    field: 'demandTypeName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: t('dict.CommonCol.status'),
    field: 'statusName', // status
    width: 100,
  },
  // 申请人
  {
    title: t('dict.SampleLabelPrintColumn.applyUserName'),
    field: 'applyUserName',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 提交时间 / 申请日期
  {
    title: t('dict.FillingBillCustomerTemplate.ApplyDate'),
    field: 'applyDate',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
    // exportMethod: ({ row }) => {
    //   const cellValue = row.applyDate;
    //   return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    // },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    ...columnFilterDatePicker(),
  },
  // 报价用途
  {
    title: t('dict.QuotationRequirementsColumn.Purpose'),
    field: 'purpose',
    showOverflow: 'tooltip',
    width: '120',
    ...createColumnFilterSelect('QuotationRequirements.Purpose'),
  },
  // 客户要求交期
  {
    title: t('dict.QuotationRequirementsColumn.DeliveryDate'),
    field: 'deliveryDate',
    showOverflow: 'tooltip',
    width: '160',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    exportMethod: ({ row }) => {
      const cellValue = row.deliveryDate;
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    },
    //  ...columnFilterDatePicker()
  },
  // 紧急程度
  {
    title: t('dict.QuantitativeApplyColumn.urgencyLevelDesc'),
    field: 'urgencyLevel',
    showOverflow: 'tooltip',
    width: '120',
    ...createColumnFilterSelect('QuotationRequirements.UrgencyLevel'),
  },

  // 项目总量(W)
  {
    title: t('dict.QuantitativeApplyColumn.totalQty') + '(W)',
    field: 'totalQty',
    showOverflow: 'tooltip',
    width: '120',
    //  ...columnFilterInput(),
  },
  // 量产周期(月)
  {
    title: '量产周期(月)',
    field: 'productionCycle',
    showOverflow: 'tooltip',
    width: '120',
    //  ...columnFilterInput(),
  },
  // 招标模切厂家数
  {
    title: t('dict.QuotationRequirementsColumn.FactoryQty'),
    field: 'factoryQty',
    showOverflow: 'tooltip',
    width: '160',
    //  ...columnFilterInput(),
  },
  // 产品内部料号
  {
    title: t('dict.SampleLabelPrintColumn.insidePartNumber'),
    field: 'insidePartNumber',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 工厂
  {
    title: t('dict.QuotationRequirementsColumn.Factory'),
    field: 'factory',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 单位用量
  {
    title: '单位用量',
    field: 'unitQty',
    showOverflow: 'tooltip',
    width: '120',
    //  ...columnFilterInput(),
  },
  // 是否保税
  {
    title: t('dict.QuotationRequirementsColumn.IsBonded'),
    field: 'isBonded',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue }) => {
      if (typeof cellValue === 'boolean') {
        return cellValue ? t('dict.Bool.True') : t('dict.Bool.False');
      }
      return cellValue;
    },
  },
  // 成本单位
  {
    title: t('dict.QuotationRequirementsColumn.CostUnit'),
    field: 'costUnit',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 终端客户料号
  {
    title: t('dict.FillingBillCustomerTemplate.TerminalCustomerMaterialNumber'),
    field: 'terminalCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 直接客户料号
  {
    title: t('dict.QuotationRequirementsColumn.ImmediateCustomerPartNumber'),
    field: 'immediateCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 产品描述
  {
    title: t('dict.FillingBillCustomerTemplate.ProductDesc'),
    field: 'productDesc',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 需求评审状态
  {
    title: t('dict.QuantitativeApplyColumn.epmStatusDesc'),
    field: 'reviewStatus',
    showOverflow: 'tooltip',
    width: '160',
    //  ...createColumnFilterSelect('', reviewStatuOptions),
  },
  // 需求评审处理日期
  {
    title: t('dict.QuantitativeReportColumn.epmDate'),
    field: 'reviewEndTime',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
    },
    exportMethod: ({ row }) => {
      const cellValue = row.reviewEndTime;
      return cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  // 需求评审时长
  {
    title: t('dict.QuantitativeReportColumn.epmHandlerDuration'),
    field: 'reviewHandlerDuration',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ row }) => calculateTimeDifference(row.reviewBeginTime, row.reviewEndTime) || '',
    // exportMethod: ({ row }) => calculateTimeDifference(row.reviewBeginTime, row.reviewEndTime) || '',
  },
  // 需求评审人
  {
    title: t('dict.QuantitativeReportColumn.epmUserName'),
    field: 'reviewUserName',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 需求评审详情
  {
    title: t('dict.QuantitativeReport.reviewId'),
    field: 'reviewId',
    showOverflow: 'tooltip',
    slots: {
      default: 'ReviewDetail',
    },
    width: '120',
  },
  // 生产类型
  {
    title: t('views.productionPlan.productionType'),
    field: 'productionType',
    showOverflow: 'tooltip',
    width: '120',
    // ...createColumnFilterSelect('ProductionTypeEnum'),
    ...createColumnFilterSelect('', productTypeOptions),
  },
  // 图纸评审状态
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewStatus'),
    field: 'drawingsReviewStatus',
    showOverflow: 'tooltip',
    width: '220',
    //  ...createColumnFilterSelect('', reviewStatuOptions),
  },
  // 图纸评审处理日期
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewApplyDate'),
    field: 'drawingsReviewEndTime',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    exportMethod: ({ row }) => {
      const cellValue = row.drawingsReviewEndTime;
      return cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  // 图纸评审时长
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewHandlerDuration'),
    field: 'drawingsReviewHandlerDuration',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ row }) => calculateTimeDifference(row.drawingsReviewBeginTime, row.drawingsReviewEndTime) || '',
    // exportMethod: ({ row }) => calculateTimeDifference(row.drawingsReviewBeginTime, row.drawingsReviewEndTime) || '',
  },
  // 图纸评审人
  {
    title: t('dict.QuantitativeReportColumn.drawingsReviewCurrentProcessor'),
    field: 'drawingsReviewUserName',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 图纸评审详情
  {
    title: '图纸评审详情',
    field: 'drawingsReviewId',
    showOverflow: 'tooltip',
    slots: {
      default: 'DrawingsReviewDetail',
    },
    width: '120',
  },
  // 工程报价状态
  {
    title: '工程报价状态',
    field: 'quotationStatus',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 工程报价处理日期
  {
    title: '工程报价处理日期',
    field: 'quotationEndTime',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    exportMethod: ({ row }) => {
      const cellValue = row.quotationEndTime;
      return cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  // 工程报价时长
  {
    title: '工程报价时长',
    field: 'quotationHandlerDuration',
    showOverflow: 'tooltip',
    width: '220',
    // formatter: ({ row }) => calculateTimeDifference(row.quotationBeginTime, row.quotationEndTime) || '',
    // exportMethod: ({ row }) => calculateTimeDifference(row.quotationBeginTime, row.quotationEndTime) || '',
  },
  // 工程报价人
  {
    title: '工程报价人',
    field: 'quotationUserName',
    showOverflow: 'tooltip',
    width: '220',
    //  ...columnFilterInput(),
  },
  // 工程报价详情
  {
    title: '工程报价详情',
    field: 'quotationId',
    showOverflow: 'tooltip',
    slots: {
      default: 'QuotationIdDetail',
    },
    width: '120',
  },
  // 采购报价状态
  {
    title: '采购报价状态',
    field: 'pqStatus',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 采购报价处理日期
  {
    title: '采购报价处理日期',
    field: 'pqEndTime',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
    cellRender: {
      name: 'Date',
    },
  },
  // 采购报价时长
  {
    title: '采购报价时长',
    field: 'pqHandlerDuration',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 采购报价人
  {
    title: '采购报价人',
    field: 'pqUserName',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput(),
  },
  // 商务确认结果
  {
    title: t('dict.QuotationRequirementsColumn.ConfirmOpinion'),
    field: 'confirmOpinion',
    showOverflow: 'tooltip',
    width: '160',
    //  ...createColumnFilterSelect('', [
    //    { label: '同意', value: '1' },
    //    { label: '不同意', value: '2' },
    //  ]),
  },
];
