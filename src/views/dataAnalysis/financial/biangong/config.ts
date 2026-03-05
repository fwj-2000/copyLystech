import XEUtils from 'xe-utils';
import { h } from 'vue';
import {
  commonLargeTextOption,
  commonMediumTextOption,
  commonTextOption,
  commonMediumValueOption,
  commonLargeValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDimensionDownload, getNoMaintenanceDatadownload } from '/@/api/dataAnalysis/financial';
import { downloadFile } from '/@/views/dataAnalysis/components/BatchMenu/utils';

import DimensionImport from './components/DimensionImport.vue';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
// 多页面通用的批量导入导出配置
export const templateDownloadFile = ({ params, defaultFileName = 'download' }) => {
  return downloadFile({
    params,
    defaultFileName,
    requestApi: getDimensionDownload,
  });
};
const noMaintenanceDownload = ({ params, defaultFileName = 'download' }) => {
  return downloadFile({
    params,
    defaultFileName,
    requestApi: getNoMaintenanceDatadownload,
  });
};
export const commonBatchMenuItems: MenuItemType[] = [
  // 成品编号维度
  {
    label: '成品编号维度',
    key: 'productNumber',
    children: [
      {
        label: '未维护数据导出',
        key: 'productNumberNoMaintenanceDownload',
        clickMethod: formParams => {
          return noMaintenanceDownload({
            params: {
              fileName: '成品编号维度',
              startDim: formParams.startDim.substring(0, 4),
              endDim: formParams.endDim.substring(0, 4),
              orgCode: formParams.orgCode === '' ? formParams.bu : formParams.orgCode,
              exportDim: 0,
            },
          });
        },
      },
      {
        label: '模版下载',
        key: 'productNumberDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '成品编号维度导入模板',
            },
          });
        },
      },
      {
        label: h(DimensionImport, {
          api: '/api/report/dimension/importother',
          buttonText: '导入',
        }),
        key: 'productNumberImport',
      },
    ],
  },
  // 订单号维度
  {
    label: '订单号维度',
    key: 'orderNumber',
    children: [
      {
        label: '未维护数据导出',
        key: 'orderNumberNoMaintenanceDownload',
        clickMethod: formParams => {
          return noMaintenanceDownload({
            params: {
              fileName: '订单号维度',
              startDim: formParams.startDim.substring(0, 4),
              endDim: formParams.endDim.substring(0, 4),
              orgCode: formParams.orgCode === '' ? formParams.bu : formParams.orgCode,
              exportDim: 1,
            },
          });
        },
      },
      {
        label: '模版下载',
        key: 'orderNumberDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '订单号维度导入模板',
            },
          });
        },
      },
      {
        label: h(DimensionImport, {
          api: '/api/report/dimension/importorder',
          buttonText: '导入',
        }),
        key: 'orderNumberImport',
      },
    ],
  },
  // 大项目
  {
    label: '大项目',
    key: 'dimProject',
    children: [
      {
        label: '未维护数据导出',
        key: 'dimProjectNoMaintenanceDownload',
        clickMethod: formParams => {
          return noMaintenanceDownload({
            params: {
              fileName: '大项目维度',
              startDim: formParams.startDim.substring(0, 4),
              endDim: formParams.endDim.substring(0, 4),
              orgCode: formParams.orgCode === '' ? formParams.bu : formParams.orgCode,
              exportDim: 2,
            },
          });
        },
      },
      {
        label: '模版下载',
        key: 'dimProjectDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '大项目导入模板',
            },
          });
        },
      },
      {
        label: h(DimensionImport, {
          api: '/api/report/dimension/ImportDimProject',
          buttonText: '导入',
        }),
        key: 'dimProjectImport',
      },
    ],
  },
];

