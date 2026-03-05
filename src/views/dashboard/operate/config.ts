import dayjs from 'dayjs';
import { IOptions } from './types';

const TRUE_STR_LIST = ['true', 't'];
// 明细字段名和key的映射
export const TABLE_DETAIL_FIELD_DICTIONARY_MAPPING = {
  // 时间稼动率异常表格
  MachineNo: { width: 124, title: '机台号' },
  RunTime: { title: '运行时长(min)' },
  DownTime: { title: '停机时长(min)' },
  TotalTime: { title: 'Total(min)' },
  UtilizationRate: { title: '稼动率(%)' },
  DownCount: { title: '停机次数(min)' },
  Factory: { title: '厂区' },
  EntDate: { title: '日期', customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD') },
  IsNud: { title: 'NUD专线', customRender: ({ text }) => (TRUE_STR_LIST.includes(text.toLowerCase()) ? '是' : '否') },
  IsNpi: { title: 'NPI项目', customRender: ({ text }) => (TRUE_STR_LIST.includes(text.toLowerCase()) ? '是' : '否') },
  FTeam: { title: '班次' },
  MachineType: { title: '类型' },
  FMRP: { title: 'MRP控制者' },
  FProduct: { title: '产品名' },
  FPlanNumber: { title: '计划单号' },
  FManuorder: { title: '工单号' },
  Remark: { title: '未达标原因' },

  // 性能利用率异常表格
  UseRate: { title: '性能利用率(%)' },
  ActOutput: { title: '实际产出(PCS)' },
  StaUph: { title: '标准UPH(K/H)' },
  StaSpeed: { title: '标准速度(米/分)' },
  AvgSpeed: { title: '平均速度(米/分)' },

  // 模切良率异常
  MQYield: { title: '模切良率(%)' },
  StaOutput: { title: '标准产出(PCS)' },

  // 开机率
  IsNUD: { title: '专用线体' },
  MachineDetails: { title: '机台明细' },
  MachineNum: { title: '线体机台数' },
  Classify: { title: '主辅分类' },
  UseState: { title: '使用状态' },
  Floor: { title: '楼层' },
  IsWorking: { title: '是否开机' },
  IsOnline: { title: '是否联机' },
  Runtime: { title: '总运行时长(Min)' },
  DRuntime: { title: '白班运行时长(Min)' },
  NRuntime: { title: '晚班运行时长(Min)' },

  // 模切达成
  Fteam: { title: '班次' },
  EmpNo: { title: '操作员工号' },
  EmpName: { title: '姓名' },
  FPlanQty: { title: '计划数量(PCS)' },
  Qty: { title: '生产数量(PCS)' },
  AchieveRate: { title: '达成率(%)' },

  // AOI稼动
  Mnumber: { title: '机台号' },
  AOIMark: { title: '设备类型' },
  KaijiTypes: { title: '开机类型' },
  LianjiTypes: { title: '联机类型' },
  Wastime: { title: '损耗时长(Min)' },
  Speed: { title: '速度(M/S)' },
  Jiadonglv: { title: '稼动率' },
  GQty: { title: '良品数(PCS)' },
  BQty: { title: '不良品数(PCS)' },
  Lianglv: { title: '良率(%)' },

  // 客诉
  OccurTime: { title: '发生时间' },
  CloseTime: { title: '关闭时间' },
  Customer: { title: '客户名称' },
  Severity: { title: '严重程度' },
  Causes: { title: '原因分析' },
  Emergency: { title: '紧急措施' },
  Correction: { title: '纠正措施' },
  Prevention: { title: '预防措施' },

  // 产值
  OrgName: { title: '厂区' },
  FQty: { title: '入库数' },
  FValue: { title: '产值' },

  // 手工明细
  ProdNo: { title: '产品名' },
  Is985: { title: '是否985项目' },
  GoodQty: { title: '良品数(PCS)' },
  BadQty: { title: '不良品数(PCS)' },

  // 结单良率详情
  StateDate: { title: '结单日期', customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD') },
  InstockQty: { title: '入库数(PCS)' },

  // 稽核问题点明细.
  Project: { title: '项目' },
  MRP: { title: '控制者' },
  FClass: { title: '班次' },
  LiableUnit: { title: '责任单位' },
  LiablePerson: { title: '责任人工号' },
  Fname: { title: '责任人姓名' },
  Fstate: { title: '状态' },
  Process: { title: '稽核工序' },
  Category: { title: '异常项' },
  ProblemType: { title: '问题类型' },
  Describe: { title: '问题描述' },
  Analysis: { title: '分析和改善' },
  CompleteTime: { title: '完成时间' },

  // 首件明细
  FType: { title: '生产类型' },
  FManuOrder: { title: '工单号' },
  Operator: { title: '操作员' },
  OperatorName: { title: '操作员姓名' },
  Area: { title: '区域' },
  JudgeResult: { title: '检测结果' },
  UserNum: { title: '检测人' },
  UserName: { title: '检测人姓名' },
  AuditState: { title: '审核状态' },
  AuditorNum: { title: '审核人' },
  AuditName: { title: '审核人姓名' },
  SendInspectTime: { title: '送检时间' },
  ReplyTime: { title: '回复时间' },
  CheckTime: { title: '检测时间' },
  Apperanceremark: { title: '外观NG备注' },
  Sizeremark: { title: '尺寸NG备注' },
  Pcs: { title: 'PCS/模' },
  InspectNum: { title: '外观检测数' },
  MeasureNum: { title: '尺寸检测数' },

  // FQC明细
  Result: { title: '尺寸检测数' },
  FPassinreviewno: { title: '被检单据' },
  FProductLot: { title: '批次号' },
  FProductiongroup: { title: '组别' },
  CheckerNo: { title: 'FQC工号' },
  CheckerName: { title: 'FQC姓名' },
  FName: { title: '被检人' },
  MQOperator: { title: '模切操作员' },
  AOIOperator: { title: '自动化操作员' },
  AQL: { title: 'AQL' },
  SampleQty: { title: '抽样数(PCS)' },
  BigFname: { title: '检测大类' },
  SmallFname: { title: '检测小类' },
  QA确认: { title: 'QA确认' },
  CreateTime: { title: '创建时间' },
};

export enum EPersonnelDetailStatus {
  ABSENCE = '0',
  ATTENDANCE = '1',
  INCUMBENCY = '2',
}

// 人员明细状态下拉选项配置
export const PERSONNEL_DETAIL_STATUS_OPTIONS: IOptions[] = [
  { label: '缺勤', value: EPersonnelDetailStatus.ABSENCE },
  { label: '出勤', value: EPersonnelDetailStatus.ATTENDANCE },
  { label: '在职', value: EPersonnelDetailStatus.INCUMBENCY },
];
