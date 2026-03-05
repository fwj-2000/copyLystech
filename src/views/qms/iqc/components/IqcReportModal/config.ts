import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 基础信息
export const BASICINFOCOLS = [
  { title: '检验日期', dataIndex: 'testTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
  { title: '班次', dataIndex: 'classesName' },
  { title: '供应商名称', dataIndex: 'supplierName' },
  { title: '采购单号', dataIndex: 'purchaseNo' },
  { title: 'IQC单号', dataIndex: 'testNo' },
  { title: '材料归属', dataIndex: 'materialTypeBigName' },
  { title: '材料类型', dataIndex: 'materialTypeName' },
  { title: '来料总数', dataIndex: 'materialInCount' },
  { title: '来料单位', dataIndex: 'materialInUnit' },
  { title: '来料日期', dataIndex: 'materialInDate', format: 'date|YYYY-MM-DD' },
  { title: '内部物料编码', dataIndex: 'innerMaterialCode' },
  { title: '内部物料描述', dataIndex: 'innerMaterialDescription' },
];

// 其他信息
export const OTHERINFOCOLS = [
  { title: '检验员', dataIndex: 'testUserName' },
  { title: '最终检测结果', dataIndex: 'testResult' },
  { title: '审核人', dataIndex: 'auditUserName' },
  { title: '审核结果', dataIndex: 'auditResultName' },
  { title: 'MRB单号', dataIndex: 'mrbNo' },
  { title: 'MRB结果', dataIndex: 'mrbReviewResultName' },
];

// 检验批信息common.inspectionInfo
export const INSPECTIONINFO_COLUMNS: VxeGridPropTypes.Columns = [
  { title: 'Lot No', field: 'lotNo' },
  { title: '内部物料编码', field: 'innerMaterialCode' },
  { title: '内部物料描述', field: 'innerMaterialDescription' },
  { title: '供应商', field: 'supplierName' },
  { title: '供应商编号', field: 'supplierNo' },
  { title: '来料数量', field: 'materialInCount' },
  { title: '采购单号', field: 'purchaseNo' },
  {
    title: '来料日期',
    field: 'materialInDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  { title: '来料单位', field: 'materialInUnit' },
];

export const RESULT_OPTIONS = [
  { id: 'OK', fullName: 'OK', theme: 'green' }, // ok
  { id: 'NG', fullName: 'NG', theme: 'red' }, // ng
];

// 尺寸检测 common.dimensionMeasurementInfo
export const DIMENSIONMEASUREMENT_COLUMNS: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  { title: '检验项目', field: 'badName' },
  { title: '抽样数', field: 'samplingNumber' },
  { title: 'NG数', field: 'ngNumber' },
  {
    title: '检验结果',
    field: 'testResult',
    cellRender: {
      name: 'Tag',
      options: RESULT_OPTIONS,
    },
  },
  { title: '是否有报告', field: 'haveReportName', i18nField: 'haveReport' },
  { title: '附件', field: 'reportName', i18nField: 'reportPath', slots: { default: 'downloadFile' } },
];

// 外观检测
export const VISUALINSPECTION_COLUMNS: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  { title: '检验项目', field: 'badName' },
  { title: 'NG数', field: 'ngNumber' },
  { title: '备注', field: 'remark' },
  {
    title: '检验结果',
    field: 'testResult',
    cellRender: {
      name: 'Tag',
      options: RESULT_OPTIONS,
    },
  },
  { title: '外观综合判定', field: 'lastTestResult' },
];

// 包装信息
export const PACKINFOCOLS = [
  { title: t('dict.IQCApplyColumn.qualifiedSupplier'), dataIndex: 'qualifiedSupplierName' }, //是否合格供应商
  { title: t('dict.IQCApplyColumn.quantityEqual'), dataIndex: 'quantityEqualName' }, //来料数量是否与验收单一致
  { title: t('dict.IQCApplyColumn.packageQualified'), dataIndex: 'packageQualifiedName' }, //包装是否符合要求
  { title: t('dict.IQCApplyColumn.supplierCode'), dataIndex: 'supplierCode' }, //供应商编码
  { title: t('dict.IQCApplyColumn.quantityRemark'), dataIndex: 'quantityRemark' }, //数量方面备注
  { title: t('dict.IQCApplyColumn.packageRemark'), dataIndex: 'packageRemark' }, //包装方面备注
  { title: t('dict.IQCApplyColumn.attachmentList'), dataIndex: 'attachmentName' }, //上传文件
];
