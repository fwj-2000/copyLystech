import { BasicColumn } from '/@/components/Table';
import { thousandsFormat } from '/@/utils/lydc';

// 维度类型
export const DEFAULT_DIMENSION_TYPE = ['znbxm'];
export const dimensionTypeOptions = [
  {
    label: '项目',
    value: 'znbxm',
  },
  {
    label: '车间',
    value: 'workshop',
  },
  {
    label: '客户',
    value: 'zzdkh',
  },
  {
    label: '产品类别',
    value: 'zcplb',
  },
  {
    label: '工程师',
    value: 'zzrgcs',
  },
];
// 工单类型 BL01;EO01;EO02;EO03;FB01;LS01
export const DEFAULT_WORK_NO_TYPE = [];
export const workNoTypeOptions = [
  {
    label: 'BL01',
    value: 'BL01',
  },
  {
    label: 'EO01',
    value: 'EO01',
  },
  {
    label: 'EO02',
    value: 'EO02',
  },
  {
    label: 'FB01',
    value: 'FB01',
  },
  {
    label: 'LS01',
    value: 'LS01',
  },
];

// 是非纳入边贡
export const DEFAULT_IS_BAIN = '1';
export const isBainOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
];

const commonBind = {
  showSearch: true,
  maxTagCount: 2,
  style: 'min-width: 140px',
  dropdownMenuStyle: { width: '120px' },
};
// 下拉条件配置
export const searchConditionMap = {
  customerList: {
    props: 'customerType',
    text: '客户',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
    },
  },
  engineerList: {
    props: 'engineer',
    text: '工程师',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 84px',
    },
  },
  productList: {
    props: 'productType',
    text: '产品类别',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  programList: {
    props: 'programType',
    text: '项目',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 84px',
    },
  },
  sicCodeList: {
    props: 'sixCodes',
    text: '中间6码',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 84px',
    },
  },
  workNoList: {
    props: 'workNoType',
    text: '工单类型',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 84px',
    },
  },
  workShopList: {
    props: 'workShopType',
    text: '车间',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  orderNoList: {
    props: 'orderNo',
    text: '订单号',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  newOldProjectList: {
    props: 'newOldProject',
    text: '新老项目',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  smallProjectList: {
    props: 'smallProject',
    text: '小项目',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  productLineList: {
    props: 'productLine',
    text: '产品线',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
  productNoList: {
    props: 'productNo',
    text: '成品料号',
    selectAll: false,
    default: [],
    bind: {
      ...commonBind,
      style: 'min-width: 140px',
    },
  },
};

const oneDecimalPlace = ['人均产值(万)', '人均MVA(万)', '直间比', '人均产值(万元)']; // 需要保留一位小数的字段列表
// 自定义表格单元格
export const customValueCell: BasicColumn = {
  customRender: ({ record, column }) => {
    const { dataIndex } = column;
    const { metric } = record;
    const value = record[dataIndex as string].toString();
    const numberDecimal = oneDecimalPlace.includes(metric) ? 1 : 0;
    if (value.endsWith('%')) {
      const percentageValue = Number.parseFloat(value);
      return percentageValue.toFixed(1) + '%';
    } else {
      return thousandsFormat(Number.parseFloat(value).toFixed(numberDecimal));
    }
  },
  customCell: (record, _, column) => {
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    return {
      style: `${percentageValue < 0 ? 'color: red' : ''};`,
    };
  },
};

export const getCustomValueCell = (decimal = 0, isRate = false, isH = false, minValue = 0, rollback = false, isAbs = false): BasicColumn => ({
  customRender: ({ record, column }) => {
    const { dataIndex } = column;
    const value = (record[dataIndex as string] || '0').toString();
    if (value === '***') {
      return value;
    }
    if (isRate) {
      const percentageValue = Number.parseFloat(value);
      return `${(isH ? percentageValue * 100 : percentageValue).toFixed(decimal)}%`;
    }
    return thousandsFormat(Number.parseFloat(value).toFixed(decimal));
  },
  customCell: (record, _, column) => {
    const value = record[column?.dataIndex as string];
    const percentageValue = Number.parseFloat(value);
    const minV = isAbs ? Math.abs(minValue) : minValue;
    const condition = rollback ? percentageValue > minV : percentageValue < minV; // 反转标红条件
    return {
      style: `${condition ? 'color: red' : ''};`,
    };
  },
});

// 基本配置信息
export const baseColumnsOption = {
  width: 80,
};

// 所有字段配置
export const allColumnsOptions = {
  Year: {
    dataIndex: 'Year',
    baseInfo: {
      title: '年份',
    },
  },
  EntdateQ: {
    dataIndex: 'EntdateQ',
    baseInfo: {
      title: '季度',
    },
  },
  BuName: {
    dataIndex: 'BuName',
    baseInfo: {
      title: 'bu',
    },
  },
  EntdateMo: {
    dataIndex: 'EntdateMo',
    baseInfo: {
      title: '核算月份',
    },
  },
  Budat: {
    dataIndex: 'Budat',
    baseInfo: {
      width: 94,
      title: '工单结束日期',
    },
  },
  Idat2a: {
    dataIndex: 'Idat2a',
    baseInfo: {
      title: '下达日期',
    },
  },
  EntdateWk: {
    dataIndex: 'EntdateWk',
    baseInfo: {
      title: '周',
    },
  },
  Factory: {
    dataIndex: 'Factory',
    baseInfo: {
      title: '制造厂',
    },
  },
  WorkShop: {
    dataIndex: 'WorkShop',
    baseInfo: {
      width: 100,
      title: '车间',
    },
  },
  Auart: {
    dataIndex: 'Auart',
    baseInfo: {
      title: '工单类型',
    },
  },
  AuartDm: {
    dataIndex: 'AuartDm',
    baseInfo: {
      title: '工单类型(代码)',
    },
  },
  Aufnr: {
    dataIndex: 'Aufnr',
    baseInfo: {
      width: 100,
      title: '工单编号',
    },
  },
  Matnr: {
    dataIndex: 'Matnr',
    baseInfo: {
      width: 120,
      title: '成品编号',
    },
  },
  Zj10m: {
    dataIndex: 'Zj10m',
    baseInfo: {
      title: '十码',
    },
  },
  Zj6m: {
    dataIndex: 'Zj6m',
    baseInfo: {
      title: '中间6码',
    },
  },
  Znbxm: {
    dataIndex: 'Znbxm',
    baseInfo: {
      title: '内部项目',
    },
  },
  xxm: {
    dataIndex: 'xxm',
    baseInfo: {
      title: '小项目',
    },
  },
  Zzdkh: {
    dataIndex: 'Zzdkh',
    baseInfo: {
      title: '客户划分类型',
    },
  },
  Zcplb: {
    dataIndex: 'Zcplb',
    baseInfo: {
      title: '产品类别',
    },
  },
  Bom: {
    dataIndex: 'Bom',
    baseInfo: {
      title: '是否有BOM',
    },
  },
  Gamng: {
    dataIndex: 'Gamng',
    baseInfo: {
      ...getCustomValueCell(),
      title: '工单数量PCS',
    },
  },
  Wemnga: {
    dataIndex: 'Wemnga',
    baseInfo: {
      ...getCustomValueCell(),
      title: '成品入库',
    },
  },
  Sj: {
    dataIndex: 'Sj',
    baseInfo: {
      ...getCustomValueCell(5),
      title: '销售单价',
    },
  },
  Zcpcz: {
    dataIndex: 'Zcpcz',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '产值',
    },
  },
  Zbjzcb: {
    dataIndex: 'Zbjzcb',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准总成本（含损耗）',
    },
  },
  Bzbge: {
    dataIndex: 'Bzbge',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准边贡额',
    },
  },
  Bzzz: {
    dataIndex: 'Bzzz',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准变动制费合计',
    },
  },
  Bzbdzf: {
    dataIndex: 'Bzbdzf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准变动制费(不含模具费)',
    },
  },
  Smjf: {
    dataIndex: 'Smjf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准变动模具费',
    },
  },
  Zmbcb: {
    dataIndex: 'Zmbcb',
    baseInfo: {
      ...getCustomValueCell(2),
      title: 'PCC材料成本(零损耗)',
    },
  },
  Zbzcb2: {
    dataIndex: 'Zbzcb2',
    baseInfo: {
      ...getCustomValueCell(2),
      title: 'PCC材料成本(含损耗)',
    },
  },
  Szjrg: {
    dataIndex: 'Szjrg',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准变动-直接人工成本',
    },
  },
  Bzgdzz: {
    dataIndex: 'Bzgdzz',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准固定制费',
    },
  },
  Zsjzcb: {
    dataIndex: 'Zsjzcb',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际总成本',
    },
  },
  Sjbge: {
    dataIndex: 'Sjbge',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际边贡额',
    },
  },
  rgsse: {
    dataIndex: 'rgsse',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '边贡损失额',
    },
  },
  Sjzf: {
    dataIndex: 'Sjzf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际制费',
    },
  },
  Sjbdzf: {
    dataIndex: 'Sjbdzf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际变动制费',
    },
  },
  ZMjf: {
    dataIndex: 'ZMjf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际变动模具费',
    },
  },
  Zsjje: {
    dataIndex: 'Zsjje',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际材料成本',
    },
  },
  ZZjrg: {
    dataIndex: 'ZZjrg',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际变动直接人工成本',
    },
  },
  Zclcs: {
    dataIndex: 'Zclcs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '材料超损',
    },
  },
  Rgsse: {
    dataIndex: 'Rgsse',
    baseInfo: {
      ...getCustomValueCell(2, false, false, 10000, true, true),
      title: '人工损失额',
    },
  },
  Sjgdzf: {
    dataIndex: 'Sjgdzf',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际固定制费',
    },
  },
  Bzdwcb: {
    dataIndex: 'Bzdwcb',
    baseInfo: {
      ...getCustomValueCell(4),
      title: '标准单位成本',
    },
  },
  Sjdwcb: {
    dataIndex: 'Sjdwcb',
    baseInfo: {
      ...getCustomValueCell(4),
      title: '实际单位成本',
    },
  },
  Pccdwclcb0sh: {
    dataIndex: 'Pccdwclcb0sh',
    baseInfo: {
      ...getCustomValueCell(4),
      title: 'PCC单位材料成本(0损耗)',
    },
  },
  PccdwclcbHsh: {
    dataIndex: 'PccdwclcbHsh',
    baseInfo: {
      ...getCustomValueCell(4),
      title: 'PCC单位材料成本(含损耗)',
    },
  },
  Sjcldwcb: {
    dataIndex: 'Sjcldwcb',
    baseInfo: {
      ...getCustomValueCell(4),
      title: '实际材料单位成本',
    },
  },
  Bzrgdwcb: {
    dataIndex: 'Bzrgdwcb',
    baseInfo: {
      ...getCustomValueCell(4),
      title: '标准单位人工成本',
    },
  },
  Sjrgdwcb: {
    dataIndex: 'Sjrgdwcb',
    baseInfo: {
      ...getCustomValueCell(4),
      title: '实际人工单位成本',
    },
  },
  Bzmle: {
    dataIndex: 'Bzmle',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准毛利额',
    },
  },
  Sjmle: {
    dataIndex: 'Sjmle',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际毛利额',
    },
  },
  Mlecy: {
    dataIndex: 'Mlecy',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '毛利额差异',
    },
  },
  Bzmll: {
    dataIndex: 'Bzmll',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准毛利率',
    },
  },
  Sjmll: {
    dataIndex: 'Sjmll',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际毛利率',
    },
  },
  Zmlvcy: {
    dataIndex: 'Zmlvcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '毛利率差异',
    },
  },
  Bzbgl: {
    dataIndex: 'Bzbgl',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准边贡率',
    },
  },
  Sjbgl: {
    dataIndex: 'Sjbgl',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际边贡率',
    },
  },
  Zbglcy: {
    dataIndex: 'Zbglcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '边贡率差异',
    },
  },
  Bgdcl: {
    dataIndex: 'Bgdcl',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '边贡达成率',
    },
  },
  Bzclzb: {
    dataIndex: 'Bzclzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准材料占比',
    },
  },
  Sjclzb: {
    dataIndex: 'Sjclzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际材料占比',
    },
  },
  Bzrgzb: {
    dataIndex: 'Bzrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准人工占比',
    },
  },
  Sjrgzb: {
    dataIndex: 'Sjrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际人工占比',
    },
  },
  Bzmqrgzb: {
    dataIndex: 'Bzmqrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准模切人工占比',
    },
  },
  Sjmqrgzb: {
    dataIndex: 'Sjmqrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际模切人工占比',
    },
  },
  Mqrgzbcy: {
    dataIndex: 'Mqrgzbcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '模切人工占比差异',
    },
  },
  Bzsgrgzb: {
    dataIndex: 'Bzsgrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准手工人工占比',
    },
  },
  Sjsgrgzb: {
    dataIndex: 'Sjsgrgzb',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际手工人工占比',
    },
  },
  Sgrgzbcy: {
    dataIndex: 'Sgrgzbcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '手工人工占比差异',
    },
  },
  Rgzbcy: {
    dataIndex: 'Rgzbcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '人工占比差异',
    },
  },
  Clzbcy: {
    dataIndex: 'Clzbcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '材料占比差异',
    },
  },
  Bzshl: {
    dataIndex: 'Bzshl',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '标准损耗率',
    },
  },
  Sjshl: {
    dataIndex: 'Sjshl',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '实际损耗率',
    },
  },
  Zshlcy: {
    dataIndex: 'Zshlcy',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '损耗率差异',
    },
  },
  ShsseH: {
    dataIndex: 'ShsseH',
    baseInfo: {
      ...getCustomValueCell(2, false, false, 10000, true, true),
      title: '实际损耗额(含损耗)',
    },
  },
  Shsse0: {
    dataIndex: 'Shsse0',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际损耗额(零损耗)',
    },
  },
  Bzfqxlkh: {
    dataIndex: 'Bzfqxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准分切效率(K/H)',
    },
  },
  Bzmqxlkh: {
    dataIndex: 'Bzmqxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准模切效率(K/H)',
    },
  },
  Bzsgxlkh: {
    dataIndex: 'Bzsgxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准手工效率(K/H)',
    },
  },
  Bzbzxlkh: {
    dataIndex: 'Bzbzxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准包装效率(K/H)',
    },
  },
  Sjfqxlkh: {
    dataIndex: 'Sjfqxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际分切效率(K/H)',
    },
  },
  Sjmqxlkh: {
    dataIndex: 'Sjmqxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际模切效率(K/H)',
    },
  },
  Mqxldc: {
    dataIndex: 'Mqxldc',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '模切效率达成',
    },
  },
  Sjsgxlkh: {
    dataIndex: 'Sjsgxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际手工效率(K/H)',
    },
  },
  Sgxldc: {
    dataIndex: 'Sgxldc',
    baseInfo: {
      ...getCustomValueCell(1, true, true),
      title: '手工效率达成',
    },
  },
  Sjbzxlkh: {
    dataIndex: 'Sjbzxlkh',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际包装效率（K/H)',
    },
  },
  zzrgcs: {
    dataIndex: 'zzrgcs',
    baseInfo: {
      title: '工程师(责任工程师)',
    },
  },
  Zxlxm: {
    dataIndex: 'Zxlxm',
    baseInfo: {
      title: '新老项目',
    },
  },
  Verid: {
    dataIndex: 'Verid',
    baseInfo: {
      width: 140,
      title: '生产版本',
    },
  },
  Stlal: {
    dataIndex: 'Stlal',
    baseInfo: {
      width: 140,
      title: 'BOM版本',
    },
  },
  Zrr: {
    dataIndex: 'Zrr',
    baseInfo: {
      title: '责任人',
    },
  },
  Abtei: {
    dataIndex: 'Abtei',
    baseInfo: {
      title: '业务范围',
    },
  },
  Werks: {
    dataIndex: 'Werks',
    baseInfo: {
      title: '小厂',
    },
  },
  Dispo: {
    dataIndex: 'Dispo',
    baseInfo: {
      title: 'MRP 控制',
    },
  },
  Isbian: {
    dataIndex: 'Isbian',
    baseInfo: {
      title: '是否纳入边贡',
    },
  },
  Bzfqgs: {
    dataIndex: 'Bzfqgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准分切工时',
    },
  },
  Bzmqgs: {
    dataIndex: 'Bzmqgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准模切工时',
    },
  },
  Bzsggs: {
    dataIndex: 'Bzsggs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准手工工时',
    },
  },
  Bzbzgs: {
    dataIndex: 'Bzbzgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准包装工时',
    },
  },
  Bzgshj: {
    dataIndex: 'Bzgshj',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '标准工时合计',
    },
  },
  Sjfqgs: {
    dataIndex: 'Sjfqgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际分切工时',
    },
  },
  Sjmqgs: {
    dataIndex: 'Sjmqgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际模切工时',
    },
  },
  Sjsggs: {
    dataIndex: 'Sjsggs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际手工工时',
    },
  },
  Sjbzgs: {
    dataIndex: 'Sjbzgs',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际包装工时',
    },
  },
  Sjgshj: {
    dataIndex: 'Sjgshj',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '实际工时合计',
    },
  },
  Zmfcb: {
    dataIndex: 'Zmfcb',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '免费材料成本',
    },
  },
  Zsjclcb: {
    dataIndex: 'Zsjclcb',
    baseInfo: {
      ...getCustomValueCell(2),
      title: '含免费料实际材料成本',
    },
  },
  Zclsjsh: {
    dataIndex: 'Zmfcb',
    baseInfo: {
      ...getCustomValueCell(2, true, true),
      title: '含免费料实际损耗',
    },
  },
  Cpx: {
    dataIndex: 'Cpx',
    baseInfo: {
      title: '产品线',
    },
  },
  Provider: {
    dataIndex: 'Provider',
    baseInfo: {
      title: '提供人',
    },
  },
  Analysis: {
    dataIndex: 'Analysis',
    baseInfo: {
      title: '原因分析',
    },
  },
  Measures: {
    dataIndex: 'Measures',
    baseInfo: {
      title: '改善对策',
    },
  },
  Other1: {
    dataIndex: 'Other1',
    baseInfo: {
      title: '通用1',
    },
  },
  Other2: {
    dataIndex: 'Other2',
    baseInfo: {
      title: '通用2',
    },
  },
  Other3: {
    dataIndex: 'Other3',
    baseInfo: {
      title: '通用3',
    },
  },
  Other4: {
    dataIndex: 'Other4',
    baseInfo: {
      title: '通用4',
    },
  },
  Other5: {
    dataIndex: 'Other5',
    baseInfo: {
      title: '通用5',
    },
  },
  LargeProject: {
    dataIndex: 'LargeProject',
    baseInfo: {
      title: '大项目',
    },
  },
  ModifieTime: {
    dataIndex: 'ModifieTime',
    baseInfo: {
      title: '更新时间',
    },
  },
  ModifiedBy: {
    dataIndex: 'ModifiedBy',
    baseInfo: {
      title: '更新人',
    },
  },
};
