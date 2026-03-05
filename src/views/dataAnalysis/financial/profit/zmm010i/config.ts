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
    key: 'djlxzl',
    label: '单据类型整理',
    attrs: {
      placeholder: '请输入单据类型整理',
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
      field: 'Bqpd',
      title: '标签判断',
      ...commonMediumTextOption,
    },
    {
      field: 'Djlxzl',
      title: '单据类型整理',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Cz',
      title: '产值',
      ...commonMediumTextOption,
    },
    {
      field: 'DmbtrZh',
      title: '成本',
      ...commonMediumTextOption,
    },
    {
      field: 'Bukrs',
      title: '公司代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Zidate',
      title: '创建日期',
      ...commonDateOption,
    },
    {
      field: 'ZstatuTxt',
      title: '状态',
      ...commonMediumTextOption,
    },
    {
      field: 'Spdh',
      title: '审批单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zno',
      title: '单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zitem',
      title: '行号',
      ...commonMediumTextOption,
    },
    {
      field: 'ZnoSpli',
      title: '拆分行',
      ...commonMediumTextOption,
    },
    {
      field: 'Zdoctyp',
      title: '单据类型',
      ...commonMediumTextOption,
    },
    {
      field: 'ZdoctypTxt',
      title: '单据类型描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zlltyp',
      title: '领料类型',
      ...commonMediumTextOption,
    },
    {
      field: 'ZlltypTxt',
      title: '领料类型描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Zlltyp3',
      title: '三级分类',
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
      ...commonMediumTextOption,
    },
    {
      field: 'Zrequser',
      title: '申请人',
      ...commonMediumTextOption,
    },
    {
      field: 'Zreqdep',
      title: '申请部门',
      ...commonMediumTextOption,
    },
    {
      field: 'ZmarkHead1',
      title: '抬头备注(项目和用途)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Matnr',
      title: '物料编码',
      ...commonMediumTextOption,
    },
    {
      field: 'Maktx',
      title: '物料描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Zqty',
      title: '数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins',
      title: '单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Dmbtr',
      title: '本位币金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Zsjcb',
      title: '实际成本',
      ...commonMediumTextOption,
    },
    {
      field: 'Waers',
      title: '币别',
      ...commonMediumTextOption,
    },
    {
      field: 'Zqjfs',
      title: '取价方式',
      ...commonMediumTextOption,
    },
    {
      field: 'Netwr',
      title: '销售价格(税务)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Brtwr',
      title: '销售总金额(税务)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Werks',
      title: '工厂(小厂)',
      ...commonMediumTextOption,
    },
    {
      field: 'Namew',
      title: '工厂描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgort',
      title: '库存地点',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgobe',
      title: '库存地点描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Kostl',
      title: '成本中心',
      ...commonMediumTextOption,
    },
    {
      field: 'KostlTxt',
      title: '成本中心描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Abtei',
      title: '成本中心业务范围',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FuncArea',
      title: '功能范围',
      ...commonMediumTextOption,
    },
    {
      field: 'ZmarkHead',
      title: '抬头备注',
      ...commonMediumTextOption,
    },
    {
      field: 'Zmark',
      title: '行项目备注',
      ...commonMediumTextOption,
    },
    {
      field: 'Sgtxt',
      title: '项目文本',
      ...commonMediumTextOption,
    },
    {
      field: 'Zchxm',
      title: '归属项目',
      ...commonMediumTextOption,
    },
    {
      field: 'Zjd',
      title: '项目阶段',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcsjg',
      title: '测试反馈结果',
      ...commonMediumTextOption,
    },
    {
      field: 'ZuuserName',
      title: '修改者',
      ...commonMediumTextOption,
    },
    {
      field: 'ZpuserName',
      title: '过账者',
      ...commonMediumTextOption,
    },
    {
      field: 'Zpdate',
      title: '过账日期',
      ...commonDateOption,
    },
    {
      field: 'Zptime',
      title: '过账时间',
      ...commonDateOption,
    },
    {
      field: 'Mblnr',
      title: '物料凭证',
      ...commonMediumTextOption,
    },
    {
      field: 'ZqtyP',
      title: '过账数量',
      ...commonMediumTextOption,
    },
    {
      field: 'ZlgortP',
      title: '过账库存地点',
      ...commonMediumTextOption,
    },
    {
      field: 'ZlgobeP',
      title: '过账库存地点描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zjhdate',
      title: '计划领用时间',
      ...commonDateOption,
    },
    {
      field: 'Zinput',
      title: '报废入库',
      ...commonMediumTextOption,
    },
    {
      field: 'ZchargP',
      title: '过账批次',
      ...commonMediumTextOption,
    },
    {
      field: 'Zpartner',
      title: '客户',
      ...commonMediumTextOption,
    },
    {
      field: 'ZnameP',
      title: '客户名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Zkhxmbh',
      title: '项目号',
      ...commonMediumTextOption,
    },
    {
      field: 'Fygs',
      title: '费用归属',
      ...commonMediumTextOption,
    },
    {
      field: 'Zbgno',
      title: '报关单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zudate',
      title: '修改日期',
      ...commonDateOption,
    },
    {
      field: 'Zutime',
      title: '修改时间',
      ...commonDateOption,
    },
    {
      field: 'ZiuserName',
      title: '创建者',
      ...commonMediumTextOption,
    },
    {
      field: 'Aufnr',
      title: '内部订单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Charg',
      title: '批次',
      ...commonMediumTextOption,
    },
    {
      field: 'Lifnr',
      title: '特性中的供应商',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Lname',
      title: '特性中的供应商名称',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zwerksmb',
      title: '目标工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Zlgortmb',
      title: '目标库存地点',
      ...commonMediumTextOption,
    },
    {
      field: 'Zlgobemb',
      title: '目标库存地点描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Zchargmb',
      title: '目标批次',
      ...commonMediumTextOption,
    },
    {
      field: 'Zaddress',
      title: '客户地址',
      ...commonMediumTextOption,
    },
    {
      field: 'Kdmat',
      title: '客户物料',
      ...commonMediumTextOption,
    },
    {
      field: 'Gsber',
      title: '仓库业务范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Conperson',
      title: '联系人',
      ...commonMediumTextOption,
    },
    {
      field: 'Contel',
      title: '联系人电话',
      ...commonMediumTextOption,
    },
    {
      field: 'Bstkd',
      title: '客户订单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zdmbtr',
      title: '销售总金额',
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
      field: 'Zxsdj',
      title: '销售价格',
      ...commonMediumTextOption,
    },
    {
      field: 'Anln1',
      title: '固定资产号',
      ...commonMediumTextOption,
    },
    {
      field: 'Anln1Txt',
      title: '固定资产描述',
      ...commonMediumTextOption,
    },
    {
      field: 'ZmatnrMb',
      title: '目标物料编码',
      ...commonMediumTextOption,
    },
    {
      field: 'ZmaktxMb',
      title: '目标物料编码描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Pricefrom',
      title: '价格来源',
      ...commonMediumTextOption,
    },
    {
      field: 'Gtext',
      title: '仓库业务范围描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Hl',
      title: '汇率',
      ...commonMediumTextOption,
    },
    {
      field: 'DataSourceTime',
      title: '抽数时间',
      ...commonDateOption,
    },
  ];
  return columns;
};
