import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// // 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('status.yes') },
  { id: 0, fullName: t('status.no') },
];
export const columns: BasicColumn[] = [
  { title: '批次', dataIndex: 'BatchNo', align: 'center' },
  { title: '物料编号', dataIndex: 'ProductCode', width: 200, align: 'center' },
  { title: '计划单号', dataIndex: 'PlanNumber', width: 160, align: 'center' },
  { title: '计划数量(K)', dataIndex: 'PlansQuantitySum', align: 'center' },
  { title: '工单编号', dataIndex: 'WorkOrderNo', width: 160, align: 'center' },
  { title: '工单数量(K)', dataIndex: 'WorkOrderQuantitySum', align: 'center' },
  { title: '工序', dataIndex: 'ProcessName', align: 'center' },
  { title: '机台号', dataIndex: 'MachineNo', align: 'center' },
  { title: '班次', dataIndex: 'ClassesStr', align: 'center' },
  { title: '操作员名称', dataIndex: 'OperatorName', width: 240, align: 'center' },
  { title: '操作时间', dataIndex: 'ProduceDate', align: 'center', format: 'date|YYYY/MM/DD' },
  { title: '厂区', dataIndex: 'FactoryName', align: 'center' },
];

export const subColumns: BasicColumn[] = [
  // { title: '工序状态', dataIndex: 'Status', width: 180 },
  { title: '线体', dataIndex: 'LineName' },
  { title: '模切工名称', dataIndex: 'DieCutterName', width: 180 },
  { title: '操作员名称', dataIndex: 'OperatorName', width: 240 },
  { title: '数量(K)', dataIndex: 'Quantity', width: 180 },
  { title: '良品数(K)', dataIndex: 'GoodProductsQuantity', width: 180 },
  { title: '不良品数(K)', dataIndex: 'BadProductsQuantity', width: 180 },
  { title: '工时(H)', dataIndex: 'WorkingHours', width: 180 },
  { title: '工单数量(K)', dataIndex: 'WorkOrderQuantity', width: 180 },
  { title: '材料规格', dataIndex: 'MaterialSpecs', width: 180 },
  { title: '材料供应商', dataIndex: 'MaterialSupplier', width: 180 },
  { title: '材料批次', dataIndex: 'MaterialBatch', width: 180 },
  { title: '材料生产日期', dataIndex: 'MaterialProductionDate', width: 180 },
  { title: '材料有效日期', dataIndex: 'MaterialEffectiveDate', width: 180 },
  { title: '数量', dataIndex: 'MaterialQuantity', width: 180 },
  { title: '唯一码', dataIndex: 'UniqueCode', width: 180 },
  { title: '创建时间', dataIndex: 'CreatorTime', width: 180, format: 'date|YYYY/MM/DD' },

  // { title: '当班计划数(K)', dataIndex: 'PlansQuantity', width: 180 },
  // { title: '产品生产日期', dataIndex: 'ProductionDate', width: 180 },
  // { title: '标签数(PCS)', dataIndex: 'TagsQuantityPcs', width: 180 },
  // { title: '每张数量(PCS)', dataIndex: 'SheetQuantity', width: 180 },
  // { title: '扫料备注', dataIndex: 'Remark', width: 180 },
  // { title: '产品生产批次', dataIndex: 'ProductionBatch', width: 180 },
];

// 更换国际化的格式转化
export function formatI18nVxe(list) {
  return list;
}
