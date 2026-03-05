import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getKeywordlist } from '/@/api/purchase/outsourcemanage';
import { getunitList } from '/@/api/common/constant';
import { getListbyfactory } from '/@/api/warehouse/warehouse';

const baseStore = useBaseStore();

export const MODULE_TEMPLATE = {
  transformTag: null,
  workOrderNo: null,
  warehouseCode: null,
  unit: null,
  warehouseKeeperId: null,
  documentNumber: null,
};

export const ADD_COLUMNS: any[] = [
  {
    title: '流转标签',
    dataIndex: 'transformTag',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      suffixIcon: 'icon-ym icon-ym-scanCode1',
      placeholder: '请输入或扫描标签',
    },
  },
  {
    title: '工单号',
    dataIndex: 'workOrderNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
    },
  },
  {
    title: '模具编号',
    dataIndex: 'moldNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
    },
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    isEdit: true,
    inputType: '',
    cpmType: 'ApiSelect',
    cpmSetting: {
      placeholder: '请选择',
      showSearch: false,
      resultField: 'data',
      valueField: 'enCode',
      labelField: 'fullName',
      filterOption: false,
      immediate: true,
      api: () => baseStore.getDictionaryData('warehouseProductType'),
    },
  },
  {
    title: '仓库代码',
    dataIndex: 'warehouseCode',
    isEdit: true,
    inputType: '',
    cpmType: 'ApiSelect',
    cpmSetting: {
      api: getListbyfactory,
      placeholder: '请选择',
      showSearch: false,
      resultField: 'data',
      valueField: 'code',
      labelField: 'name',
      filterOption: false,
      immediate: false,
      disabled: false,
    },
  },
  {
    title: '计划入库数量',
    dataIndex: 'planStoreQuantity',
    isEdit: true,
    inputType: 'number',
    cpmType: 'Input',
    cpmSetting: { placeholder: '请输入', min: 1 },
  },
  {
    title: '计量单位',
    dataIndex: 'unit',
    isEdit: true,
    inputType: '',
    cpmType: 'ApiSelect',
    cpmSetting: {
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
  },
  {
    title: '仓库管理员',
    dataIndex: 'warehouseKeeperId',
    isEdit: true,
    inputType: '',
    cpmType: 'CustomUserSelect',
    cpmSetting: {
      placeholder: '请输入',
      showSearch: false,
      resultField: 'data',
      valueField: 'id',
      labelField: 'name',
      filterOption: false,
      immediate: false,
    },
  },
  {
    title: '单据号',
    dataIndex: 'documentNumber',
    isEdit: true,
    inputType: 'number',
    width: 260,
    cpmType: 'Input',
    cpmSetting: { placeholder: '自动带入', disabled: true },
  },
  {
    title: '仓库名称',
    dataIndex: 'warehouseName',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: { placeholder: '自动带入', disabled: true },
  },
  {
    title: 'LotNo',
    dataIndex: 'lotNo',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: { placeholder: '请输入' },
  },
  {
    title: '描述',
    dataIndex: 'depiction',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: { placeholder: '请输入' },
  },
];

export const REVIEW_COLUMNS: any[] = [
  { title: '单据号', dataIndex: 'documentNumber' },
  { title: '工单号', dataIndex: 'workOrderNo' },
  { title: '仓库代码', dataIndex: 'warehouseCode' },
  { title: '计量单位', dataIndex: 'unitName' },
  { title: '仓库名称', dataIndex: 'warehouseName' },
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '计划入库数量', dataIndex: 'planStoreQuantity' },
  { title: '实际入库数量', dataIndex: 'actualStoreQuantity' },
];
