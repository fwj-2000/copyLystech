import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getBizScopeBulist } from '/@/api/equipment/equipmentLedger';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();

// 主页form配置
export const equipmentAnalysisSchema = [
  {
    field: 'bu',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getBizScopeBulist,
      resultField: 'data',
      labelField: 'name',
      valueField: 'code',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      placeholder: 'BU',
      mode: 'multiple',
    },
    i18nField: 'buName',
  },
  {
    field: 'factoryArea',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [],
      placeholder: 'SBU(小厂)',
    },
    i18nField: 'factoryAreaName',
  },
  {
    field: 'weeks',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
    i18nField: 'CommonCol.weeks',
  },
  {
    field: 'pmcDri',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: 'PMC DRI',
    },
    i18nField: 'pmcDriName',
  },
  {
    field: 'equipmentManager',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '设备管理员',
    },
    i18nField: 'equipmentManagerName',
  },
];

// 主页表格column配置
const column = [
  {
    title: 'BU',
    // sortable: true,
    field: 'buName',
    width: 180,
    fixed: 'left',
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
    width: 160,
    fixed: 'left',
  },
  {
    title: 'PMC DRI',
    field: 'pmcDriName',
    width: 150,
  },
  {
    title: '设备管理员 DRI',
    field: 'equipmentManagerName',
    // sortable: true,
    i18nField: 'CommonCol.DRIDeviceAdministrator',
    width: 160,
  },
  {
    title: '上传（需以实物为准）',
    field: 'uploadNumber',
    slots: { default: 'compareType1' },
    width: 150,
  },
  {
    title: '对标OK',
    field: 'benchmarkingOK',
    slots: { default: 'compareType2' },
    width: 100,
  },
  {
    title: '在建工程',
    field: 'processing',
    slots: { default: 'compareType3' },
    width: 100,
  },
  {
    title: '已被清理分类',
    field: 'cleaned',
    //slots: { default: 'compareType4' },
    children: [
      {
        title: '资产调拨转移',
        field: 'cleaned1',
        slots: { default: 'compareType41' },
        width: 100,
      },
      {
        title: '资产维修或改造',
        field: 'cleaned2',
        slots: { default: 'compareType42' },
        width: 110,
      },
      {
        title: '资产调拨转移海外',
        field: 'cleaned3',
        slots: { default: 'compareType43' },
        width: 120,
      },
      {
        title: '资产报废',
        field: 'cleaned4',
        slots: { default: 'compareType44' },
        width: 90,
      },
      {
        title: '资产删除',
        field: 'cleaned6',
        slots: { default: 'compareType46' },
        width: 90,
      },
      {
        title: '其他',
        field: 'cleaned5',
        slots: { default: 'compareType45' },
        width: 80,
      },
    ],
  },
  {
    title: '有账无物（NG1）',
    field: 'NG1',
    slots: { default: 'compareType5' },
    width: 120,
  },
  {
    title: '有物无账（NG2）',
    field: 'NG2',
    slots: { default: 'compareType6' },
    width: 120,
  },
  {
    title: 'NG5',
    field: 'NG5',
    slots: { default: 'compareType7' },
    width: 120,
  },
  // {
  //   title: '上传&台账差异',
  //   field: 'ledgerDiff',
  //   width: 120,
  // },
  {
    title: 'NG原因分析',
    field: 'NGReasonAnalysis',
    width: 160,
  },
  {
    title: '厂区主设备数',
    field: 'factoryAreaCountQty',
    // sortable: true,
    slots: { default: 'factoryAreaCountQty' },
    width: 140,
  },
  {
    title: '圆刀机',
    field: 'equipmentCategoryQty1',
    // sortable: true,
    slots: { default: 'equipmentCategoryQty1' },
    width: 80,
  },
  {
    title: '平板机',
    field: 'equipmentCategoryQty2',
    slots: { default: 'equipmentCategoryQty2' },
    // sortable: true,
    width: 80,
  },
  {
    title: '分切机',
    field: 'equipmentCategoryQty3',
    slots: { default: 'equipmentCategoryQty3' },
    // sortable: true,
    width: 80,
  },
  {
    title: '分条机',
    field: 'equipmentCategoryQty4',
    slots: { default: 'equipmentCategoryQty4' },
    // sortable: true,
    width: 80,
  },
  {
    title: '冲床',
    field: 'equipmentCategoryQty6',
    slots: { default: 'equipmentCategoryQty6' },
    // sortable: true,
    width: 80,
  },
  {
    title: '激光机',
    field: 'equipmentCategoryQty5',
    slots: { default: 'equipmentCategoryQty5' },
    // sortable: true,
    width: 80,
  },
  {
    title: '成型机',
    field: 'equipmentCategoryQty7',
    slots: { default: 'equipmentCategoryQty7' },
    // sortable: true,
    width: 80,
  },
  {
    title: '跨步机',
    field: 'equipmentCategoryQty8',
    slots: { default: 'equipmentCategoryQty8' },
    // sortable: true,
    width: 80,
  },
  {
    title: '丝印机',
    field: 'equipmentCategoryQty9',
    slots: { default: 'equipmentCategoryQty9' },
    // sortable: true,
    width: 80,
  },
  {
    title: '压痕机',
    field: 'equipmentCategoryQty10',
    slots: { default: 'equipmentCategoryQty10' },
    // sortable: true,
    width: 80,
  },
  {
    title: '印刷机',
    field: 'equipmentCategoryQty11',
    slots: { default: 'equipmentCategoryQty11' },
    // sortable: true,
    width: 80,
  },
];

