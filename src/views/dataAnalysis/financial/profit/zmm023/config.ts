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
  commonBiggerColumnOptions,
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
    key: 'wlfl',
    label: '物料重分类',
    attrs: {
      placeholder: '请输入物料重分类',
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
      title: '收货日期',
      ...commonDateOption,
    },
    {
      field: 'DmbtrZh',
      title: '收货未税金额(汇率转换)',
      ...commonBiggerColumnOptions,
    },
    {
      field: 'Wlfl',
      title: '物料重分类',
      ...commonMediumTextOption,
    },
    {
      field: 'Banfn',
      title: '采购申请',
      ...commonMediumTextOption,
    },
    {
      field: 'Bnfpo',
      title: '采购申请行',
      ...commonMediumTextOption,
    },
    {
      field: 'Ebeln',
      title: '采购订单',
      ...commonMediumTextOption,
    },
    {
      field: 'Ebelp',
      title: '订单行项目',
      ...commonMediumTextOption,
    },
    {
      field: 'Knttx',
      title: '科目分配类别',
      ...commonMediumTextOption,
    },
    {
      field: 'Ptext',
      title: '项目类别',
      ...commonMediumTextOption,
    },
    {
      field: 'Bsart',
      title: '采购凭证类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Bktxt',
      title: '凭证抬头文本',
      ...commonMediumTextOption,
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
      field: 'Bukrs',
      title: '公司代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Butxt',
      title: '公司描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Werks',
      title: '工厂代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Werkst',
      title: '工厂描述',
      ...commonMediumTextOption,
    },
    {
      field: 'Lifnr',
      title: '供应商编码',
      ...commonMediumTextOption,
    },
    {
      field: 'Lifnrt',
      title: '供应商名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcgy',
      title: '采购员工号',
      ...commonMediumTextOption,
    },
    {
      field: 'Txz01',
      title: '物品名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Menge',
      title: '订单数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins',
      title: '订单单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Aedat',
      title: '订单日期',
      ...commonDateOption,
    },
    {
      field: 'Eindt',
      title: '交货日期',
      ...commonDateOption,
    },
    {
      field: 'Kbetr',
      title: '条件定价含税金额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Kpein',
      title: '条件定价单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Waers',
      title: '币别',
      ...commonMediumTextOption,
    },
    {
      field: 'Zterm',
      title: '付款条件代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Ztermt',
      title: '付款条件名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Zwsdj',
      title: '订单未税单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Netwr',
      title: '订单未税金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Zhsdj',
      title: '订单含税单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Brtwr',
      title: '订单含税金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Mwskz',
      title: '税码',
      ...commonMediumTextOption,
    },
    {
      field: 'Zse',
      title: '订单税额',
      ...commonMediumTextOption,
    },
    {
      field: 'Umson',
      title: '免费订单',
      ...commonMediumTextOption,
    },
    {
      field: 'Retpo',
      title: '退货订单',
      ...commonMediumTextOption,
    },
    {
      field: 'Matkl',
      title: '物料组',
      ...commonMediumTextOption,
    },
    {
      field: 'Ekgrp',
      title: '采购组',
      ...commonMediumTextOption,
    },
    {
      field: 'Kostl',
      title: '成本中心',
      ...commonMediumTextOption,
    },
    {
      field: 'Ktext',
      title: '成本中心名称',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Aufnr',
      title: 'PM维修工单号',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zallpr',
      title: '模具所用产品',
      ...commonMediumTextOption,
    },
    {
      field: 'Zxmh',
      title: '项目号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zproit',
      title: '产品项目',
      ...commonMediumTextOption,
    },
    {
      field: 'Zengin',
      title: '工程师',
      ...commonMediumTextOption,
    },
    {
      field: 'Kunnr',
      title: '客户代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Zmoldck',
      title: '对应销售员',
      ...commonMediumTextOption,
    },
    {
      field: 'Zusenub',
      title: '模具用途',
      ...commonMediumTextOption,
    },
    {
      field: 'Zmoldus',
      title: '模具用途描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Ztypecom',
      title: '模具类型',
      ...commonMediumTextOption,
    },
    {
      field: 'Zdietype',
      title: '模具类型描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zcatecdd',
      title: '模具分类',
      ...commonMediumTextOption,
    },
    {
      field: 'Zmoldcf',
      title: '模具分类描述',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Badat',
      title: '请购日期',
      ...commonDateOption,
    },
    {
      field: 'Zfygsqm',
      title: '费用归属全码',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zgsbm',
      title: '归属部门',
      ...commonMediumTextOption,
    },
    {
      field: 'Zgsteam',
      title: '归属Team',
      ...commonMediumTextOption,
    },
    {
      field: 'Zgsleader',
      title: '归属Leader',
      ...commonMediumTextOption,
    },
    {
      field: 'Zgsxj',
      title: '归属仙剑',
      ...commonMediumTextOption,
    },
    {
      field: 'Zcname',
      title: '采购员姓名',
      ...commonMediumTextOption,
    },
    {
      field: 'Zmonth',
      title: '收货月份',
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
      field: 'Mblnr',
      title: '物料凭证',
      ...commonMediumTextOption,
    },
    {
      field: 'Zeile',
      title: '物料凭证项目',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Cputm',
      title: '收货时间',
      ...commonDateOption,
    },
    {
      field: 'Zshr',
      title: '收货人工号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zshrt',
      title: '收货人姓名',
      ...commonMediumTextOption,
    },
    {
      field: 'Erfmg',
      title: '收货数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Zshhsje',
      title: '收货含税金额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zshse',
      title: '收货税额',
      ...commonMediumTextOption,
    },
    {
      field: 'Belnr',
      title: '发票单号',
      ...commonMediumTextOption,
    },
    {
      field: 'Zfpsl',
      title: '发票数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Wrbtr',
      title: '发票金额',
      ...commonMediumTextOption,
    },
    {
      field: 'Buzei',
      title: '发票行项目',
      ...commonMediumTextOption,
    },
    {
      field: 'Rbstatt',
      title: '发票状态',
      ...commonMediumTextOption,
    },
    {
      field: 'Bldat',
      title: '发票日期',
      ...commonDateOption,
    },
    {
      field: 'Zfkzt',
      title: '付款状态',
      ...commonMediumTextOption,
    },
    {
      field: 'Zstate',
      title: '物料凭证状态',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Zbg',
      title: 'BG',
      ...commonMediumTextOption,
    },
    {
      field: 'Gsber',
      title: '业务范围',
      ...commonMediumTextOption,
    },
    {
      field: 'Name2',
      title: '物料长文本',
      ...commonMediumTextOption,
    },
    {
      field: 'Zybshws',
      title: '原币收货未税金额',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Dmbtr',
      title: '收货未税金额',
      ...commonMediumTextOption,
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