// 维度页面--过滤条件配置
export const filterKeyMap = {
  customerType: 'customerList',
  engineer: 'engineerList',
  productType: 'productList',
  programType: 'programList',
  sixCodes: 'sicCodeList',
  workNoType: 'workNoList',
  workShopType: 'workShopList',
  orderNo: 'orderNoList',
  newOldProject: 'newOldProjectList',
  smallProject: 'smallProjectList',
  productLine: 'productLineList',
  productNo: 'productNoList',
  general1: 'general1',
  general2: 'general2',
  general3: 'general3',
  general4: 'general4',
  general5: 'general5',
  largeProject: 'largeProject',
  zj10m: 'zj10m',
};
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.SELECT,
    label: '客户',
    default: '',
    key: 'customerType',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '工程师',
    default: '',
    key: 'engineer',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '产品类别',
    default: '',
    key: 'productType',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '项目',
    default: '',
    key: 'programType',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '中间6码',
    default: '',
    key: 'sixCodes',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '工单类型',
    default: '',
    key: 'workNoType',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '车间',
    default: '',
    key: 'workShopType',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '订单号',
    default: '',
    key: 'orderNo',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '新老项目',
    default: '',
    key: 'newOldProject',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '小项目',
    default: '',
    key: 'smallProject',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '产品线',
    default: '',
    key: 'productLine',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '成品料号',
    default: [],
    key: 'productNo',
    attrs: {
      mode: 'multiple',
      maxTagCount: 2,
    },
    options: [],
    getParam: value => {
      return { productNo: Array.isArray(value) ? value.join(';') : value };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '通用1',
    default: '',
    key: 'general1',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用2',
    default: '',
    key: 'general2',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用3',
    default: '',
    key: 'general3',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用4',
    default: '',
    key: 'general4',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '通用5',
    default: '',
    key: 'general5',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '大项目',
    default: '',
    key: 'largeProject',
    options: [],
  },
  {
    type: EFormItemType.SELECT,
    label: '中间10码',
    default: '',
    options: [],
    key: 'zj10m',
  },
];

// 格式化显示
export const getFormatter = ({
  decimal = 0,
  isRate = false,
  isH = false,
}: {
  decimal?: number; // 小数点
  isRate?: boolean; // 是否带百分比
  isH?: boolean; // 是否是百分比小数值
} = {}) => {
  return ({ cellValue: value }) => {
    if (!value) {
      return '';
    }
    if (value === '***') {
      return value;
    }
    if (isRate) {
      const percentageValue = Number.parseFloat(value);
      return `${(isH ? percentageValue * 100 : percentageValue).toFixed(decimal)}%`;
    }
    return XEUtils.commafy(value, { digits: decimal });
  };
};
// 单元格样式设置
export const getClassName = ({
  minValue = 0,
  rollback = false,
  isAbs = false,
}: {
  minValue?: number; // 最小值
  rollback?: boolean; // 是否反转标红条件
  isAbs?: boolean; // 是否以绝对值标红
} = {}) => {
  return ({ row, column }) => {
    const value = row[column.field as string];
    const percentageValue = Number.parseFloat(value);
    const minV = isAbs ? Math.abs(minValue) : minValue;
    const condition = rollback ? percentageValue > minV : percentageValue < minV; // 反转标红条件
    return condition ? 'text-red' : '';
  };
};

