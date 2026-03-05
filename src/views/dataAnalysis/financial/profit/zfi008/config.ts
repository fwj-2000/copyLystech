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
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'bflbms',
    label: '报废类别描述',
    attrs: {
      placeholder: '请输入报废类别描述',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'sfwjzgc',
    label: '',
    attrs: {
      placeholder: '是否无价值工厂',
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
      field: 'Wlfl',
      title: '物料分类',
      ...commonMediumTextOption,
    },
    {
      field: 'Bflbms',
      title: '报废类别描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sfwjzgc',
      title: '是否无价值工厂',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sfph',
      title: '是否平湖',
      ...commonMediumTextOption,
    },
    {
      field: 'Cz',
      title: '产值',
      ...commonMediumTextOption,
    },
    {
      field: 'Cb',
      title: '成本',
      ...commonMediumTextOption,
    },
    {
      field: 'Mblnr',
      title: '物料凭证',
      ...commonMediumTextOption,
    },
    {
      field: 'Bukrs',
      title: '法人',
      ...commonMediumTextOption,
    },
    {
      field: 'Butxt',
      title: '法人名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Werks',
      title: '材料工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Name1',
      title: '工厂描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Gsber',
      title: '业务范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Gtext',
      title: '业务范围描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zmon',
      title: '月份',
      ...commonMediumTextOption,
    },
    {
      field: 'Aufnr',
      title: '订单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Txt30',
      title: '单据状态',
      ...commonMediumTextOption,
    },
    {
      field: 'Bwart',
      title: '移动类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgobe',
      title: '仓位',
      ...commonMediumTextOption,
    },
    {
      field: 'Matnr',
      title: '产品编码',
      ...commonMediumTextOption,
    },
    {
      field: 'Maktx',
      title: '产品编码描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Meins',
      title: '数量单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Menge',
      title: '数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Verpr',
      title: '单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbfje',
      title: '报废金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Stprs',
      title: '标准价',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbfje2',
      title: '标准报废金额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Mtart',
      title: '物料类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Scrtp',
      title: '报废物料分类',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Mtbez',
      title: '报废分类描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Txt',
      title: '工单类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Scrtxt',
      title: '报废类别',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbeze',
      title: '备注',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzdyy',
      title: '终端应用',
      ...commonMediumTextOption,
    },
    {
      field: 'Zkhmc',
      title: '终端客户名称',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zkhcp',
      title: '终端客户产品',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zkhcpm',
      title: '客户产品名',
      ...commonMediumTextOption,
    },
    {
      field: 'Zkhxmbh',
      title: '外部项目号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcpgs',
      title: '内部产品线',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzdkulh',
      title: '终端客户料号',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zptmc',
      title: '平台区分',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzmmc',
      title: '归属模组',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbgmc',
      title: 'BG',
      ...commonMediumTextOption,
    },
    {
      field: 'Zjxqj',
      title: 'BD维度',
      ...commonMediumTextOption,
    },
    {
      field: 'Zczdj',
      title: '产值单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcpcz',
      title: '成品产值',
      ...commonMediumTextOption,
    },
    {
      field: 'Pricefrom',
      title: '价格来源',
      ...commonMediumTextOption,
    },
    {
      field: 'Gjahr',
      title: '财年',
      ...commonMediumTextOption,
    },
    {
      field: 'Pvprs',
      title: '周期单位价格',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zltx',
      title: '月长文本',
      ...commonMediumTextOption,
    },
    {
      field: 'Zno',
      title: '单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Bwkey',
      title: '估价范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Lfmon',
      title: '当前时间(过账时间)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Kalnr',
      title: '成本估算号',
      ...commonMediumTextOption,
    },
    {
      field: 'Vprsv',
      title: '价格控制指示符',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Auart',
      title: '销售凭证类型',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zeile',
      title: '物理凭证中的项目',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Mjahr',
      title: '物理凭证中的年份',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Lgort',
      title: '库存地点',
      ...commonMediumTextOption,
    },
    {
      field: 'Charg',
      title: '批号',
      ...commonMediumTextOption,
    },
    {
      field: 'Poper',
      title: '过账期间',
      ...commonMediumTextOption,
    },
    {
      field: 'Lyclje',
      title: '领用材料金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbfzje',
      title: '报废总金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Hl',
      title: '汇率',
      ...commonMediumTextOption,
    },
    {
      field: 'ZbfzjeZh',
      title: '报废总成本(汇率转换后)',
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
