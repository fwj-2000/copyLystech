import dayjs from 'dayjs';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonDateOption,
  commonTextOption,
  commonMiniTextOption,
  commonMediumTextOption,
  commonLargeColumnOptions,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

export const getCommonReqParams = (searchFromValue: Record<string, any>) => {
  const { dateRange } = searchFromValue;
  const [startDate, endDate] = dateRange;
  return {
    startDim: `${startDate.format('YYYY')}WK${startDate.week()}`,
    endDim: `${endDate.format('YYYY')}WK${endDate.week()}`,
  };
};
// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '年', value: ETimeDimension.YEAR },
];

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    key: 'dimension',
    default: ETimeDimension.WEEK,
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'week'), dayjs().tz().subtract(1, 'week')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMiniTextOption,
      title: '序号',
      type: 'seq',
      field: 'index',
    },
    {
      field: 'Factory',
      title: '厂区',
      ...commonMediumTextOption,
    },
    {
      field: 'Year',
      title: '年',
      ...commonTextOption,
    },
    {
      field: 'Month',
      title: '月',
      ...commonTextOption,
    },
    {
      field: 'Week',
      title: '周',
      ...commonTextOption,
    },
    {
      field: 'DmbtrZh',
      title: '金额(汇率转换后)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Gsber',
      title: '业务范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Budat',
      title: '过账日期',
      ...commonDateOption,
    },
    {
      field: 'Aufnr',
      title: '订单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Gamng',
      title: '订单数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Smatnr',
      title: '所属成品',
      ...commonMediumTextOption,
    },
    {
      field: 'Matnr1',
      title: '产品编码',
      ...commonMediumTextOption,
    },
    {
      field: 'Werks',
      title: '材料工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Pwerk',
      title: '生产工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Mblnr',
      title: '物料凭证',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgort',
      title: '仓库',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgobe',
      title: '仓库地点',
      ...commonMediumTextOption,
    },
    {
      field: 'Bwart',
      title: '移动类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Btext',
      title: '移动类型描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Matnr',
      title: '材料',
      ...commonMediumTextOption,
    },
    {
      field: 'Maktx',
      title: '物料描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins',
      title: '单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins2',
      title: '单位2',
      ...commonMediumTextOption,
    },
    {
      field: 'Menge',
      title: '数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Zwllb',
      title: '物料类别',
      ...commonMediumTextOption,
    },
    {
      field: 'Stats',
      title: '单据状态',
      ...commonMediumTextOption,
    },
    {
      field: 'Dispo',
      title: '主制部门',
      ...commonMediumTextOption,
    },
    {
      field: 'Dsnam',
      title: '主制部门描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Dauat',
      title: '工单类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzdkh2',
      title: '终端客户N',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzrgcs',
      title: '责任工程师',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zcplb',
      title: '产品类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcj',
      title: '车间',
      ...commonMediumTextOption,
    },
    {
      field: 'Hl',
      title: '汇率',
      ...commonMediumTextOption,
    },
    {
      field: 'Dmbtr',
      title: '本位币金额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'DataSourceTime',
      title: '抽数时间',
      ...commonDateOption,
    },
  ];
  return columns;
};
