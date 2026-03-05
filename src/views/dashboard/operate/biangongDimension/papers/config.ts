// 前端显示配置
import { BasicColumn } from '/@/components/Table';

// 是否纳入边贡
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

// 表格项插槽类型
export enum ETableCellSlotType {
  LINK = 'link',
}

// 表头动态配置项
export interface IColumnsOption {
  baseInfo: BasicColumn;
  dataIndex: string;
  sortable?: boolean; // 是否可排序
  filterable?: boolean; // 是否可筛选
  isRowSpan?: boolean; // 是否开启合并单元格
}

// 周维度字段
export const columnsOptions: BasicColumn[] = [
  {
    dataIndex: 'Status',
    title: 'Sap状态',
  },
  {
    dataIndex: 'Year',
    title: '年份',
  },
  {
    dataIndex: 'EntdateQ',
    title: '季度',
  },
  {
    dataIndex: 'BuName',
    title: 'bu',
  },
  {
    dataIndex: 'EntdateMo',
    title: '核算月份',
  },
  {
    dataIndex: 'EntdateWk',
    title: '周期',
  },
  {
    dataIndex: 'Budat',
    title: '工单技术关闭日期',
  },
  {
    dataIndex: 'Idat2a',
    title: '下达日期',
  },
  {
    dataIndex: 'Factory',
    title: '厂区',
  },
  {
    dataIndex: 'WorkShop',
    title: '车间',
  },
  {
    dataIndex: 'Auart',
  },
  {
    dataIndex: 'AuartDm',
  },
  {
    dataIndex: 'Aufnr',
    title: '订单号',
  },
  {
    dataIndex: 'Matnr',
    title: '成品编码',
  },
  {
    dataIndex: 'Zj10m',
    title: '十码',
  },
  {
    dataIndex: 'Zj6m',
    title: '中间6码',
  },
  {
    dataIndex: 'Znbxm',
    title: '内部项目',
  },
  {
    dataIndex: 'Xxm',
    title: '小项目',
  },
  {
    dataIndex: 'Zzdkh',
    title: '客户划分类型',
  },
  {
    dataIndex: 'Zcplb',
    title: '产品类别',
  },
  {
    dataIndex: 'Bom',
    title: '是否有BOM',
  },
  {
    dataIndex: 'Gamng',
    title: '订单数量',
  },
  {
    dataIndex: 'Wemnga',
    title: '良品入库数量',
  },
  {
    dataIndex: 'Sj',
    title: '产值单价',
  },
  {
    dataIndex: 'Zcpcz',
    title: '成品产值',
  },
  {
    dataIndex: 'Zbjzcb',
    title: '标准总成本(含损耗)',
  },
  {
    dataIndex: 'Bzbge',
    title: '标准-边贡额',
  },
  {
    dataIndex: 'Bzzz',
    title: '标准变动制费合计',
  },
  {
    dataIndex: 'Zmbcb',
    title: '标准零损耗材料成本',
  },
  {
    dataIndex: 'Zbzcb2',
    title: '标准含损耗材料成本',
  },
  {
    dataIndex: 'Szjrg',
    title: '标准-直接人工',
  },
  {
    dataIndex: 'Bzbdzf',
    title: '标准-其他变动制费',
  },
  {
    dataIndex: 'Smjf',
    title: '标准-变动模具费',
  },
  {
    dataIndex: 'Bzgdzz',
    title: '标准-固定制费',
  },
  {
    dataIndex: 'Zsjzcb',
    title: '实际总成本',
  },
  {
    dataIndex: 'Sjbge',
    title: '实际边贡额',
  },
  {
    dataIndex: 'Bgsse',
    title: '边贡损失额',
  },
  {
    dataIndex: 'Sjzf',
    title: '实际变动制费合计',
  },
  {
    dataIndex: 'Zsjje',
    title: '实际材料成本',
  },
  {
    dataIndex: 'ZZjrg',
    title: '实际-直接人工',
  },
  {
    dataIndex: 'Sjbdzf',
    title: '实际-其他变动制费',
  },
  {
    dataIndex: 'ZMjf',
    title: '实际-变动模具费',
  },
  {
    dataIndex: 'Sjgdzf',
    title: '实际-固定制费',
  },
  {
    dataIndex: 'Bzdwcb',
    title: '标准单位成本',
  },
  {
    dataIndex: 'Sjdwcb',
    title: '实际单位成本',
  },
  {
    dataIndex: 'Pccdwclcb0sh',
    title: '标准单位材料成本(0损耗)',
  },
  {
    dataIndex: 'PccdwclcbHsh',
    title: '标准单位材料成本(含损耗)',
  },
  {
    dataIndex: 'Sjcldwcb',
    title: '实际单位材料成本',
  },
  {
    dataIndex: 'Bzrgdwcb',
    title: '标准单位人工成本',
  },
  {
    dataIndex: 'Sjrgdwcb',
    title: '实际单位人工成本',
  },
  {
    dataIndex: 'Shsse0',
    title: '标准材料损失',
  },
  {
    dataIndex: 'ShsseH',
    title: '实际材料损失',
  },
  {
    dataIndex: 'Zclcs',
    title: '材料超损',
  },
  {
    dataIndex: 'Rgsse',
    title: '人工损失',
  },
  {
    dataIndex: 'Bzmle',
    title: '标准毛利额',
  },
  {
    dataIndex: 'Sjmle',
    title: '实际毛利额',
  },
  {
    dataIndex: 'Mlecy',
    title: '毛利额差异',
  },
  {
    dataIndex: 'Bzmll',
    title: '标准毛利率',
  },
  {
    dataIndex: 'Sjmll',
    title: '实际毛利率',
  },
  {
    dataIndex: 'Zmlvcy',
    title: '毛利率差异',
  },
  {
    dataIndex: 'Bzbgl',
    title: '标准边贡率',
  },
  {
    dataIndex: 'Sjbgl',
    title: '实际边贡率',
  },
  {
    dataIndex: 'Zbglcy',
    title: '边贡率差异',
  },
  {
    dataIndex: 'Bgdcl',
    title: '边贡达成率',
  },
  {
    dataIndex: 'Bzclzb',
    title: '标准材料占比',
  },
  {
    dataIndex: 'Sjclzb',
    title: '实际材料占比',
  },
  {
    dataIndex: 'Clzbcy',
    title: '材料占比差异',
  },
  {
    dataIndex: 'Bzrgzb',
    title: '标准人工占比',
  },
  {
    dataIndex: 'Sjrgzb',
    title: '实际人工占比',
  },
  {
    dataIndex: 'Rgzbcy',
    title: '人工占比差异',
  },
  {
    dataIndex: 'Bzmqrgzb',
  },
  {
    dataIndex: 'Sjmqrgzb',
  },
  {
    dataIndex: 'Mqrgzbcy',
  },
  {
    dataIndex: 'Bzsgrgzb',
  },
  {
    dataIndex: 'Sjsgrgzb',
  },
  {
    dataIndex: 'Sgrgzbcy',
  },
  {
    dataIndex: 'Bzshl',
    title: '标准损耗率',
  },
  {
    dataIndex: 'Sjshl',
    title: '实际损耗率',
  },
  {
    dataIndex: 'Zshlcy',
    title: '损耗率差异',
  },
  {
    dataIndex: 'Bzfqxlkh',
    title: '标准分切效率(K/H)',
  },
  {
    dataIndex: 'Bzmqxlkh',
    title: '标准模切效率(K/H)',
  },
  {
    dataIndex: 'Bzsgxlkh',
    title: '标准手工效率(K/H)',
  },
  {
    dataIndex: 'Bzbzxlkh',
    title: '标准包装效率(K/H)',
  },
  {
    dataIndex: 'Sjfqxlkh',
    title: '实际分切效率(K/H)',
  },
  {
    dataIndex: 'Sjmqxlkh',
    title: '实际模切效率(K/H)',
  },
  {
    dataIndex: 'Mqxldc',
    title: '模切效率达成',
  },
  {
    dataIndex: 'Sjsgxlkh',
    title: '实际手工效率(K/H)',
  },
  {
    dataIndex: 'Sgxldc',
    title: '手工效率达成',
  },
  {
    dataIndex: 'Sjbzxlkh',
  },
  {
    dataIndex: 'Zzrgcs',
    title: '工程师',
  },
  {
    dataIndex: 'Zxlxm',
    title: '新老项目',
  },
  {
    dataIndex: 'Verid',
    title: '生产版本',
  },
  {
    dataIndex: 'Stlal',
  },
  {
    dataIndex: 'Zrr',
    title: '车间责任人',
  },
  {
    dataIndex: 'Abtei',
    title: '业务范围',
  },
  {
    dataIndex: 'Werks',
    title: '工厂',
  },
  {
    dataIndex: 'Dispo',
    title: 'MRP控制者',
  },
  {
    dataIndex: 'Isbian',
    title: '是否纳入边贡指标',
  },
  {
    dataIndex: 'Bzfqgs',
    title: '标准分切工时',
  },
  {
    dataIndex: 'Bzmqgs',
    title: '标准模切工时',
  },
  {
    dataIndex: 'Bzsggs',
    title: '标准手工工时',
  },
  {
    dataIndex: 'Bzbzgs',
    title: '标准包装工时',
  },
  {
    dataIndex: 'Bzgshj',
    title: '标准工时合计',
  },
  {
    dataIndex: 'Sjfqgs',
    title: '实际分切工时',
  },
  {
    dataIndex: 'Sjmqgs',
    title: '实际模切工时',
  },
  {
    dataIndex: 'Sjsggs',
    title: '实际手工工时',
  },
  {
    dataIndex: 'Sjbzgs',
    title: '实际包装工时',
  },
  {
    dataIndex: 'Sjgshj',
    title: '实际工时合计',
  },
  {
    dataIndex: 'Zmfcb',
  },
  {
    dataIndex: 'Zsjclcb',
  },
  {
    dataIndex: 'Zclsjsh',
  },
  {
    dataIndex: 'Cpx',
  },
  {
    dataIndex: 'ModifieTime',
    title: '更新时间',
  },
  {
    dataIndex: 'ModifiedBy',
    title: '更新人',
  },
  {
    dataIndex: 'Provider',
  },
  {
    dataIndex: 'Analysis',
  },
  {
    dataIndex: 'Measures',
  },
  {
    dataIndex: 'Other1',
  },
  {
    dataIndex: 'Other2',
  },
  {
    dataIndex: 'Other3',
  },
  {
    dataIndex: 'Other4',
  },
  {
    dataIndex: 'Other5',
  },
  {
    dataIndex: 'LargeProject',
  },
];

