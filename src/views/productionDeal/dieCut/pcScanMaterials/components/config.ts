import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const columns: BasicColumn[] = [
  { title: '单据号', dataIndex: 'documentNumber' },
  { title: '工单编码', dataIndex: 'workOrderNo' },
  { title: '产品编码', dataIndex: 'innerMaterialNumber', width: 200 },
  { title: 'SN', dataIndex: 'snCode', width: 200 },
  { title: '物料', dataIndex: 'materialCode', width: 200 },
  { title: '规格', dataIndex: 'materialSpecs', width: 160 },
  // 材料批次
  { title: t('dict.CommonCol.materialBatches'), dataIndex: 'materialBatch', width: 120 },
  { title: '生产日期', dataIndex: 'productionDate', format: 'date|YYYY-MM-DD', width: 100 },
  { title: '标签数（PCS）', dataIndex: 'tagsQuantityPcs' },
  { title: '生产批次', dataIndex: 'productionBatch' },
  { title: '唯一码', dataIndex: 'uniqueCode' },
  { title: '备注', dataIndex: 'remark' },
  { title: '录入人', dataIndex: 'creatorUserName' },
  { title: '录入时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
];
