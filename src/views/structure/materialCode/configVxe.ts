import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { getConfigTypes } from '/@/api/business/member';
import { useBaseStore } from '/@/store/modules/base';
import { getMaterialList, getMaterialSubList } from '/@/api/purchase/materialBase';
import { getSupplierList } from '/@/api/equipment/information';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const baseStore = useBaseStore();

// 获取主要制程
export async function getMainProcess() {
  const r = await getConfigTypes(['mainProcess']);
  const _obj = r.data[0].typeList;
  const _list: any = [];
  for (let k in _obj) {
    _list.push({
      id: Number(k),
      fullName: _obj[k],
    });
  }
  return _list;
}
const ProgressStatusList = [
  {
    id: '0',
    fullName: '草稿',
    theme: 'gray',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '3',
    fullName: '驳回',
    theme: 'yellow',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '4',
    fullName: '撤回',
    theme: 'purple',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '22',
    fullName: '待审核',
    theme: 'gray',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '23',
    fullName: '待录入',
    theme: 'gray',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '24',
    fullName: '已录入',
    theme: 'green',
    rowKey: 'progressStatusDesc',
  },
  {
    id: '25',
    fullName: '已审核',
    theme: 'green',
    rowKey: 'progressStatusDesc',
  },
];

const commonCols = [
  // { title: '文控', field: 'documentControlName' },
  { title: '材料归属', field: 'materialAreaName', width: 150 },
  {
    title: '材料形态',
    field: 'materialForm',
    width: 150,
  },
  { title: '原厂商型号', field: 'originalModelNumber', width: 150 },
  { title: '供应商简称', field: 'supplierName', width: 150 },
  { title: '原厂商简称', field: 'originalManufacturerName', width: 150 },
  { title: '材料类型', field: 'materialClassName', width: 150 },
  { title: '三级分类', field: 'threeLevelName', width: 150 },
  { title: '材料宽度(MM)', field: 'materialWidth', width: 150 },
  { title: '材料长度(M)', field: 'materialLength', width: 150 },
  { title: '材料描述', field: 'materialDesc', width: 150 },
  { title: '材料规格', field: 'materialSpec', width: 150 },
  { title: '总厚度(MM)', field: 'totalThickness', width: 150, i18nField: 'materialThicknessTotal' },
  { title: '基材类型', field: 'materialQualityName', width: 150 },
  { title: '基材厚度(MM)', field: 'substrateThickness', width: 150, i18nField: 'materialThickness' },
  { title: '涂层类型', field: 'coatingType', width: 150 },
  { title: '涂层厚度(MM)', field: 'tds', width: 150 },
  { title: '厚度公差(MM)', field: 'tolerance', width: 150 },
  { title: '颜色', field: 'materialColor', width: 150, i18nField: 'colour' },
  { title: '克重(G)', field: 'grammage', width: 150, i18nField: 'gram' },
  { title: '抗静电功能', field: 'antistaticRequirements', width: 150, i18nField: 'resistStaticElectricityType' },
  { title: '结构组成', field: 'layers', width: 150, i18nField: 'singleDoubleLayer' },
  { title: '附膜', field: 'appendage', width: 150 },
  { title: '其他要求', field: 'otherRequirements', width: 150 },
  { title: '技术资料', field: 'files', width: 150, slots: { default: 'files' } },
  {
    title: '环保资料失效日期',
    field: 'dataInvalidTime',
    // format: 'date|YYYY-MM-DD',
    width: 150,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '材料有效期(月）',
    field: 'materialEffective',
    // format: 'date|YYYY-MM-DD',
    width: 150,
  },
  { title: '是否可选', field: 'isStrategyMaterialDesc', width: 150 },
  { title: '不可选备注', field: 'strategyMaterialRemarks', width: 150 },
];
export const columns = [
  {
    type: 'checkbox',
    field: 'checkbox',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    align: 'center',
    width: 50,
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    // format: 'tag|' + JSON.stringify(ProgressStatusList)
    cellRender: {
      name: 'Tag',
      options: ProgressStatusList,
    },
  },
  // {
  //   title: '当前节点',
  //   field: 'currentNodeName',
  //   width: 160,
  // },
  // {
  //   title: '当前处理人',
  //   field: 'currentProcessor',
  //   width: 220,
  // },
  // {
  //   title: '节点记录',
  //   field: 'nodeDetail',
  //   width: 120,
  //   slots: {
  //     default: 'nodeDetail',
  //   },
  // },
  { title: '主要制程', field: 'mainProcessDesc', width: 150, i18nField: 'CommonCol.mainProcess' },
  { title: '材料内部料号', field: 'materialCode', width: 150 },
  ...commonCols,
  { title: '申请人', field: 'creatorUserName', width: 150, i18nField: 'CommonCol.applyUser' },
  {
    title: '申请时间',
    field: 'creatorTime',
    width: 150,
    i18nField: 'CommonCol.applyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  { title: '修改人', field: 'lastModifyUserName', width: 150, i18nField: 'CommonCol.updateUser' },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    width: 150,
    i18nField: 'CommonCol.updateTime',
    // format: 'date|YYYY/MM/DD',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  // 操作行
  // {
  //   title: t('common.action'),
  //   width: '60',
  //   field: 'action',
  //   fixed: 'right',
  //   slots: {
  //     default: 'action',
  //   },
  // },
];

export const addCols = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    // editComponent: 'Input',
    // editRow: true,
    editRender: {
      name: 'ASelect',
      props: {
        api: () => baseStore.getDictionaryData('MainProcess', true),
        showSearch: true,
        placeholder: '请选择主要制程',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        immediate: true,
      },
    },
  },
  { title: '材料归属', field: 'materialAreaName', width: 150 },
  { title: '原厂商型号', field: 'originalModelNumber' },
  { title: '总厚度(MM)', field: 'totalThickness', i18nField: 'materialThicknessTotal' },
  { title: '颜色', field: 'materialColor', width: 100, i18nField: 'colour' },
  { title: '材料描述', field: 'materialDesc' },
  { title: '材料规格', field: 'materialSpec', width: 150 },
  { title: '采购单位', field: 'purchaseUnit', width: 150 },
  { title: '粘性/离型力等级', field: 'releaseForceLevel', width: 150 },
  {
    title: '材料内部料号',
    field: 'materialCode',
    // editComponent: 'Input',
    // editRow: true,
    editRender: {
      name: 'Input',
    },
  },
  // 暂无字段，只显示列，不展示内容，为了国际化处理，暂时使用`internalBondedMaterialNumber`处理
  { title: '内部保税料号', field: 'internalBondedMaterialNumber' },
  // 暂无字段，只显示列，不展示内容，为了国际化处理，暂时使用`isStandard`处理
  {
    title: '标准/非标准',
    field: 'standard',
    formatter: ({ cellValue }) => {
      // return cellValue === 'standard' ? '标准' : cellValue === 'notStandard' ? '非标准' : '';
      if (cellValue === 'standard') {
        return '标准';
      }
      if (cellValue === 'notStandard') {
        return '非标准';
      }
      return '';
    },
  },
  { title: '供应商简称', field: 'supplierName' },
  { title: '申请人', field: 'creatorUserName' },
  {
    title: '申请时间',
    field: 'creatorTime',
    // format: 'date|YYYY/MM/DD',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  // {
  //   title: '主要制程',
  //   field: 'mainProcess',
  //   // editComponent: 'Select',
  //   // editRow: true
  //   editRender: {
  //     name: 'Select',
  //     props: {},
  //   },
  // },
  // 操作行
  {
    title: t('common.action'),
    width: '60',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
  // ...commonCols,
  // {
  //   title: '技术资料',
  //   field: 'files',
  // },
];

/**
 * 导入数据 - 列配置
 */
export const importColumns = [
  // { title: '状态', dataIndex: 'status', width: 100, format: 'tag|' + JSON.stringify(ProgressStatusList) },
  { title: '主要制程', dataIndex: 'mainProcessDesc' },
  { title: '材料内部料号', dataIndex: 'materialCode' },
  { title: '材料归属', dataIndex: 'materialAreaName' },
  {
    title: '材料形态',
    dataIndex: 'materialForm',
  },
  { title: '原厂商型号', dataIndex: 'originalModelNumber' },
  { title: '供应商简称', dataIndex: 'supplierName' },
  { title: '原厂商简称', dataIndex: 'originalManufacturerName' },
  { title: '材料类型', dataIndex: 'materialClassName' },
  { title: '三级分类', dataIndex: 'threeLevelName' },
  { title: '材料宽度(MM)', dataIndex: 'materialWidth' },
  { title: '材料长度(M)', dataIndex: 'materialLength' },
  { title: '材料描述', dataIndex: 'materialDesc' },
  { title: '材料规格', dataIndex: 'materialSpec' },
  { title: '总厚度(MM)', dataIndex: 'totalThickness', i18nField: 'materialThicknessTotal' },
  { title: '基材类型', dataIndex: 'materialQualityName' },
  { title: '基材厚度(MM)', dataIndex: 'substrateThickness', i18nField: 'materialThickness' },
  { title: '涂层厚度(MM)', dataIndex: 'tds' },
  { title: '厚度公差(MM)', dataIndex: 'tolerance' },
  { title: '涂层类型', dataIndex: 'coatingType' },
  { title: '颜色', dataIndex: 'materialColor', i18nField: 'colour' },
  { title: '克重(G)', dataIndex: 'grammage', i18nField: 'gram' },
  { title: '抗静电功能', dataIndex: 'antistaticRequirements', i18nField: 'resistStaticElectricityType' },
  { title: '结构组成', dataIndex: 'layers', i18nField: 'singleDoubleLayer' },
  { title: '附膜', dataIndex: 'appendage' },
  { title: '其他要求', dataIndex: 'otherRequirements' },
  { title: '材料描述', dataIndex: 'materialDesc' },
  { title: '环保资料失效日期', dataIndex: 'dataInvalidTime', format: 'date|YYYY-MM-DD' },
  { title: '材料有效期(月）', dataIndex: 'materialEffective' },
  { title: '是否可选', dataIndex: 'isStrategyMaterialDesc' },
  { title: '不可选备注', dataIndex: 'strategyMaterialRemarks' },
  // { title: '申请人', dataIndex: 'creatorUserName' },
  // { title: '申请时间', dataIndex: 'creatorTime', format: 'date|YYYY/MM/DD' },
];

/**
 * @description 根据行数据的内容，自动计算设置`材料规格`的值
 * @param record 表格行数据
 * @param index 表格行索引
 */
function getMaterialSpec(row: any) {
  const { materialLength, materialWidth, totalThickness, thicknessUnitValue } = row;
  return `${+materialWidth || 0}MM*${+materialLength || 0}M*${+totalThickness || 0}${thicknessUnitValue}`;
}
/**
 * @description 批量修改基础资料 - 列配置
 */
export const batchModifyBaseInfoColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    type: 'seq',
    width: '50',
    align: 'center',
  },
  { title: '主要制程', field: 'mainProcessDesc', i18nField: 'CommonCol.mainProcess', minWidth: '160' },
  { title: '材料内部料号', field: 'materialCode', minWidth: '160' },
  {
    title: '材料归属',
    field: 'materialAreaId',
    i18nField: 'materialAreaName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'materialAreaName',
      props: {
        api: getMaterialList,
        apiSearch: {
          show: false,
        },
        params: {
          isSelectRoot: 'true',
          displayArea: 'MaterialWarehouse',
        },
        resultField: 'data.list',
        labelField: 'fullName',
        valueField: 'id',
        showSearch: false,
        immediate: true,
        filterOption: false,
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.materialAreaName = '';
          }
          row.materialClassId = '';
          row.materialClassName = '';
          row.materialQualityId = '';
          row.materialQualityName = '';
        },
      },
    },
    minWidth: 160,
  },
  {
    title: '材料形态',
    field: 'materialForm',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'materialFormValue',
      props: {
        api: () => baseStore.getDictionaryData('MaterialForm'),
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.materialFormValue = '';
          }
        },
      },
    },
    minWidth: 160,
  },
  { title: '原厂商型号', field: 'originalModelNumber', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '供应商简称',
    field: 'supplierId',
    i18nField: 'supplierName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'supplierName',
      isDefaultLabel: true,
      props: {
        api: getSupplierList,
        filterOption: false,
        apiSearch: {
          show: true,
          searchName: 'shortName',
        },
        labelField: 'shortName',
        valueField: 'id',
        showSearch: true,
        resultField: 'data',
        nameFormat: ['shortName', '/', 'code'],
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.supplierName = '';
          }
        },
      },
    },
    minWidth: 160,
  },
  {
    title: '原厂商简称',
    field: 'originalManufacturerName',
    i18nField: 'originalManufacturerName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'Input',
      // cacheField: 'originalManufacturerName',
      // props: {
      //   api: getSupplierList,
      //   apiSearch: {
      //     show: true,
      //     keyword: 'supplierName',
      //   },
      //   labelField: 'name',
      //   valueField: 'id',
      //   showSearch: true,
      //   resultField: 'data',
      //   nameFormat: ['name', '/', 'code'],
      //   onChange: (value: string, _: any, { row }: any) => {
      //     if (!value) {
      //       row.originalManufacturerName = '';
      //     }
      //   },
      // },
    },
    minWidth: 160,
  },
  {
    title: '材料类型',
    field: 'materialClassId',
    i18nField: 'materialAreaName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'materialClassName',
      props: {
        api: (params: any) => {
          return params.keyword ? getMaterialList({ displayArea: 'MaterialWarehouse', ...params }) : Promise.resolve({ data: { list: [] } });
        },
        rowParams: {
          keyword: 'materialAreaId',
        },
        resultField: 'data.list',
        labelField: 'fullName',
        valueField: 'id',
        immediate: true,
        alwaysLoad: true,
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.materialClassName = '';
          }
          row.materialQualityId = '';
          row.materialQualityName = '';
        },
      },
    },
    minWidth: 160,
  },
  { title: '三级分类', field: 'threeLevelName', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '材料宽度(MM)',
    field: 'materialWidth',
    editRender: {
      name: 'InputNumber',
      props: {
        onChange(_value: number, { row }: any) {
          row.materialSpec = getMaterialSpec(row);
        },
      },
    },
    minWidth: 160,
  },
  {
    title: '材料长度(M)',
    field: 'materialLength',
    editRender: {
      name: 'InputNumber',
      props: {
        onChange(_value: number, { row }: any) {
          row.materialSpec = getMaterialSpec(row);
        },
      },
    },
    minWidth: 160,
  },
  {
    title: '总厚度',
    field: 'totalThickness',
    i18nField: 'materialThicknessTotal',
    editRender: {
      name: 'InputNumber',
      props: {
        onChange(_value: number, { row }: any) {
          row.materialSpec = getMaterialSpec(row);
        },
      },
    },
    minWidth: 160,
  },
  { title: '材料规格', field: 'materialSpec', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '厚度单位',
    field: 'thicknessUnit',
    editRender: {
      name: 'Input',
      props: {
        defaultValue: 'MM',
        disabled: true,
      },
      // @ts-ignore
      // cacheField: 'thicknessUnitValue',
      // props: {
      //   api: () => baseStore.getDictionaryData('ThicknessUnit'),
      //   apiSearch: {
      //     show: false,
      //   },
      //   resultField: '',
      //   labelField: 'fullName',
      //   valueField: 'enCode',
      //   showSearch: false,
      //   immediate: true,
      //   filterOption: false,
      //   notFoundContent: null,
      //   onChange(_value: number, _: any, { row }: any) {
      //     row.materialSpec = getMaterialSpec(row);
      //   },
      // },
    },
    minWidth: 160,
  },
  {
    title: '基材类型',
    field: 'materialQualityId',
    i18nField: 'materialQualityName',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'materialQualityName',
      props: {
        api: (params: any) => {
          return params.keyword
            ? getMaterialSubList({ displayArea: 'MaterialWarehouse', type: 'BaseMaterialType', ...params })
            : Promise.resolve({ data: { list: [] } });
        },
        rowParams: {
          keyword: 'materialClassId',
        },
        resultField: 'data.list',
        labelField: 'fullName',
        valueField: 'id',
        immediate: true,
        alwaysLoad: true,
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.materialQualityName = '';
          }
        },
      },
    },
    minWidth: 160,
  },
  { title: '基材厚度', field: 'substrateThickness', i18nField: 'materialThickness', editRender: { name: 'InputNumber' }, minWidth: 160 },
  { title: '涂层厚度', field: 'tds', editRender: { name: 'InputNumber' }, minWidth: 160 },
  { title: '厚度公差', field: 'tolerance', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '涂层类型',
    field: 'coatingType',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'coatingTypeValue',
      props: {
        api: () => baseStore.getDictionaryData('CoatingTypeEnum'),
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    minWidth: 160,
  },
  { title: '颜色', field: 'materialColor', i18nField: 'colour', editRender: { name: 'Input' }, minWidth: 160 },
  { title: '克重(G)', field: 'grammage', i18nField: 'gram', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '抗静电功能',
    field: 'antistaticRequirements',
    i18nField: 'resistStaticElectricityType',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'antistaticRequirementsValue',
      props: {
        api: () => baseStore.getDictionaryData('ResistStaticElectricityEnum'),
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    minWidth: 160,
  },
  {
    title: '结构组成',
    field: 'layers',
    i18nField: 'singleDoubleLayer',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'layersValue',
      props: {
        api: () => baseStore.getDictionaryData('SingleDoubleLayerEnum'),
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    minWidth: 160,
  },
  { title: '附膜', field: 'appendage', editRender: { name: 'Input' }, minWidth: 160 },
  { title: '其他要求', field: 'otherRequirements', editRender: { name: 'Input' }, minWidth: 160 },
  { title: '材料描述', field: 'materialDesc', editRender: { name: 'Input' }, minWidth: 160 },
  {
    title: '环保资料失效日期',
    field: 'dataInvalidTime',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    minWidth: 160,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];

/**
 * @description 批量修改可选信息 - 列配置
 */
export const batchStategyMaterialColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    type: 'seq',
    width: '50',
    align: 'center',
  },
  { title: '材料内部料号', field: 'materialCode', width: '160' },
  {
    title: '是否可选',
    field: 'isStrategyMaterial',
    i18nField: 'isStrategyMaterialDesc',
    editRender: {
      name: 'ASelect',
      props: {
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    width: 120,
  },
  { title: '不可选备注', field: 'strategyMaterialRemarks', editRender: { name: 'Input' }, minWidth: '220' },
  { title: '材料归属', field: 'materialAreaName', width: '160' },
  { title: '原厂商型号', field: 'originalModelNumber', width: '160' },
  { title: '材料类型', field: 'materialClassName', width: '160' },
  { title: '供应商简称', field: 'supplierName', width: '160' },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];
