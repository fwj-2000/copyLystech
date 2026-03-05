// 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: '是' },
  { id: 0, fullName: '否' },
];

export const PRODUCTION_TYPE_LIST = [
  { id: 1, fullName: '自制' },
  { id: 2, fullName: '外购' },
];

// 工序级别
export const PROCESS_LEVEL_OPTIONS = [
  { id: 1, fullName: '主' },
  { id: 0, fullName: '无' },
];
export const PROCESS_LEVEL_OPTIONS_EUMN = {
  1: '主',
  0: '无',
};

// 审批状态
export const REVIEW_STATUS_OPTIONS = [
  { id: 1, fullName: '未审核', color: '#B2B2B2' },
  // { id: 2, fullName: '评审中', color: '#FF7B00' },
  { id: 2, fullName: '已审核', color: '#52C41A' },
  // { id: 3, fullName: '已废弃', color: '#FF4D4F' },
];

// 材料
export const MATERIAL_TABLE_COLUMNS = [
  { title: '材料编码', dataIndex: 'MaterialCode', key: 'MaterialCode', width: 160, compType: 'Input' },
  { title: '材料八码', dataIndex: 'MaterialEightYards', key: 'MaterialEightYards', width: 160, compType: 'Input' },
  { title: '备料信息(材料名称)', dataIndex: 'MaterialName', key: 'MaterialName', width: 160, compType: 'Input' },
  { title: '新材料', dataIndex: 'NewMaterial', key: 'NewMaterial', width: 120, compType: 'Select', options: CONDITIONAL_OPTIONS, defaultValue: 1 },
  { title: '新材料交期', dataIndex: 'NewMaterialTime', key: 'NewMaterialTime', width: 160, compType: 'Date' },
  { title: '生产类型', dataIndex: 'MaterialType', key: 'MaterialType', width: 120, compType: 'Select', options: PRODUCTION_TYPE_LIST, defaultValue: 1 },
  { title: '单位用量/pcs', dataIndex: 'MaterialDosage', key: 'MaterialDosage', width: 160, compType: 'Input' },
  { title: '用量', dataIndex: 'Qty', key: 'Qty', width: 160, compType: 'Input' },
  { title: '计量单位', dataIndex: 'MeasurementUnit', key: 'MeasurementUnit', width: 160, compType: 'Input' },
  { title: '备注', dataIndex: 'Remarks', key: 'Remarks', width: 160, compType: 'Input' },
  // { title: '材料利用率', dataIndex: 'MaterialUtilization', key: 'MaterialUtilization', width: 150, compType: 'Input' },
  // { title: '机台运行每小时用量(M)', dataIndex: 'MachineFunctionHourQty', key: 'MachineFunctionHourQty', width: 200, compType: 'Input' },
  // { title: '机台运行时间(H)', dataIndex: 'MachineFunctionTime', key: 'MachineFunctionTime', width: 160, compType: 'Input' },
  // { title: '操作', dataIndex: 'action', key: 'action', width: 50, fixed: 'right' },
] as any[];

// 硅胶
// export const SILICONE_TABLE_COLUMNS = [
//   { title: '物料代码', dataIndex: 'materialCode', key: 'materialCode', width: 160 },
//   { title: 'ScarpRate', dataIndex: 'materialCode', key: 'materialCode', width: 105 },
//   { title: 'RMCI(硅胶件)', dataIndex: 'materialCode', key: 'materialCode', width: 105 }
// ];

// 包材
// export const PACKAGE_TABLE_COLUMNS = [
//   { title: '物料代码', dataIndex: 'MaterialCode', key: 'MaterialCode', width: 160, compType: 'Input' },
//   { title: '物料名称', dataIndex: 'MaterialName', key: 'MaterialName', width: 160, compType: 'Input' },
//   { title: '计量单位', dataIndex: 'MeasurementUnit', key: 'MeasurementUnit', width: 160, compType: 'Input' },
//   { title: '单位用量', dataIndex: 'MaterialDosage', key: 'MaterialDosage', width: 160, compType: 'Input' },
//   { title: '用量', dataIndex: 'Qty', key: 'Qty', width: 160, compType: 'Input' },
//   { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
// ];

// 工序
export const PROCEDURE_TABLE_COLUMNS = [
  { title: '工序编码', dataIndex: 'ProcessCode', key: 'ProcessCode', width: 160, compType: 'Input' },
  { title: '工序名称', dataIndex: 'ProcessName', key: 'ProcessName', width: 160, compType: 'Input' },
  { title: '产能(K/H)', dataIndex: 'Capacity', key: 'Capacity', width: 120, compType: 'Input' },
  { title: '线体调机时间(H)', dataIndex: 'LineAdjustmentTime', key: 'LineAdjustmentTime', width: 120, compType: 'Input' },
  { title: '线体刀数(刀)', dataIndex: 'LineDodyKnifeQty', key: 'LineDodyKnifeQty', width: 120, compType: 'Input' },
  { title: '不良率预估(%)', dataIndex: 'DefectiveRate', key: 'DefectiveRate', width: 120, compType: 'Input' },
  { title: '工序级别', dataIndex: 'ProcessLevel', key: 'ProcessLevel', width: 120, compType: 'Select', options: PROCESS_LEVEL_OPTIONS },
  // { title: '操作', dataIndex: 'action', key: 'action', width: 50, fixed: 'right' },
] as any[];

// // 模具
// export const MOLD_TABLE_COLUMNS = [
//   { title: 'Name', dataIndex: 'MouldName', key: 'MouldName', width: 160, compType: 'Input' },
//   { title: 'Life/K', dataIndex: 'MouldLifeOrK', key: 'MouldLifeOrK', width: 160, compType: 'Input' },
//   { title: '预估模具交期', dataIndex: 'EstimatedMoldTime', key: 'EstimatedMoldTime', width: 160, compType: 'Date' },
//   { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
// ];
