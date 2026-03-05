import { getConfigTypes } from '/@/api/business/member';
import { getSupplierList } from '/@/api/equipment/information';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

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

export const StatusList = [
  {
    id: 1,
    fullName: t('dict.enableStatus.1'),
    label: t('dict.enableStatus.1'),
    value: 1,
    theme: 'green',
  },
  {
    id: 2,
    fullName: t('dict.enableStatus.2'),
    label: t('dict.enableStatus.2'),
    value: 2,
    theme: 'red',
  },
];
export const commonCols = [
  { title: '材料归属', field: 'MaterialAreaName', width: 120 },
  { title: '材料内部料号', field: 'MaterialCode', width: 160 },
  // {
  //   title: '材料形态',
  //   field: 'MaterialForm',
  // },
  { title: '原厂商型号', field: 'OriginalModelNumber', width: 160 },
  // { title: '供应商简称', field: 'SupplierName' },
  // { title: '原厂商简称', field: 'OriginalManufacturerName' },
  // { title: '材料类型', field: 'MaterialClassName' },
  // { title: '三级分类', field: 'ThreeLevelName' },
  // { title: '基材类型', field: 'MaterialQualityName' },
  { title: '材料宽度(MM)', field: 'MaterialWidth', width: 120 },
  { title: '材料长度(M)', field: 'MaterialLength', width: 120 },
  { title: '总厚度(MM)', field: 'TotalThickness', width: 120 },
  // { title: '厚度单位', field: 'ThicknessUnit', width: 120 },
  // { title: '涂层厚度', field: 'Tds' },
  // { title: '涂层类型', field: 'CoatingType' },
  // { title: '基材厚度', field: 'SubstrateThickness' },
  // { title: '厚度公差', field: 'Tolerance' },
  { title: '材料规格', field: 'MaterialSpec', width: 200 },
  // { title: '克重', field: 'Grammage' },
  // { title: '结构组成', field: 'Layers' },
  // { title: '颜色', field: 'MaterialColor' },
  // { title: '其他要求', field: 'OtherRequirements' },
  // { title: '抗静电功能', field: 'AntistaticRequirements' },
  { title: '材料描述', field: 'MaterialDesc', baseCols: { cols: 24 }, filters: [{ data: '' }], filterRender: { name: 'Input' }, width: 200 },
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
    width: '50',
    align: 'center',
  },
  // { title: '材料内部料号', field: 'MaterialCode' },
  ...commonCols,
  { title: '主要制程', field: 'MainProcessDesc', width: 100, i18nField: 'CommonCol.mainProcess' },
  {
    title: '是否启用',
    field: 'Status',
    width: 100,
    // format: 'tag|' + JSON.stringify(StatusList),
    cellRender: {
      name: 'Tag',
      options: StatusList,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: StatusList,
      },
    },
  },
  // { title: '技术资料', field: 'files', width: 100 },
  {
    title: '创建时间',
    field: 'CreatorTime',
    i18nField: 'CreatorDateTime',
    // format: 'date|YYYY/MM/DD',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  { title: '创建人', field: 'CreatorUserName' },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    i18nField: 'LastModifyDateTime',
    // format: 'date|YYYY/MM/DD',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  { title: '修改人', field: 'LastModifyUserName' },
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
];

const baseStore = useBaseStore();

export const baseFormConfig = [
  {
    field: 'MaterialCode',
    label: '物料编码',
    component: 'Input',
    componentProps: {
      placeholder: '待录入',
    },
  },
  {
    field: 'MainProcess',
    i18nField: 'CommonCol.mainProcess',
    label: '主要制程',
    component: 'ApiSelect',
    componentProps: {
      api: getMainProcess,
      showSearch: false,
      resultField: '',
      labelField: 'fullName',
      valueField: 'id',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  // {
  //   field: 'DocumentControlId',
  //   label: '文控',
  //   component: 'CustomUserSelect',
  //   componentProps: {},
  // },
  {
    field: 'MaterialAreaId',
    label: '材料归属',
    component: 'ApiSelect',
    componentProps: {
      api: getMaterialList,
      params: {
        isSelectRoot: 'true',
        displayArea: 'MaterialWarehouse',
      },
      fieldNames: {
        value: 'id',
        label: 'fullName',
      },
      resultField: 'data.list',
    },
  },
  {
    field: 'OriginalModelNumber',
    label: '原厂型号',
    component: 'Input',
    componentProps: {},
  },
  {
    field: 'SupplierId',
    label: '供应商简称',
    component: 'ApiSelect',
    componentProps: {
      api: getSupplierList,
      fieldNames: {
        value: 'id',
        label: 'shortName',
      },
      apiSearch: {
        show: true,
        searchName: 'supplierName',
      },
      resultField: 'data',
      nameFormat: ['shortName', '/', 'code'],
    },
  },
  {
    field: 'OriginalManufacturerName',
    label: '原厂商简称',
    component: 'Input',
    componentProps: {
      // api: getSupplierList,
      // searchKey: 'supplierName',
      // fieldNames: {
      //   value: 'id',
      //   label: 'name',
      // },
      // resultField: 'data',
      // nameFormat: ['name', '/', 'code'],
    },
  },
  {
    field: 'MaterialClassId',
    label: '材料类型',
    component: 'Select',
    componentProps: {},
  },
  {
    field: 'ThreeLevelName',
    label: '三级分类',
    component: 'Input',
    componentProps: {},
  },
  {
    field: 'MaterialDesc',
    label: '材料描述',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 18,
    },
  },
];
export const typesBaseConfig = [
  {
    field: 'MaterialQualityId',
    label: '基材类型',
    component: 'Select',
    componentProps: {},
  },
  {
    field: 'TotalThickness',
    label: '总厚度(μm)',
    component: 'InputNum',
    componentProps: {},
  },
  {
    field: 'Tds',
    label: '涂层厚度(μm)',
    component: 'InputNum',
    componentProps: {},
  },
  {
    field: 'CoatingTypeEnCode',
    label: '涂层类型',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        return await baseStore.getDictionaryData('CoatingTypeEnum');
      },
      showSearch: false,
      resultField: '',
      fieldNames: {
        value: 'enCode',
        label: 'fullName',
      },
    },
  },
  {
    field: 'SubstrateThickness',
    label: '基材厚度(μm)',
    component: 'InputNum',
    componentProps: {},
  },
  {
    field: 'Tolerance',
    label: '厚度公差(μm)',
    component: 'InputNum',
    componentProps: {},
  },
  {
    field: 'Grammage',
    label: '克重',
    component: 'InputNum',
    componentProps: {},
  },
  {
    field: 'LayersEnCode',
    label: '结构组成',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        return await baseStore.getDictionaryData('SingleDoubleLayerEnum');
      },
      showSearch: false,
      resultField: '',
      fieldNames: {
        value: 'enCode',
        label: 'fullName',
      },
    },
  },
  {
    field: 'MaterialColor',
    label: '颜色',
    component: 'Input',
    componentProps: {},
  },
  {
    field: 'Remark',
    label: '备注',
    component: 'Input',
    componentProps: {},
  },
  {
    field: 'AntistaticRequirements',
    label: '抗静电功能',
    component: 'Input',
    componentProps: {},
  },
];

// 排序
export function sortByOrderList(list: any[], orderList: string[]) {
  const res: any = [];
  for (let i = 0; i < orderList.length; i++) {
    const item = list.find(item => item.id === orderList[i]);
    if (item) {
      res.push(item);
    }
  }
  return res;
}
