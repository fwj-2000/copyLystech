import { SearchFormValueType, DefaultSearchFormValueType } from '/@/views/dashboard/operate/types';
import { BasicColumn } from '/@/components/Table';

interface IBaseInfo extends BasicColumn {
  type?: ETableCellSlotType; // 表格项插槽类型
  path?: string; // 路由跳转路径
  cssStyle?: string; // 额外的css样式
  routePath?: string;
  getRouteParams?: (searchFormValue: any, record: any) => {};
}
// 表头动态配置项
export interface IColumnsOption {
  baseInfo?: IBaseInfo;
  dataIndex?: string;
  sortable?: boolean; // 是否可排序
}

// 前端定义模块的key
export enum EModules {
  ATTENDANCE = 'attendance', // 出勤概况
  UPTIME = 'uptime', // 开机率
  MQACHIEVE = 'mqachieve', // 模切达成
  AOIDATA = 'aoidata', // AOI数据
  OEE = 'oee', // oee数据
  OUTPUTVALUE = 'outputvalue', // 产值数据
  PROCESSYIELD = 'processyield', // 制程良率数据
  FINANCEECONOMIC = 'financeeconomic', // 边贡数据
  MATERIAL_LOSS = 'materialLoss', // 材料损耗数据
  ARTIFICIAL = 'artificial', // 人工数据
  TIME_UTILIZATION_RATE = 'timeUtilizationRate', // 时间稼动率数据
  QUALITY_AUDIT = 'qualityAudit', // 品质稽核
  EXPENSE = 'expense', // 费用
  PRODUCTION = 'production', // 产销
  WORKLOSS38RANK = 'workorderloss38rank', //3.8损失排名
  MPF = 'ModularPerformance', //模切绩效
}
// 表格项插槽类型
export enum ETableCellSlotType {
  RANKING = 'ranking',
  LINK = 'link',
}

// 获取表格配置信息的参数
export interface IGetColumnsOptionsParams {
  columns: IColumnsOption[];
  searchFormValue?: SearchFormValueType;
  dataSource?: Recordable<any>[];
}

// 单个页面配置信息
export interface IPageInfo {
  defaultSearchFormValue?: DefaultSearchFormValueType; // 额外搜索条件的默认值，有必传
  getColumnsOptions: (params: { itemName: String; dataSource: Recordable<any>[]; searchFormValue: SearchFormValueType }) => IColumnsOption[]; // 表格字段配置
  api: (queryParams: any, searchFormValue: SearchFormValueType) => Promise<any>; // 表格请求接口
}

// 排行层级
export enum EOrgLevel {
  BU = '3',
  SBU = '4',
}

// 开机率排名指标
export enum EUptimeRank {
  ONLINE_RATE = '联线率排名',
  WORKING_RATE = '开线率排名',
}

// 模切达成排名指标
export enum EMqAchieveRank {
  BATCH_ACHIEVE_RATE = '批次达成率排名',
  QTY_ACHIEVE_RATE = '数量达成率排名',
}

// AOI排名指标
export enum EAOIRank {
  LIANJILV = '联机率排名',
  KAIJILV = '开机率排名',
  CHANPINGJIADONGLV = '稼动率排名',
  LIANGLV = '良率排名',
}

// OEE排名指标
export enum EOEERank {
  OEE = 'OEE排名',
  TIME_UTILIZATION_RATE = '时间稼动率排名',
  PERFORMANCE_UTILIZATION = '性能利用率排名',
  DIE_CUTTING_YIELD = '模切良率排名',
}

// 产值排名指标
export enum EOutputRank {
  OUTPUT = '总产值排名',
  PER_CAPITA_OUTPUT = '人均产值排名',
  SHIPMENT = '出货排名',
  SALES_RATE = '产销率排名',
}

// 制程良率排名指标
export enum EProcessYieldRank {
  DIE_CUTTING_YIELD = '模切良率排名',
  AOI_YIELD = 'AOI良率排名',
  MANUAL_YIELD = '手工良率排名',
  STATEMENT_YIELD = '结单良率排名',
}

// 边贡排名指标
export enum EBengonRank {
  THE_ACTUAL_TRIBUTE_RATE = '实际边贡率排名',
  THE_ACHIEVEMENT_RATE_OF_BENGON = '边贡达成率排名',
  THE_LOSS_OF_THE_BORDER_TRIBUTE = '边贡损失额排名',
}

// 人工排名指标
export enum EArtificialRank {
  DIE_CUTTING_EFFICIENCY_ACHIEVEMENT_RATE = '模切效率达成率排名',
  ACHIEVEMENT_RATE_OF_MANUAL_EFFICIENCY = '手工效率达成率排名',
  ACTUAL_LABOR_PERCENTAGE = '实际人工损失额排名',
}

// 材料损耗排行指标
export enum ELostRank {
  ACTUAL_ATTRITION_RATE = '实际损耗率排名',
  THE_AMOUNT_OF_LOSS_AND_LOSS = '损耗超损额排名',
  ACTUAL_MATERIAL_PERCENTAGE = '实际材料占比排名',
}

// 时间稼动率排名指标
export enum EUtilizationRank {
  TIME_UTILIZATION_RATE = '时间稼动率排名',
  LOWER30 = '低于30%计划数排名',
}

// 品质稽核排名指标
export enum EQualityAuditRank {
  FAI = 'FAI直通率排名',
  FQC = 'FQC直通率排名',
  LOW_QUESTIONS = '低级问题排名',
  GENERAL_QUESTIONS = '常规问题排名',
}

// 费用排名指标
export enum EExpenseRank {
  OUTPUT_VALUE = '入库产值排名',
  EXPENSE = '费用管理占比排名',
  SCRAP_COSTS = '报废成本占比排名',
  REVERSE_DEDUCTION = '倒扣产值占比排名',
}

// 产销汇总排名指标
export enum EProductionRank {
  OUTPUT_VALUE = '实际产值排行',
  ACTUAL_SHIPMENT = '实际出货排行',
  PRODUCTION_AND_SALES_RATE = '实际产销率排行',
}