// 上传按钮配置
export const uploadButtonList = [
  {
    api: '/api/report/dimension/importother',
    buttonText: '成品编号维度导入',
  },
  {
    api: '/api/report/dimension/importorder',
    buttonText: '订单号维度导入',
  },
  {
    api: '/api/report/dimension/ImportDimProject',
    buttonText: '大项目导入',
  },
];

// 模版下载配置
export const templateDownloadList = [
  {
    fileName: '维度底稿导入模板',
  },
  {
    fileName: '成品编号维度导入模板',
  },
  {
    fileName: '订单号维度导入模板',
  },
  {
    fileName: '月损益成本或工单成本通用模板',
  },
  {
    fileName: '全码最新结单工厂模板',
  },
  {
    fileName: '六码最新结单工厂模板',
  },
  {
    fileName: '大项目导入模板',
  },
];

// 未维护数据下载配置
export const noMaintenanceDownloadList = [
  {
    fileName: '成品编号维度',
    exportDim: 0,
  },
  {
    fileName: '订单号维度',
    exportDim: 1,
  },
  {
    fileName: '大项目维度',
    exportDim: 2,
  },
];

// 上传按钮配置
export const statisticButtonList = [
  {
    api: '/api/report/dimension/UnitCost',
    buttonText: '月损益成本',
    downloading: true,
  },
  {
    api: '/api/report/dimension/WorkOrderCost',
    buttonText: '工单成本',
    downloading: true,
  },
  {
    api: '/api/report/dimension/QueryLatestFactory',
    buttonText: '全码最新结单工厂',
    downloading: true,
  },
  {
    api: '/api/report/dimension/QueryLatestFactorySixCode',
    buttonText: '六码最新结单工厂',
    downloading: true,
  },
];

// SAP状态更新
export const sapOptions = [
  {
    label: '反接收',
    value: '1',
  },
  {
    label: '已接收',
    value: '2',
  },
  {
    label: '已结算',
    value: '3',
  },
  {
    label: '反结算',
    value: '4',
  },
];
