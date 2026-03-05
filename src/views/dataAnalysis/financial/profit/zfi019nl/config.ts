import dayjs from 'dayjs';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonDateTimeSecondOption,
  commonTextOption,
  commonMiniTextOption,
  commonMediumTextOption,
  commonLargeColumnOptions,
  commonDateTimeOption,
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
    key: 'worknoType',
    label: '工单类型',
    attrs: {
      placeholder: '请输入工单类型',
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
      field: 'Budat',
      title: '工单入库日期',
      ...commonDateTimeSecondOption,
    },
    {
      field: 'Zjcl',
      title: '周直接材料',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zwwjgf',
      title: '周-委外加工费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zcpcz',
      title: '成品产值',
      ...commonMediumTextOption,
    },
    {
      field: 'Gdlx',
      title: '工单类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Bukrs',
      title: '法人',
      ...commonMediumTextOption,
    },
    {
      field: 'Werks',
      title: '工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Abtei',
      title: '业务范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Range',
      title: '日期范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Zteco',
      title: '订单是否TECO',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zdlv',
      title: '订单是否DLV',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Dispo',
      title: 'MRP控制者',
      ...commonMediumTextOption,
    },
    {
      field: 'Arbpl',
      title: '工作中心',
      ...commonMediumTextOption,
    },
    {
      field: 'Bwart',
      title: '移动类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Zlb1',
      title: '类别',
      ...commonMediumTextOption,
    },
    {
      field: 'Aufnr',
      title: '入库工单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Auart',
      title: '工单类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Matkl',
      title: '物料组',
      ...commonMediumTextOption,
    },
    {
      field: 'Matnr',
      title: '入库料号',
      ...commonMediumTextOption,
    },
    {
      field: 'Smatnr',
      title: '所属成品',
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
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zxmbh',
      title: '外部项目号',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zcpgs',
      title: '内部产品线',
      ...commonLargeColumnOptions,
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
      field: 'Znbxm',
      title: '内部项目号',
      ...commonMediumTextOption,
    },
    {
      field: 'Kunnr',
      title: '终端客户',
      ...commonMediumTextOption,
    },
    {
      field: 'Zdcyl',
      title: '底层用量',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcfdj',
      title: '拆分产值单价',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zczje',
      title: '产值金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins',
      title: '单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Gamng',
      title: '订单数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Menge',
      title: '本期完工入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Wemng1',
      title: '本期不良入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Wemng2',
      title: '本期良品入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Wemnga',
      title: '完工入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Wemng3',
      title: '不良品入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Wemng4',
      title: '良品入库数量',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Vgw01',
      title: '本期标准机器',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Vgw02',
      title: '本期标准人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ism01',
      title: '本期实际机器',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ism02',
      title: '本期实际人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ism01a',
      title: '总实际机器',
      ...commonMediumTextOption,
    },
    {
      field: 'Ism02a',
      title: '总实际人工',
      ...commonMediumTextOption,
    },
    {
      field: 'Ausch',
      title: '标准损耗率',
      ...commonMediumTextOption,
    },
    {
      field: 'Sbcp',
      title: '标准-料（半成品）',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Scl',
      title: '标准-材料',
      ...commonMediumTextOption,
    },
    {
      field: 'Sdj',
      title: '标准-刀具',
      ...commonMediumTextOption,
    },
    {
      field: 'Sjgf',
      title: '标准-加工费',
      ...commonMediumTextOption,
    },
    {
      field: 'Szjrg',
      title: '标准-直接人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ssd',
      title: '标准-水电',
      ...commonMediumTextOption,
    },
    {
      field: 'Smjf',
      title: '标准-模具费',
      ...commonMediumTextOption,
    },
    {
      field: 'Sjwl',
      title: '标准-机物料',
      ...commonMediumTextOption,
    },
    {
      field: 'Sbdzf',
      title: '标准-其他变动制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sjjrl',
      title: '标准-间接人力',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sjqzj',
      title: '标准-机器折旧',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Scfzx',
      title: '标准-厂房装修',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sgdzf',
      title: '标准-其他固定制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Slsh',
      title: '标准-料(半成品)损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Slsh2',
      title: '标准-材料损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sdjsh',
      title: '标准-刀具损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Szcb',
      title: '标准总成本',
      ...commonMediumTextOption,
    },
    {
      field: 'Sbccb',
      title: '标准-本层成本',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sbmle',
      title: '本阶标准毛利额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sbmlv',
      title: '本阶标准毛利率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Sbbbg',
      title: '本阶标准边贡率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Rkblv',
      title: '入库不良率',
      ...commonMediumTextOption,
    },
    {
      field: 'Dtshl',
      title: '倒推实际损耗率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zsjbcp',
      title: '周实际半成品',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zfbbcp',
      title: '周非标半成品',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zsjcl',
      title: '周实际材料',
      ...commonMediumTextOption,
    },
    {
      field: 'Zfbcl',
      title: '周非标材料',
      ...commonMediumTextOption,
    },
    {
      field: 'Zsjdj',
      title: '周实际刀具',
      ...commonMediumTextOption,
    },
    {
      field: 'Zfbdj',
      title: '周非标刀具',
      ...commonMediumTextOption,
    },
    {
      field: 'ZZjrg',
      title: '周-直接人工',
      ...commonMediumTextOption,
    },
    {
      field: 'ZSd',
      title: '周-水电',
      ...commonMediumTextOption,
    },
    {
      field: 'ZMjf',
      title: '周-模具费',
      ...commonMediumTextOption,
    },
    {
      field: 'ZJwl',
      title: '周-机物料',
      ...commonMediumTextOption,
    },
    {
      field: 'ZBdzf',
      title: '周-其他变动制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'ZJjl',
      title: '周-间接人力',
      ...commonMediumTextOption,
    },
    {
      field: 'ZJqzj',
      title: '周-机器折旧',
      ...commonMediumTextOption,
    },
    {
      field: 'ZCfzx',
      title: '周-厂房装修',
      ...commonMediumTextOption,
    },
    {
      field: 'ZGdzf',
      title: '周-其他固定制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'ZBcpsh',
      title: '周-半成品损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'ZClsh',
      title: '周-材料损耗',
      ...commonMediumTextOption,
    },
    {
      field: 'ZDjsh',
      title: '周-刀具损耗',
      ...commonMediumTextOption,
    },
    {
      field: 'ZZcb',
      title: '周-总成本',
      ...commonMediumTextOption,
    },
    {
      field: 'ZBccb',
      title: '周本层成本',
      ...commonMediumTextOption,
    },
    {
      field: 'ZBcmle',
      title: '周本层毛利额',
      ...commonMediumTextOption,
    },
    {
      field: 'ZBcmlv',
      title: '本阶周-毛利率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'ZBjmlv',
      title: '本阶周-边贡率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FCl',
      title: '分析差异-材料',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FDj',
      title: '分析差异-刀具',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FWw',
      title: '分析差异-委外',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FZjrg',
      title: '分析效率-直接人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FJjl',
      title: '分析效率-间接人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FBdzf',
      title: '分析效率-变动制费1',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FGdzf',
      title: '分析效率-固定制费1',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FShbcp',
      title: '分析损耗-半成品',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FShcl',
      title: '分析损耗-材料',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FShdj',
      title: '分析损耗-刀具',
      ...commonLargeColumnOptions,
    },
    {
      field: 'FHjcy',
      title: '合计差异',
      ...commonMediumTextOption,
    },
    {
      field: 'Zzbcb',
      title: '工单总标准成本',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zzsjcb',
      title: '工单总实际成本',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zzsj',
      title: '工单总损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zzshl',
      title: '总损耗率',
      ...commonMediumTextOption,
    },
    {
      field: 'Ysjbcp',
      title: '月实际半成品',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ysjcl',
      title: '月实际材料',
      ...commonMediumTextOption,
    },
    {
      field: 'Ysjdj',
      title: '月实际刀具',
      ...commonMediumTextOption,
    },
    {
      field: 'Ywwjgf',
      title: '月-委外加工费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YZjrg',
      title: '月-直接人工',
      ...commonMediumTextOption,
    },
    {
      field: 'YSd',
      title: '月-水电',
      ...commonMediumTextOption,
    },
    {
      field: 'YMjf',
      title: '月-模具费',
      ...commonMediumTextOption,
    },
    {
      field: 'YJwl',
      title: '月-机物料',
      ...commonMediumTextOption,
    },
    {
      field: 'YBdzf',
      title: '月-其他变动制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YJjl',
      title: '月-间接人力',
      ...commonMediumTextOption,
    },
    {
      field: 'YJqzj',
      title: '月-机器折旧',
      ...commonMediumTextOption,
    },
    {
      field: 'YCfzx',
      title: '月-厂房装修',
      ...commonMediumTextOption,
    },
    {
      field: 'YGdzf',
      title: '月-其他固定制费',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YBcpsh',
      title: '月-半成品损耗',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YClsh',
      title: '月-材料损耗',
      ...commonMediumTextOption,
    },
    {
      field: 'YDjsh',
      title: '月-刀具损耗',
      ...commonMediumTextOption,
    },
    {
      field: 'YZcb',
      title: '月-总成本',
      ...commonMediumTextOption,
    },
    {
      field: 'YBccb',
      title: '月-本层成本',
      ...commonMediumTextOption,
    },
    {
      field: 'YBcmle',
      title: '月-本层毛利额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YBcmll',
      title: '月-本层毛利率',
      ...commonLargeColumnOptions,
    },
    {
      field: 'YBjgb',
      title: '本阶月-边贡',
      ...commonMediumTextOption,
    },
    {
      field: 'DYz',
      title: '月与周的总差异',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Vgw01a',
      title: '累计标准机器',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Vgw02a',
      title: '累计标准人工',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Stufe',
      title: 'BOM阶层',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcplx',
      title: '产品类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Zczdj',
      title: '产值单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Pricefrom',
      title: '价格来源',
      ...commonMediumTextOption,
    },
    {
      field: 'Kostl',
      title: '成本中心',
      ...commonMediumTextOption,
    },
    {
      field: 'Ebelp',
      title: '采购凭证的项目编号',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zzrgcs',
      title: '责任工程师',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcplb',
      title: '数据类型',
      ...commonMediumTextOption,
    },
    {
      field: 'DataSourceTime',
      title: '抽数时间',
      ...commonDateTimeSecondOption,
      width: 125,
    },
  ];
  return columns;
};