export function getColumn(): any {
  const columnData = cloneDeep(column);
  return columnData;
}

export const detailGridColumn: any[] = [
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
    i18nField: 'number',
  },
  // {
  //   title: 'BU',
  //   field: 'problemDescription',
  // },
  {
    title: 'SBU(小厂)',
    width: 120,
    field: 'factoryAreaName',
  },
  {
    title: '设备类型',
    width: 120,
    field: 'equipmentTypeName',
  },
  {
    title: '设备分类',
    field: 'equipmentCategoryName',
    width: 120,
  },
  {
    title: '设备编码',
    field: 'equipmentCode',
    width: 120,
  },
  {
    title: '固定资产编号',
    field: 'fixedAssetCode',
    width: 120,
  },
  {
    title: '设备型号分类',
    field: 'equipmentModelCategoryName',
    width: 120,
  },

  {
    title: '固定资产名称',
    field: 'fixedAssetName',
    width: 120,
  },

  {
    title: '规格型号',
    field: 'specifications',
    width: 120,
  },
  {
    title: '机身序列号',
    field: 'fuselageSerialNo',
    width: 120,
  },
  {
    title: '设备制造商',
    field: 'equipmentVendor',
    width: 120,
  },

  {
    title: '是否老领略',
    field: 'isOldLlName',
    width: 100,
  },
  {
    title: '使用状态',
    field: 'useStatusName',
    width: 120,
  },
  {
    title: '闲置原因',
    field: 'freeReasons',
    width: 120,
  },
  {
    title: '铭牌出厂日期',
    field: 'nameplateManufactureDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYears',
    width: 120,
  },
  {
    title: '铭牌年限分类',
    field: 'nameplateYearsCategoryName',
    width: 120,
  },
  {
    title: '设备联线状态',
    field: 'connectionStatusName',
    width: 120,
  },
  {
    title: '是否是拼接改装设备',
    field: 'isAssembleName',
    width: 160,
  },
  {
    title: '厂区备注',
    field: 'factoryAreaRemark',
    width: 120,
  },
  {
    title: '备注',
    width: 120,
    field: 'remark',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.creatorUserName',
    width: 160,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.creatorTime',
    width: 160,
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    i18nField: 'CommonCol.lastModifyUserName',
    width: 160,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.lastModifyTime',
    width: 160,
  },
];

export function getDetailGridColumn(): any {
  const columnData = cloneDeep(detailGridColumn);
  return columnData;
}
