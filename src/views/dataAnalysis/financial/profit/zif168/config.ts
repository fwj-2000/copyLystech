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
  commonValueOption,
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
      field: 'Zwgcz',
      title: '外购产值',
      ...commonValueOption,
    },
    {
      field: 'Zwglr',
      title: '外购利润',
      ...commonValueOption,
    },
    {
      field: 'Budat',
      title: '过账日期',
      ...commonDateOption,
    },

    {
      field: 'Banfn',
      title: '采购申请编号',
      ...commonMediumTextOption,
    },

    {
      field: 'Ebeln',
      title: '采购凭证编号',
      ...commonMediumTextOption,
    },
    {
      field: 'Ebelp',
      title: '采购凭证的项目编号',
      ...commonMediumTextOption,
    },
    {
      field: 'Matnr',
      title: '物料编号',
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
      title: '公司名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Werks',
      title: '工厂',
      ...commonMediumTextOption,
    },
    {
      field: 'Werkst',
      title: '名称',
      ...commonMediumTextOption,
    },
    {
      field: 'Lifnr',
      title: '供应商或债权人的帐号',
      ...commonMediumTextOption,
    },

    {
      field: 'Lgort',
      title: '库存地点',
      ...commonMediumTextOption,
    },
    {
      field: 'Lgobe',
      title: '仓储地点的描述',
      ...commonMediumTextOption,
    },

    {
      field: 'Menge',
      title: '基本计量单位',
      ...commonMediumTextOption,
    },
    {
      field: 'Meins',
      title: '订单单位',
      ...commonMediumTextOption,
    },

    {
      field: 'Waers',
      title: '货币码',
      ...commonMediumTextOption,
    },
    {
      field: 'Zterm',
      title: '付款条件代码',
      ...commonMediumTextOption,
    },
    {
      field: 'Ztermt',
      title: '收付条款的自解释',
      ...commonMediumTextOption,
    },
    {
      field: 'Lmenge01',
      title: '过帐到未限制使用库存的数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Zwsdj',
      title: '单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Netwr',
      title: '采购订单货币的订单净值',
      ...commonMediumTextOption,
    },
    {
      field: 'Zhsdj',
      title: '订单含税单价',
      ...commonMediumTextOption,
    },
    {
      field: 'Brtwr',
      title: '以采购订单货币计的订单总价值',
      ...commonMediumTextOption,
    },
    {
      field: 'Mwskz',
      title: '销售税/采购税代码',
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
      title: '一般姓名',
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
      title: '模具用途',
      ...commonLargeColumnOptions,
    },

    {
      field: 'Zdietype',
      title: '模具类型',
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
      title: '移动类型(库存管理)',
      ...commonMediumTextOption,
    },
    {
      field: 'Btext',
      title: '移动类型文本(库存管理)',
      ...commonLargeColumnOptions,
    },
    {
      field: 'Mblnr',
      title: ' 物料凭证编号',
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
      title: '以录入项单位表示的数量',
      ...commonMediumTextOption,
    },
    {
      field: 'Charg',
      title: '批号',
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
      title: '会计凭证号码',
      ...commonMediumTextOption,
    },
    {
      field: 'Gjahr',
      title: '财年',
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
      title: '物料凭证中的项目',
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
      title: '质检状态',
      ...commonLargeColumnOptions,
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
      title: '按本位币计的金额',
      ...commonValueOption,
    },

    {
      field: 'Paendterm',
      title: '检验结束日期',
      ...commonDateOption,
    },
    {
      field: 'Zchangqu',
      title: '厂区',
      ...commonMediumTextOption,
    },
    {
      field: 'Zweek',
      title: '日历周',
      ...commonMediumTextOption,
    },
    {
      field: 'Zxsjg',
      title: '销价',
      ...commonValueOption,
    },
    {
      field: 'Pricefrom',
      title: '来源',
      ...commonMediumTextOption,
    },
    {
      field: 'Zwglrl',
      title: '外购利润率',
      ...commonValueOption,
    },
    {
      field: 'DataSourceTime',
      title: '抽数时间',
      ...commonDateOption,
    },
  ];
  return columns;
};
