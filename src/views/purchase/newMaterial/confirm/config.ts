import { getStatus, IS_SATISFY_LIST } from '/@/components/CustomComponents/src/material/Constant';
import { getSuppliers } from '/@/api/purchase/newMateria';
import { useUserStore } from '/@/store/modules/user';
import { cellGroupProps } from 'vant';
import { createCellRender } from '/@/components/VxeTable/src/components/common';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

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
    fieldName: 'currentProcessorId',
    i18nField: 'currentProcessor',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '当前处理人',
      // defaultValue: useUserStore().getUserInfo.userId,
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
    fieldName: 'supplierShortName',
    i18nField: '',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商简称',
      allowClear: true,
    },
  },
  {
    fieldName: 'supplierName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商名称',
      allowClear: true,
    },
  },
  {
    fieldName: 'manufacturerMaterialsCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商材料编码',
      allowClear: true,
    },
  },
];

export const schemaDoneList = [
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
    fieldName: 'currentProcessorId',
    i18nField: 'currentProcessor',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '当前处理人',
      // defaultValue: useUserStore().getUserInfo.userId,
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
    fieldName: 'supplierShortName',
    i18nField: '',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商简称',
      allowClear: true,
    },
  },
  {
    fieldName: 'supplierName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商名称',
      allowClear: true,
    },
  },
  {
    fieldName: 'manufacturerMaterialsCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '供应商材料编码',
      allowClear: true,
    },
  },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '操作', field: 'action', width: 60, fixed: 'right', slots: { default: 'action' } },
  { title: '需求单号', field: 'applyNumber', sortable: true, width: 180 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
  { title: '旧版成品编码', field: 'insideNumberOld', width: 170 },
  {
    title: '工程复核结论',
    field: 'engineeringStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: IS_SATISFY_LIST,
    },
    cellRender: {
      name: 'Tag',
      options: IS_SATISFY_LIST,
    },
    width: 130,
  },
  {
    title: '工程复核意见',
    field: 'conclusionRemarks',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  // { title: 'PD', field: 'PD', formatter: ({ row }) => row.applyUserName, keyField: 'pd', i18nField: 'CommonCol.pd', width: 230 },
  { title: '供应商简称', field: 'supplierShortName', width: 140 },
  { title: '供应商名称', field: 'supplierName', width: 140 },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode', width: 140 },
  {
    title: '供应商材料信息',
    field: 'supplierMaterialsInformation',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  {
    title: '备注',
    field: 'remarks',
    i18nField: 'CommonCol.remark',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  // { title: '材料内部料号', field: 'materialCode' },
  {
    title: '状态',
    field: 'handleStatus',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: getStatus('handleStatusDesc'),
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessor',
    width: 200,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  { title: '当前节点', field: 'currentNodeName', width: 100 },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
  {
    title: '工厂',
    field: 'factoryName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '申请人',
    field: 'applyUserName',
    width: 200,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '申请时间',
    field: 'applyDateTime',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'DatePicker',
    // },
    cellRender: {
      name: 'Date',
    },
    width: 200,
  },
  {
    title: '材料归属',
    field: 'materialAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '开发类型',
    field: 'developmentType',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('DevelopmentTypeEnum'),
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
      },
    },
    width: 100,
  },
];

export const columnsDone = columns.flatMap(item => {
  if (item.field === 'remarks') {
    return [
      item,
      { title: '送样规格', field: 'specifications', width: 120 },
      {
        title: '预计样品交期',
        field: 'expectedSampleDateTime',
        width: 160,
        cellRender: { name: 'Date' },
      },
    ];
  }
  return [item];
});

export const columnsExport = columns.map(item => {
  if (item.field === 'engineeringStatus') {
    return {
      ...item,
      field: 'engineeringStatusDesc',
    };
  }
  return item;
});

export const columnsDoneExport = columns.flatMap(item => {
  if (item.field === 'remarks') {
    return [
      item,
      { title: '送样规格', field: 'specifications', width: 120 },
      {
        title: '预计样品交期',
        field: 'expectedSampleDateTime',
        width: 160,
        cellRender: { name: 'Date' },
      },
    ];
  }

  if (item.field === 'engineeringStatus') {
    return [
      {
        ...item,
        field: 'engineeringStatusDesc',
      },
    ];
  }

  return [item];
});

export const emailColumns = [
  { title: '单号', field: 'applyNumber' },
  { title: '材料要求(基材/总厚度&材质&颜色&粘性/离型力)', field: 'supplierMaterialsInformation', i18nField: 'materialsRequirements', width: 350 },
  { title: '被贴物', field: 'beingPostedMaterial' },
  { title: '供应商简称', field: 'supplierName' },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode', i18nField: 'modelNumber' },
  // { title: '含税价', field: 'priceInclusiveTax' }, // 预填field，不产生值
  { title: '送样规格', field: 'specification' }, // 预填field，不产生值
  // { title: '是否有现样', field: 'hasSample' }, // 预填field，不产生值
  { title: '预计样品交期', field: 'estimatedSampleDelivery', i18nField: 'expectedSampleDate' }, // 预填field，不产生值
  // { title: 'MOQ/m²', field: 'minimumOrderQuantityPerSquareMeter' }, // 预填field，不产生值
  // { title: '产地', field: 'origin' }, // 预填field，不产生值
  // { title: '量产规格', field: 'massProductionSpecification' }, // 预填field，不产生值
  { title: '备注', field: 'remark', i18nField: 'CommonCol.remark' }, // 预填field，不产生值
];

export const sampleColumns = [
  { title: '单号', field: 'applyNumber' },
  { title: '材料要求(基材/总厚度&材质&颜色&粘性/离型力)', field: 'supplierMaterialsInformation', i18nField: 'materialsRequirements', width: 350 },
  { title: '被贴物', field: 'beingPostedMaterial', width: 160 },
  { title: '供应商简称', field: 'supplierName', width: 120 },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode', width: 120 },
  { title: '送样规格', field: 'specifications', editRender: { name: 'Input' }, width: 120 },
  {
    title: '预计样品交期',
    field: 'expectedSampleDateTime',
    editRender: {
      name: 'DatePicker',
    },
    width: 160,
  },
  {
    title: '下一节点处理人(SQE)',
    field: 'sqeUserId',
    editRender: { name: 'CustomUserSelect' },
    i18nField: 'CommonCol.nextHandler',
    i18nParams: ['SQE'],
    width: 160,
  },
  { title: '备注', field: 'sendSamplesRemarks', i18nField: 'CommonCol.remark', editRender: { name: 'Input' }, width: 160 },
];

export const purchaseSchema = [
  {
    field: 'supplierId',
    i18nField: 'supplierName',
    label: '供应商名称',
    component: 'ApiSelect',
    componentProps: {
      api: getSuppliers,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'supplierName',
      },
      params: {
        pageSize: 100,
      },
      resultField: 'data',
      labelField: 'shortName',
      valueField: 'id',
      filterOption: false,
      notFoundContent: null,
      defaultLabel: '',
      nameFormat: ['shortName', '/', 'code'],
      immediate: true,
    },
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'manufacturerMaterialsCode',
    label: '供应商材料编码',
    component: 'Input',
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'supplierMaterialsInformation',
    label: '供应商材料信息',
    component: 'Textarea',
    componentProps: {
      rows: 1,
      maxlength: 200,
    },
    required: true,
    colProps: {
      span: 10,
    },
  },
  {
    field: 'remarks',
    i18nField: 'CommonCol.remark',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 10,
    },
  },
  {
    field: 'verificationOrder',
    label: '验证优先级',
    component: 'InputNumber',
    componentProps: { min: 1 },
    required: true,
    colProps: {
      span: 4,
    },
  },
];

export const sampleSchema = [
  {
    field: 'specifications',
    label: '送样规格',
    component: 'Input',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'sqeUserName',
    i18nField: 'sqeUserId',
    label: '下一节点处理人(SQE)',
    component: 'Input',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'expectedSampleDateTime',
    label: '预计样品交期',
    component: 'DatePicker',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'sendSamplesRemarks',
    i18nField: 'CommonCol.remark',
    label: '备注',
    component: 'Textarea',
    componentProps: {
      rows: 1,
      autoSize: true,
    },
    colProps: {
      span: 24,
    },
  },
];