export const allColumnsOptions: Record<string, BaseVxeTableTypes.Column> = {
  Year: {
    ...commonMediumTextOption,
    title: '年份',
  },
  EntdateQ: {
    ...commonMediumTextOption,
    title: '季度',
  },
  BuName: {
    ...commonMediumTextOption,
    title: 'bu',
  },
  EntdateMo: {
    ...commonMediumTextOption,
    title: '核算月份',
  },
  Budat: {
    ...commonMediumTextOption,
    width: 94,
    title: '工单结束日期',
  },
  Idat2a: {
    ...commonMediumTextOption,
    title: '下达日期',
  },
  EntdateWk: {
    ...commonMediumTextOption,
    title: '周',
  },
  Factory: {
    ...commonMediumTextOption,
    title: '制造厂',
  },
  WorkShop: {
    ...commonMediumTextOption,
    width: 100,
    title: '车间',
  },
  Auart: {
    ...commonMediumTextOption,
    title: '工单类型',
  },
  AuartDm: {
    ...commonMediumTextOption,
    title: '工单类型(代码)',
  },
  Aufnr: {
    ...commonMediumTextOption,
    width: 100,
    title: '工单编号',
  },
  Matnr: {
    ...commonMediumTextOption,
    width: 120,
    title: '成品编号',
  },
  Zj10m: {
    ...commonMediumTextOption,
    title: '十码',
  },
  Zj6m: {
    ...commonMediumTextOption,
    title: '中间6码',
  },
  Znbxm: {
    ...commonMediumTextOption,
    title: '内部项目',
  },
  Xxm: {
    ...commonMediumTextOption,
    title: '小项目',
  },
  Zzdkh: {
    ...commonLargeTextOption,
    title: '客户划分类型',
  },
  Zcplb: {
    ...commonMediumTextOption,
    title: '产品类别',
  },
  Bom: {
    ...commonLargeTextOption,
    title: '是否有BOM',
  },
  Gamng: {
    ...commonMediumValueOption,
    formatter: getFormatter(),
    className: getClassName(),
    title: '工单数量PCS',
  },
  Wemnga: {
    ...commonMediumValueOption,
    formatter: getFormatter(),
    className: getClassName(),
    title: '成品入库',
  },
  Sj: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 5 }),
    className: getClassName(),
    title: '销售单价',
  },
  Zcpcz: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '产值',
  },
  Zbjzcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准总成本（含损耗）',
  },
  Bzbge: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准边贡额',
  },
  Bzzz: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准变动制费合计',
  },
  Bzbdzf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准变动制费(不含模具费)',
  },
  Smjf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准变动模具费',
  },
  Zmbcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: 'PCC材料成本(零损耗)',
  },
  Zbzcb2: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: 'PCC材料成本(含损耗)',
  },
  Szjrg: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准变动-直接人工成本',
  },
  Bzgdzz: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准固定制费',
  },
  Zsjzcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际总成本',
  },
  Sjbge: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际边贡额',
  },
  rgsse: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '边贡损失额',
  },
  Sjzf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际制费',
  },
  Sjbdzf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际变动制费',
  },
  ZMjf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际变动模具费',
  },
  Zsjje: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际材料成本',
  },
  ZZjrg: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际变动直接人工成本',
  },
  Zclcs: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '材料超损',
  },
  Rgsse: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName({ minValue: 10000, rollback: true, isAbs: true }),
    title: '人工损失额',
  },
  Sjgdzf: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际固定制费',
  },
  Bzdwcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: '标准单位成本',
  },
  Sjdwcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: '实际单位成本',
  },
  Pccdwclcb0sh: {
    ...commonLargeValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: 'PCC单位材料成本(0损耗)',
  },
  PccdwclcbHsh: {
    ...commonLargeValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: 'PCC单位材料成本(含损耗)',
  },
  Sjcldwcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: '实际材料单位成本',
  },
  Bzrgdwcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: '标准单位人工成本',
  },
  Sjrgdwcb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 4 }),
    className: getClassName(),
    title: '实际人工单位成本',
  },
  Bzmle: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准毛利额',
  },
  Sjmle: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际毛利额',
  },
  Mlecy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '毛利额差异',
  },
  Bzmll: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准毛利率',
  },
  Sjmll: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际毛利率',
  },
  Zmlvcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '毛利率差异',
  },
  Bzbgl: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准边贡率',
  },
  Sjbgl: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际边贡率',
  },
  Zbglcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '边贡率差异',
  },
  Bgdcl: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '边贡达成率',
  },
  Bzclzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准材料占比',
  },
  Sjclzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际材料占比',
  },
  Bzrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准人工占比',
  },
  Sjrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际人工占比',
  },
  Bzmqrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准模切人工占比',
  },
  Sjmqrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际模切人工占比',
  },
  Mqrgzbcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '模切人工占比差异',
  },
  Bzsgrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准手工人工占比',
  },
  Sjsgrgzb: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际手工人工占比',
  },
  Sgrgzbcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '手工人工占比差异',
  },
  Rgzbcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '人工占比差异',
  },
  Clzbcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '材料占比差异',
  },
  Bzshl: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '标准损耗率',
  },
  Sjshl: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '实际损耗率',
  },
  Zshlcy: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '损耗率差异',
  },
  ShsseH: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2, isRate: false, isH: false }),
    className: getClassName({ minValue: 10000, rollback: true, isAbs: true }),
    title: '实际损耗额(含损耗)',
  },
  Shsse0: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际损耗额(零损耗)',
  },
  YieldRate: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '入库良率',
  },
  Yield: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '3.8手工良率',
  },
  Bzfqxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准分切效率(K/H)',
  },
  Bzmqxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准模切效率(K/H)',
  },
  Bzsgxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准手工效率(K/H)',
  },
  Bzbzxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '标准包装效率(K/H)',
  },
  Sjfqxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际分切效率(K/H)',
  },
  Sjmqxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际模切效率(K/H)',
  },
  Mqxldc: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '模切效率达成',
  },
  Sjsgxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际手工效率(K/H)',
  },
  Sgxldc: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
    className: getClassName(),
    title: '手工效率达成',
  },
  Sjbzxlkh: {
    ...commonMediumValueOption,
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
    title: '实际包装效率（K/H)',
  },
  zzrgcs: {
    ...commonMediumTextOption,
    title: '工程师(责任工程师)',
  },
  Zxlxm: {
    ...commonMediumTextOption,
    title: '新老项目',
  },
  Verid: {
    ...commonMediumTextOption,
    width: 140,
    title: '生产版本',
  },
  Stlal: {
    ...commonTextOption,
    title: 'BOM版本',
  },
  Zrr: {
    ...commonMediumTextOption,
    title: '责任人',
  },
  Abtei: {
    ...commonMediumTextOption,
    title: '业务范围',
  },
  Werks: {
    ...commonMediumTextOption,
    title: '小厂',
  },
  Dispo: {
    ...commonMediumTextOption,
    title: 'MRP 控制',
  },
  Isbian: {
    ...commonMediumTextOption,
    title: '是否纳入边贡',
  },
  Bzfqgs: {
    ...commonMediumValueOption,
    title: '标准分切工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Bzmqgs: {
    ...commonMediumValueOption,
    title: '标准模切工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Bzsggs: {
    ...commonMediumValueOption,
    title: '标准手工工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Bzbzgs: {
    ...commonMediumValueOption,
    title: '标准包装工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Bzgshj: {
    ...commonMediumValueOption,
    title: '标准工时合计',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Sjfqgs: {
    ...commonMediumValueOption,
    title: '实际分切工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Sjmqgs: {
    ...commonMediumValueOption,
    title: '实际模切工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Sjsggs: {
    ...commonMediumValueOption,
    title: '实际手工工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Sjbzgs: {
    ...commonMediumValueOption,
    title: '实际包装工时',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Sjgshj: {
    ...commonMediumValueOption,
    title: '实际工时合计',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Zmfcb: {
    ...commonMediumValueOption,
    title: '免费材料成本',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Zsjclcb: {
    ...commonMediumValueOption,
    title: '含免费料实际材料成本',
    formatter: getFormatter({ decimal: 2 }),
    className: getClassName(),
  },
  Zclsjsh: {
    ...commonMediumValueOption,
    title: '含免费料实际损耗',
    formatter: getFormatter({ decimal: 2, isRate: true, isH: true }),
    className: getClassName(),
  },
  Cpx: {
    ...commonMediumTextOption,
    title: '产品线',
  },
  Provider: {
    ...commonMediumTextOption,
    title: '提供人',
  },
  Analysis: {
    ...commonMediumTextOption,
    title: '原因分析',
  },
  Measures: {
    ...commonMediumTextOption,
    title: '改善对策',
  },
  Other1: {
    ...commonMediumTextOption,
    title: '通用1',
  },
  Other2: {
    ...commonMediumTextOption,
    title: '通用2',
  },
  Other3: {
    ...commonMediumTextOption,
    title: '通用3',
  },
  Other4: {
    ...commonMediumTextOption,
    title: '通用4',
  },
  Other5: {
    ...commonMediumTextOption,
    title: '通用5',
  },
  LargeProject: {
    ...commonMediumTextOption,
    title: '大项目',
  },
  ModifieTime: {
    ...commonMediumTextOption,
    title: '更新时间',
  },
  ModifiedBy: {
    ...commonMediumTextOption,
    title: '更新人',
  },
  Zzrgcs: {
    ...commonMediumTextOption,
    title: '工程师',
  },
};
