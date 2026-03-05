import { SearchFormValueType, DefaultSearchFormValueType } from '/@/views/dashboard/operate/types';
import { ColumnsOption } from '/@/views/dashboard/operate/hooks/useReportPage';

// 单个页面配置信息
export interface IPageInfo {
  title: string; // 标题
  columnsOptions: ColumnsOption[]; // 表格字段配置
  defaultSearchFormValue?: DefaultSearchFormValueType; // 额外搜索条件的默认值，有必传
  api: (queryParams: any, searchFormValue: SearchFormValueType) => Promise<any>; // 表格请求接口
}

// 前端定义的管理模块的key
export enum EManagementModules {
  ALL = 'all',
  PERSONNEL = 'personnel', // 人员管理
  EQUIPMENT = 'equipment', // 设备管理
  TICKETS = 'tickets', // 工单管理
  OUTPUT = 'output', // 产销存管理
}
// 前端定义的管理模块的label
export enum EManagementModulesLabel {
  ALL = '运营日报',
  PERSONNEL = '人员管理',
  EQUIPMENT = '设备管理',
  TICKETS = '工单管理',
  OUTPUT = '产销存管理',
  STATUS_ACHIEVED = '达成状况',
}
// 前端定义的设备管理模块的label
export enum EEquipmentManagementModulesLabel {
  CONNECTION_RATE = '联线率',
  OPEN_LINE_RATE = '开线率',
  TIME_UTILIZATION_RATE = '时间稼动率',
  COMMON_AOI = '通用AOI',
  DEDICATED_AOI = '专用AOI',
  ALL_AOI = 'AOI汇总',
}

// 状况达成
export enum EStatusAchieved {
  DIE_CUTTING_IS_ACHIEVED = '模切达成',
}

// 前端定义的工单管理模块的label
export enum ETicketsManagementModulesLabel {
  MQ_RATE = '模切良率',
  AOI_RATE = 'AOI良率',
  MANUAL_YIELD = '手工良率',
  STATEMENT_YIELD = '结单良率',
  DIE_CUT_OUTPUT = '模切产出(K)',
  AOI_OUTPUT = 'AOI产出(K)',
  HAND_OUTPUT = '手工产出(K)',
  PROCESS_OUTPUT = '包装产出(K)',
  // 品质稽核
  FAI_RATE = 'FAI直通率',
  FQC_RATE = 'FQC直通率',
  NUD_RATE = 'NUD料件稽核率',
  NUD_EXECUTION_RATE = 'NUD料件执行率',
  LOW_QUESTIONS = '低级问题',
  GENERAL_QUESTIONS = '常规问题',
}

// 人员管理模块
export enum EModuleCode {
  INCUMBENCY = '1', // 在职
  ATTENDANCE = '2', // 出勤
  ATTENDANCE_RATE = '3', // 出勤率
}
