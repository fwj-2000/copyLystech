// 前端定义的管理模块的label
export enum EManagementModulesLabel {
  ALL = '运营日报',
  PERSONNEL = '人员管理',
  EQUIPMENT = '设备管理',
  TICKETS = '工单管理',
  OUTPUT = '产销存管理',
  STATUS_ACHIEVED = '达成状况',
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

// 前端定义的设备管理模块的label
export enum EEquipmentManagementModulesLabel {
  CONNECTION_RATE = '联线率',
  OPEN_LINE_RATE = '开线率',
  TIME_UTILIZATION_RATE = '时间稼动率',
  COMMON_AOI = '通用AOI',
  DEDICATED_AOI = '专用AOI',
  ALL_AOI = 'AOI汇总',
}
