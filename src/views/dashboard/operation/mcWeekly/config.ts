import { EColumnsType, IColumnOptions, ECellType } from '/@/views/dashboard/types';
import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
import dayjs from 'dayjs';

// 良品|不良品下拉
export const DEFAULT_PRODUCT_TYPE = 'A';
export const productTypeOptions = [
  { label: '汇总', value: 'A' },
  { label: '良品', value: 'L' },
  { label: '不良品', value: 'N' },
];

// 指标代码类型下拉
export const moduleCodeOptions = [
  { label: '入库', value: '1' },
  { label: '出库', value: '2' },
  { label: '库存分析', value: '3' },
  { label: '呆滞', value: '4' },
  { label: '超期', value: '5' },
  { label: '米数卷数', value: '6' },
];
// 材料类型下拉
export const mcTypeOptions = [
  { label: '全部', value: '' },
  { label: '整支', value: '整支' },
  { label: '规格料', value: '规格料' },
  { label: '料头', value: '料头' },
  { label: '包材', value: '包材' },
];
// 超期天数下拉
export const chaoqiOptions = [
  { label: '全部', value: '' },
  { label: '90', value: '90' },
  { label: '180', value: '180' },
];
// 材料米数下拉
export const meterOptions = [
  { label: '全部', value: '' },
  { label: '<=100M', value: '<=100M' },
  { label: '100M<X<=300M', value: '100M<X<=300M' },
  { label: '300M<X<=500M', value: '300M<X<=500M' },
  { label: '500M<X<=1000M', value: '500M<X<=1000M' },
  { label: '1000M<X<=1500M', value: '1000M<X<=1500M' },
  { label: '>1500M', value: '>1500M' },
];
// 主辅材料下拉
export const matnrYypeOptions = [
  { label: '全部', value: '' },
  { label: '主材', value: '主材' },
  { label: '辅材', value: '辅材' },
];

export enum EModuleCode {
  STORAGE = '1', // 入库
  OUTBOUND_SHIPMENTS = '2', // 出库
  INVENTORY = '3', // 库存
  SLUGGISH = '4', // 呆滞
  EXTENDED = '5', // 超期
  MATERIAL_DISTRIBUTION = '6', // 材料分布
}

export const ALL_COLUMNS_OPTIONS = {
  // 主要报表
  category: { width: 80, title: '指标类型', isRowSpan: true },
  metric: { width: 120, title: '指标' },
  vlist: { width: 80, type: EColumnsType.DATE_VALUE_LIST },
  // 指标明细页
  factory: { width: 80, title: '厂区' },
  matnr: { width: 160, title: '材料名称' },
  mengeNum: { width: 60, title: '数量' },
  meins: { width: 60, title: '单位' },
  entdate: { width: 100, title: '入库日期' },
  lgort: { width: 60, title: '仓位' },
  valuerange: { width: 100, title: '价值区间' },
  fvalue: { width: 80, title: '单价' },
  matnrtype: { width: 100, title: '类型' },
  doctype: { width: 80, title: '领料类型' },
  overtype: { width: 80, title: '库龄' },
  period: { width: 80, title: '单位' },
  type: { width: 80, title: '良品' },
};

const moduleCodeMap = {
  入库: EModuleCode.STORAGE,
  出库: EModuleCode.OUTBOUND_SHIPMENTS,
  库存分析: EModuleCode.INVENTORY,
  呆滞: EModuleCode.SLUGGISH,
  超期: EModuleCode.EXTENDED,
  材料分布: EModuleCode.MATERIAL_DISTRIBUTION,
};

// 首页-所有字段
const columns = [
  {
    dataIndex: 'category',
    width: 90,
    hideBG: true,
    resize: false,
  },
  {
    dataIndex: 'metric',
    width: 140,
    resize: false,
  },
  {
    dataIndex: 'vlist',
    width: 90,
    resize: false,
    cellType: ECellType.LINK,
    getPathUrl: ({ record, column, searchFormValue }) => {
      const { dataIndex } = column;
      const { category, metric } = record;
      // 从字符串中提取年份和周数
      const year = Number.parseInt(dataIndex.slice(0, 4));
      const week = Number.parseInt(dataIndex.slice(6));
      // 获取该周的周一（开始日期）
      const startDate = dayjs().tz().year(year).week(week).startOf('week');
      // 获取该周的周日（结束日期）
      const endDate = dayjs().tz().year(year).week(week).endOf('week');
      const moduleCodeKey = Object.keys(moduleCodeMap).find(key => `${category}${metric}`.includes(key)) || '入库';
      const moduleCode = moduleCodeMap[moduleCodeKey];
      const extraParams = {};
      switch (moduleCode) {
        case EModuleCode.INVENTORY:
          extraParams['mcType'] = (mcTypeOptions.find(option => metric.includes(option.label)) || { value: '' }).value;
          break;
        case EModuleCode.SLUGGISH:
          extraParams['mcType'] = (mcTypeOptions.find(option => metric.includes(option.label)) || { value: '' }).value;
          break;
        case EModuleCode.EXTENDED:
          extraParams['mcType'] = (mcTypeOptions.find(option => metric.includes(option.label)) || { value: '' }).value;
          extraParams['chaoqi'] = (chaoqiOptions.find(option => category.includes(option.label)) || { value: '' }).value;
          break;
        case EModuleCode.MATERIAL_DISTRIBUTION:
          extraParams['meter'] = metric;
          extraParams['mcType'] = (mcTypeOptions.find(option => category.includes(option.label)) || { value: '' }).value;
          extraParams['isMAin'] = (matnrYypeOptions.find(option => category.includes(option.label)) || { value: '' }).value;
          break;
        default:
          break;
      }

      const query = {
        orgCode: searchFormValue.orgCode,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        moduleCode,
        ...extraParams,
      };
      // 构造路由参数
      const url = `/dashboard/operation/mcWeekly/detail?${objectToQueryParams(query)}`;
      return url;
    },
  },
];

// 字段配置
export const columnsOptions: IColumnOptions[] = columns.map(item => ({
  ...ALL_COLUMNS_OPTIONS[item.dataIndex],
  ...item,
}));
