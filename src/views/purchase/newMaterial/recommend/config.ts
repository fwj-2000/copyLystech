import { getFactory } from '/@/api/engineering/newMateria';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { getStatus } from '/@/components/CustomComponents/src/material/Constant';

export const schemaList = [
  {
    fieldName: 'applyNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '需求单号',
      allowClear: true,
    },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'insideNumberOld',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '旧版成品编码',
      allowClear: true,
    },
  },
  {
    fieldName: 'applyUserId',
    i18nField: 'applyUserName',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '申请人',
      allowClear: true,
    },
  },
  {
    fieldName: 'currentProcessorId',
    i18nField: 'currentProcessor',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '当前处理人',
      allowClear: true,
    },
  },
  {
    fieldName: 'purchaseUserId',
    i18nField: 'purchaseUserName',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '开发采购',
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'applyUserId',
  //   label: '',
  //   component: 'CustomUserSelect',
  //   componentProps: {
  //     placeholder: 'pd',
  //   },
  // },
  // {
  //   fieldName: 'factoryId',
  //   i18nField: 'factoryName',
  //   label: '',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     placeholder: '工厂',
  //     api: getFactory,
  //     showSearch: true,
  //     apiSearch:{
  //       show: true,
  //       searchName: 'factoryCode',
  //     },
  //     resultField: 'data',
  //     valueField: 'Id',
  //     // labelField:'',
  //     immediate: true,
  //     nameFormat: ['Code', '/', 'Name'],
  //   },
  // },
  // {
  //   fieldName: 'materialAreaId',
  //   i18nField: 'materialAreaName',
  //   label: '',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     placeholder: '材料归属',
  //     api: getMaterialList,
  //     apiSearch: {
  //       show: false,
  //     },
  //     params: {
  //       isSelectRoot: 'true',
  //       displayArea: 'MaterialWarehouse',
  //     },
  //     resultfieldName: 'data.list',
  //     labelfieldName: 'fullName',
  //     valuefieldName: 'id',
  //     showSearch: false,
  //     immediate: true,
  //     filterOption: false,
  //   },
  // },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: getStatus(),
      allowClear: true,
    },
  },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '操作', field: 'action', width: 60, fixed: 'right', slots: { default: 'action' } },
  { title: '需求单号', field: 'applyNumber', width: 200 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
  { title: '旧版成品编码', field: 'insideNumberOld', width: 170 },
  {
    title: '状态',
    field: 'status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: getStatus('statusDesc'),
    },
  },
  { title: '当前处理人', field: 'currentProcessor', width: 230 },
  { title: '当前节点', field: 'currentNodeName', width: 120 },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
  { title: '工厂', field: 'factoryName', width: 160 },
  { title: '开发采购', field: 'purchaseUserName', width: 200 },
  { title: '开发类型', field: 'developmentType', width: 120 },
  { title: '材料归属', field: 'materialAreaName', width: 120 },
  { title: '材料描述', field: 'materialDesc', width: 230 },
  { title: '申请人', field: 'applyUserName', width: 230 },
  {
    title: '申请时间',
    field: 'applyDateTime',
    cellRender: {
      name: 'Date',
    },
    width: 200,
  },
];

// export const columnDone = columns.concat([
//   { title: '处理人', field: 'lastModifyUserName', width: 230 },
//   {
//     title: '处理时间',
//     field: 'lastModifyTime',
//     cellRender: {
//       name: 'Date',
//     },
//     width: 200,
//   },
// ]);

export const emailColumns = [
  { title: '材料要求(基材/总厚度&材质&颜色&粘性/离型力)', dataIndex: 'materialDesc', i18nField: 'materialsRequirements', width: 450 },
  { title: '被贴物', dataIndex: 'beingPostedMaterial' },
  { title: '供应商简称', dataIndex: 'manufacturer', i18nField: 'supplierName' },
  { title: '供应商材料编码', dataIndex: 'manufacturerMaterialsCode' },
  { title: '含税价', dataIndex: 'priceInclusiveTax' },
  { title: '是否有现样', dataIndex: 'hasSample' },
  { title: '预计样品交期', dataIndex: 'estimatedSampleDelivery', i18nField: 'expectedSampleDate' },
  { title: 'MOQ/m²', dataIndex: 'minimumOrderQuantityPerSquareMeter' },
  { title: '产地', dataIndex: 'origin' },
  { title: '量产规格', dataIndex: 'massProductionSpecification' },
  { title: '是否含PFAS', dataIndex: 'containsPfas' },
  { title: '是否含甲苯', dataIndex: 'containsToluene' },
  { title: '翘曲管控标准', dataIndex: 'warpageControlStandard' },
  { title: '备注', dataIndex: 'remarks', i18nField: 'CommonCol.remark' },
];
