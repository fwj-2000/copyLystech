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
    dataIndex: 'Cpx',
  },
  {
    dataIndex: 'DatasourceTime',
    title: '抽数时间',
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
];

// 上传按钮配置
export const uploadButtonList = [
  {
    api: '/api/report/dimension/importanalysis',
    buttonText: '原因分析导入',
  },
];

// 模版下载配置
export const templateDownloadList = [
  {
    fileName: '成品编号维度导入模板',
  },
  {
    fileName: '订单号维度导入模板',
  },
  {
    fileName: '大项目导入模板',
  },
  {
    fileName: '原因分析导入模板',
  },
];
