import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';

export enum STATUS_ENUM {
  启用 = 1,
  禁用 = 2,
}

export enum InspectionTabs {
  VisualInspection = 'visualInspection', // 外观检测
  DimensionMeasurement = 'dimensionMeasurement', // 尺寸检测
  // PerformanceTesting = 'performanceTesting', // 性能测试
  // EnvironmentalTesting = 'environmentalTesting', // 环境测试
  PackagingTests = 'packagingTests', // 包装测试
}
export type TInspectionTabKey = keyof typeof InspectionTabs;

export const inspectionDataTabList = [
  { label: '外观检测', value: InspectionTabs.VisualInspection },
  { label: '尺寸检测', value: InspectionTabs.DimensionMeasurement },
  { label: '包装测试', value: InspectionTabs.PackagingTests },
  // { label: '性能测试', value: InspectionTabs.PerformanceTesting },
  // { label: '环境测试', value: InspectionTabs.EnvironmentalTesting },
];

const { t } = useI18n();
/**
 * 处理状态筛选
 */
export const statusOptions = [
  { fullName: t('已申请'), id: 1, rowKey: 'applyState', theme: 'green' },
  { fullName: t('未申请'), id: 2, rowKey: 'applyState', theme: 'red' },
];

export const SAPColumns: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox' },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: 'Lot No.',
    field: 'lotNo',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 120,
  },
  {
    title: '状态',
    field: 'applyState',
    i18nField: 'status',
    sortable: true,
    width: 100,
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
  },
  {
    title: '内部物料编码',
    field: 'innerMaterialCode',
    sortable: true,
    width: 180,
  },
  {
    title: '内部物料描述',
    field: 'innerMaterialDescription',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  // {
  //   title: '供应商来料批次号',
  //   field: 'supplierInMaterialLotNo',
  //   width: 200,
  //   filters: [{ data: '' }],
  //   filterRender: { name: 'Input' },
  // },
  // {
  //   title: '集采工厂',
  //   field: 'gatherFactory',
  //   width: 200,
  //   sortable: true,
  // },
  {
    title: '供应商编号',
    field: 'supplierNo',
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 120,
  },
  {
    title: '供应商名称',
    field: 'supplierName',
    width: 140,
  },
  {
    title: '来料数量',
    field: 'materialInCount',
    width: 140,
  },
  // {
  //   title: '来料仓库',
  //   field: 'materialInWarehouse',
  //   sortable: true,
  //   width: 140,
  // },
  // {
  //   title: '料号厂区',
  //   field: 'materialCodeFacatoryArea',
  //   width: 140,

  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: { name: 'Input' },
  // },
  {
    title: '来料日期',
    field: 'materialInDate',
    width: 140,

    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
];
