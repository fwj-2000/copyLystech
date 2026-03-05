import type { TableColumns, Schemas } from './types';

import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDate } from '/@/utils/dateUtil';

const { t } = useI18n();

/**
 * 基础信息 显示数据
 */
export const baseInfoSchema: Schemas = [
  // 产品内部料号
  { field: 'insidePartNumber', label: t('dict.PCCColumn.insidePartNumber') },
  // 旧产品内部料号
  { field: 'insidePartNumberOld', label: t('dict.PCCColumn.insidePartNumberOld') },
  // 产品描述
  { field: 'productDesc', label: t('dict.PCCColumn.productDesc') },
  // { field: 'productType', label: t('dict.PCCColumn.productType') },
  // bom类型
  { field: 'bomType', label: t('dict.PCCColumn.bomType') },
  // 版本
  {
    field: 'version',
    label: t('dict.PCCColumn.version'),
    format: (v: string | number) => {
      return v !== '' ? `T${v}` : '';
    },
  },
  // 文档编号
  { field: 'docNumber', label: t('dict.PCCColumn.docNumber') },
  // 申请编号
  { field: 'applyCode', label: t('dict.PCCColumn.applyCode') },
  // 有效日期
  {
    field: 'effectiveDate',
    label: t('dict.PCCColumn.effectiveDate'),
    format: (v: string) => formatToDate(v),
  },
  // 创建人
  { field: 'creatorUserName', label: t('dict.PCCColumn.creatorUserName') },
  // 处理人
  { field: 'handlerId', label: t('dict.PCCColumn.handlerId') },
  // 备注
  { field: 'remark', label: t('dict.PCCColumn.remark') },
  // 申请人：从【样品组 - 交期回复】页面进入这个组件打印，需要打印【申请人(`applyUserName`)】
  { field: 'applyUserName', label: t('dict.CommonCol.applyUserName'), showIfHasValue: true },
  // 需求数量：从【样品组 - 交期回复】页面进入这个组件打印，需要打印【需求数量(`demandQty`)】
  { field: 'demandQty', label: t('dict.CommonCol.DemandedQuantity'), showIfHasValue: true },
];

/**
 * 生产信息 显示数据
 */
export const prodInfoSchema: Schemas = [
  // 工厂
  { field: 'factory', label: t('dict.PCCColumn.factory') },
  // 业务类型
  { field: 'businessType', label: t('dict.PCCColumn.businessType') },
  // 是否保税
  {
    field: 'isBonded',
    label: t('dict.PCCColumn.isBonded'),
    format: (v: string) => (v === 'true' ? t('common.yes') : v === 'false' ? t('common.no') : v),
  },
  // 产品类型
  { field: 'productTypeName', label: t('dict.CommonCol.productType') },
  // 产品尺寸
  { field: 'productSize', label: t('dict.PCCColumn.productSize') },
  // 产品主材尺寸
  { field: 'mainMaterialUseSize', label: t('dict.PCCColumn.mainMaterialUseSize') },
  // SAP工厂
  { field: 'sapFactory', label: t('dict.PCCColumn.sapFactory') },
  // 工作中心
  { field: 'workCenter', label: t('dict.PCCColumn.workCenter') },
  // 车间环境
  { field: 'workshopEnv', label: t('dict.PCCColumn.workshopEnv') },
];

/**
 * 工艺信息 显示数据
 */
export const technologyInfoSchema: Schemas = [
  // 模切刀数
  { field: 'numberOfKnives', label: t('dict.PCCColumn.numberOfKnives') },
  // 生产工艺
  { field: 'process', label: t('dict.PCCColumn.process') },
  // 工艺代码
  { field: 'processCode', label: t('dict.PCCColumn.processCode') },
  // 调机米数
  { field: 'adjustmentMetres', label: t('dict.PCCColumn.adjustmentMetres') },
  // 标准人力
  { field: 'standardManpower', label: t('dict.PCCColumn.standardManpower') },
  // 主要操作人员技能
  { field: 'mainOperatorSkills', label: t('dict.PCCColumn.mainOperatorSkills') },
  // 主要操作人员数量
  { field: 'mainOperatorNumber', label: t('dict.PCCColumn.mainOperatorNumber') },
  // 主要操作人员技能等级
  { field: 'auxiliaryOperatorSkills', label: t('dict.PCCColumn.auxiliaryOperatorSkills') },
  // 主要操作人员数量
  { field: 'auxiliaryOperatorNumber', label: t('dict.PCCColumn.auxiliaryOperatorNumber') },
];

/**
 * 工艺流程 表格列配置
 */
