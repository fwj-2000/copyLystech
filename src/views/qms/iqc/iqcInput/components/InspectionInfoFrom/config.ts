import dayjs from 'dayjs';
import { FormSchema } from '/@/components/Form';
import { getInnermaterialnumberlist } from '/@/api/engineering/mould';
import { getunitList } from '/@/api/common/constant';

export const INSPECTIONINFOFROMS_SCHEMAS: FormSchema[] = [
  // {
  //   field: 'typeCode',
  //   label: '材料类别',
  //   component: 'ApiSelect',
  //   // slot: 'materialType',
  //   componentProps: {
  //     api: () => baseStore.getDictionaryData('TestPojectType'),
  //     placeholder: '请选择材料类别',
  //     resultField: 'data',
  //     labelField: 'fullName',
  //     valueField: 'enCode',
  //     filterOption: false,
  //     notFoundContent: null,
  //     defaultFirstOption: true,
  //     // singleDefaultFirst: true,
  //     immediate: true,
  //   },
  //   colProps: { span: 6 },
  //   rules: [
  //     {
  //       required: true,
  //       trigger: 'blur',
  //       validator: (_rule, val) => {
  //         if (!val) return Promise.reject('请选择材料类别');
  //         return Promise.resolve();
  //       },
  //     },
  //   ],
  // },
  {
    field: 'lotNo',
    component: 'Input',
    label: 'Lot No.',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'innerMaterialCode', // 原insidePartNumber
    label: '内部物料编码',
    component: 'ApiSelect',
    componentProps: {
      api: getInnermaterialnumberlist,
      placeholder: '请选择产品料号',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'InnerMaterialNumber',
      },
      resultField: 'data',
      valueField: 'insidePartNumber',
      labelField: 'insidePartNumber',
      immediate: true,
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'innerMaterialDescription', // 原productDesc
    component: 'Input',
    label: '内部物料描述',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'purchaseNo', // 原poNo
    component: 'Input',
    label: '采购单号',
  },
  {
    field: 'materialInDate', // 原typea
    label: '来料日期',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      disabledDate: current => {
        return current && current > dayjs().endOf('day');
      },
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  // {
  //   field: 'supplierId',
  //   label: '供应商',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getSupplierlist,
  //     placeholder: '请选择供应商',
  //     showSearch: true,
  //     apiSearch: {
  //       show: true,
  //       searchName: 'searchKey',
  //     },
  //     resultField: 'data',
  //     valueField: 'id',
  //     labelField: 'name',
  //     immediate: true,
  //   },
  // },
  {
    field: 'supplierName', // 原types
    component: 'Input',
    label: '供应商',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'supplierNo', // 原types
    component: 'Input',
    label: '供应商编号',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'materialInCount', // 原typed
    component: 'InputNumber',
    componentProps: {
      min: 0,
    },
    label: '来料数量',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  {
    field: 'materialInUnit', // 原typef
    label: '来料单位',
    defaultValue: 'PCS', // 默认PCS
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      searchKey: 'InnerMaterialNumber',
      placeholder: '请选择',
      showSearch: false,
      resultField: 'data',
      valueField: 'Code',
      labelField: 'Name',
      filterOption: false,
      immediate: true,
      disabled: false,
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
  // {
  //   field: 'materialType', // 原typeg（新增映射）
  //   component: 'Input',
  //   label: '材料规格',
  // },
  // {
  //   field: 'materialCodeFacatoryArea', // 原typeh
  //   label: '材料厂区',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getFactoryAreaList,
  //     placeholder: '请选择厂区',
  //     showSearch: true,
  //     apiSearch: {
  //       show: true,
  //       searchName: 'searchKey',
  //     },
  //     resultField: 'data',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //     useChangeCopy: true,
  //     labelField: 'name',
  //     valueField: 'code',
  //   },
  // },
  // {
  //   field: 'materialInWarehouse', // 原typej
  //   component: 'Input',
  //   label: '来料仓库',
  // },
  // {
  //   field: 'supplierInMaterialLotNo', // 原typek
  //   component: 'Input',
  //   label: '供应商来料批次号',
  //   colProps: { span: 10 },
  // },
  // {
  //   field: 'productionDate', // 原typel（数据源无此字段）
  //   component: 'DatePicker',
  //   label: '生产日期',
  //   colProps: { span: 7 },
  // },
  // {
  //   field: 'expiryDate', // 原typem（数据源无此字段）
  //   component: 'DatePicker',
  //   label: '有效日期',
  //   colProps: { span: 7 },
  // },
];