export const technologyColumns: TableColumns = [
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 45,
  },
  {
    title: t('dict.PCCColumn.productionProcess'),
    field: 'processName',
    format: (v: string, row: any) => {
      return v && v.startsWith(row.processCode) ? v : `${row.processCode}(${v})`;
    },
  },
  {
    title: t('dict.PCCColumn.adjustmentTime'),
    field: 'adjustmentTime',
    format: (v: string | number) => {
      const value = `${v}`;
      return value || '/';
    },
  },
  {
    title: t('dict.PCCColumn.capacity'),
    field: 'capacity',
  },
  {
    title: t('dict.PCCColumn.speed'),
    field: 'speed',
  },
  {
    title: t('dict.PCCColumn.speedUnit'),
    field: 'speedUnit',
  },
  {
    title: t('dict.PCCColumn.defectRate'),
    field: 'defectRate',
    format: (v: string) => (isNaN(+v) ? v : Number(v).toFixed(2)) + '%',
  },
  {
    title: t('dict.PCCColumn.isMain'),
    field: 'isMain',
    format: (v: string) => {
      v = v + '';
      return v === '1' || v === 'true' ? t('common.yes') : v === '0' || v === 'false' ? t('common.no') : v;
    },
  },
];

/**
 * 材料 - 表格列配置
 */
export const materialColumns: TableColumns = [
  // 序号
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 30,
  },
  // 步距组号
  {
    title: t('dict.PCCColumn.stepDistanceNumber'),
    field: 'stepDistanceNumber',
    format: (v: string) => {
      return v || (+v === 0 ? `${+v + 1}` : '');
    },
    width: 30,
  },
  // 材料料号
  {
    title: t('dict.PCCColumn.partNumber'),
    field: 'partNumber',
    width: 100,
  },
  // 工艺代码
  {
    title: t('dict.PCCColumn.processCode'),
    field: 'processCode',
    width: 45,
  },
  // 出货材料
  {
    title: t('dict.PCCColumn.shippingMaterial'),
    field: 'shippingMaterial',
    width: 50,
  },
  // 备料信息
  {
    title: t('dict.PCCColumn.prepareMaterialInfo'),
    field: 'prepareMaterialInfo',
    width: 50,
  },
  // 用量倍数
  {
    title: t('dict.PCCColumn.useQtyMultiple'),
    field: 'useQtyMultiple',
    width: 45,
  },
  // 用量/KPCS
  {
    title: t('dict.PCCColumn.useQty'),
    field: 'useQty',
    width: 60,
  },
  // 单位
  {
    title: t('dict.PCCColumn.unit'),
    field: 'unit',
    width: 40,
  },
  // 描述
  {
    title: t('dict.PCCColumn.description'),
    field: 'description',
  },
  // 颜色
  {
    title: t('dict.PCCColumn.color'),
    field: 'color',
    width: 50,
  },
  // 备注
  {
    title: t('dict.PCCColumn.remark'),
    field: 'remark',
    minWidth: 30,
  },
  // 分组条
  {
    title: t('dict.PCCColumn.splittingGroup'),
    field: 'splittingGroup',
    width: 50,
  },
];

/**
 * 测试条 - 表格列配置
 */
export const testStripColumns: TableColumns = [
  // 序号
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 45,
  },
  // 材料料号
  {
    title: t('dict.PCCColumn.partNumber'),
    field: 'partNumber',
    width: 180,
  },
  // 宽度(MM)
  {
    title: t('dict.PCCColumn.width'),
    field: 'width',
    width: 65,
  },
  // 产品长度(MM)
  {
    title: t('dict.SampleApplyColumn.productSizeLong'),
    field: 'length',
    width: 75,
  },
  // 数量(条)
  {
    title: t('dict.PCCColumn.qty'),
    field: 'qty',
    width: 70,
  },
  // 用量(M/工单)
  {
    title: t('dict.PCCColumn.testStripUseQty'),
    field: 'useQty',
    width: 110,
  },
  // 用途
  {
    title: t('dict.MaterialDevelopApplyColumn.purposeType'),
    field: 'testOption',
    width: 130,
  },
  // 图纸标准
  {
    title: t('dict.PCCColumn.drawingStandards'),
    field: 'drawingStandards',
    width: 70,
  },
  // TDS标准
  {
    title: t('dict.PCCColumn.tdsStandards'),
    field: 'tdsStandards',
    width: 70,
  },
  // 材料有效期(月)
  {
    title: t('dict.PCCColumn.materialEffectiveDate'),
    field: 'materialEffectiveDate',
    width: 70,
  },
  // 材料描述
  {
    title: t('dict.PCCColumn.partNumberDescription'),
    field: 'description',
    width: 130,
  },
  // 原厂商型号
  {
    title: t('dict.PCCColumn.originalModelNumber'),
    field: 'originalModelNumber',
    width: 100,
  },
  // 颜色
  {
    title: t('dict.PCCColumn.color'),
    field: 'color',
    width: 50,
  },
  // 总厚度(MM)
  {
    title: t('dict.PCCColumn.totalThickness'),
    field: 'totalThickness',
    width: 60,
  },
  // {
  //   title: t('dict.PCCColumn.color'),
  //   field: 'eightCode',
  //   width: 120,
  // },
  // {
  //   title: t('dict.PCCColumn.color'),
  //   field: 'eightCode',
  //   width: 120,
  // },
];

/**
 * 包规 & 包材 - 基础表格列配置
 */
export const packBaseColumns: TableColumns = [
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 45,
  },
  {
    title: t('dict.PCCColumn.type'),
    field: 'type',
  },
  {
    title: t('dict.PCCColumn.packQty'),
    field: 'packQty',
  },
  {
    title: t('dict.PCCColumn.unit'),
    field: 'unit',
  },
  {
    title: t('dict.QuantitativePlanColumn.partNumber'),
    field: 'partNumber',
  },

  {
    title: t('dict.PCCColumn.description'),
    field: 'description',
  },
  {
    title: t('dict.PCCColumn.useQtyMultiple'),
    field: 'useQtyMultiple',
  },
  {
    title: t('dict.PCCColumn.useQty'),
    field: 'useQty',
  },
  {
    title: t('dict.PCCColumn.packUnit'),
    field: 'packUnit',
  },
];

/**
 * 包规 & 包材 - 卷芯表格列配置
 */
export const packCustomColumns: TableColumns = [
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 45,
  },
  {
    title: t('dict.PCCColumn.type'),
    field: 'type',
  },
  {
    title: t('dict.CommonCol.packQtyPCS'),
    field: 'packQty',
  },
  {
    title: t('dict.PCCColumn.unit'),
    field: 'unit',
  },
  {
    title: t('dict.PCCColumn.partNumber'),
    field: 'partNumber',
  },

  {
    title: t('dict.PCCColumn.description'),
    field: 'description',
  },
  {
    title: t('dict.PCCColumn.useQtyMultiple'),
    field: 'useQtyMultiple',
  },
  {
    title: t('dict.PCCColumn.useQty'),
    field: 'useQty',
  },
  {
    title: t('dict.PCCColumn.packUnit'),
    field: 'packUnit',
  },
];

/**
 * 工艺流程详述 - 表格列配置
 */
export const technologyDetailColumns: TableColumns = [
  {
    title: t('dict.PCCColumn.processCode'),
    field: 'processName',
    format: (v: string, _: any, index: number) => `${index + 1}、${v || ''}`,
    width: 100,
  },
  {
    title: t('dict.PCCColumn.description'),
    field: 'description',
    type: 'editor',
    width: 300,
  },
  {
    title: t('dict.PCCColumn.imageList'),
    field: 'imageList',
    type: 'imageList',
  },
];

/**
 * 变更履历 - 表格列配置
 */
export const changeHistoryColumns: TableColumns = [
  {
    title: t('dict.PCCColumn.version'),
    field: 'version',
  },
  {
    title: t('dict.PCCColumn.creatorTime'),
    field: 'creatorTime',
    format: (v: string) => (v ? formatToDate(v) : ''),
  },
  {
    title: t('dict.PCCColumn.revisionRemark'),
    field: 'revisionRemark',
  },
];

/**
 * 半成品 - 表格列配置
 */
export const semiFinishedProductColumns: TableColumns = [
  {
    title: t('component.table.index'),
    type: 'seq',
    width: 45,
  },
  // 半成品料号
  {
    title: t('dict.SemiFinishedProductsColumn.semiFinishedProductsPartNumber'),
    field: 'semiFinished',
    width: 100,
  },
  // 生产类型
  {
    title: t('dict.CommonCol.productionTypeName'),
    field: 'productionTypeName',
    width: 60,
  },
  // 有无BOM
  {
    title: t('dict.CommonCol.hasBOM'),
    field: 'isBom',
    format: cellValue => {
      return cellValue ? t('comon.have') : t('common.none');
    },
    width: 60,
  },
  // 备料信息
  {
    title: t('dict.PCCColumn.prepareMaterialInfo'),
    field: 'preparation',
    width: 120,
  },
  // 用量倍数
  {
    title: t('dict.PCCColumn.useQtyMultiple'),
    field: 'materialDosage',
    width: 60,
  },
  // 用量/KPCS
  {
    title: t('dict.PCCColumn.useQty'),
    field: 'qty',
    width: 60,
  },
  // 单位
  {
    title: t('dict.CommonCol.materialUnit'),
    field: 'unit',
    width: 60,
  },
  // 备注
  {
    title: t('dict.CommonCol.remark'),
    field: 'remarks',
  },
];
