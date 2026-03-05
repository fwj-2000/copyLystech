import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/qualityAssurance/cpk';
import { useI18n } from '/@/hooks/web/useI18n';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
import { nextTick } from 'vue';
const baseStore = useBaseStore();

const { t } = useI18n();
export const getSchema = [
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      allowClear: true,
      api: getFactoryList,
      showSearch: true,
      apiSearch: {
        show: true,
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Code', '/', 'Name'],
      filterOption: (keyword, data) => {
        if (data.label.includes(keyword)) {
          return true;
        }
      },
    },
  },
  {
    fieldName: 'locationCode',
    label: '',
    i18nField: 'locationCode',
    component: 'Input',
    componentProps: {
      allowClear: true,
      showSearch: true,
    },
  },
];

export const getColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: '工厂',
    field: 'factoryName',
    width: 240,
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    width: 240,
  },
  {
    title: '仓位类型',
    field: 'locationTypeName',
    minWidth: 140,
  },
  {
    title: '产品类型',
    field: 'productTypeName',
    minWidth: 140,
  },

  {
    title: '工单类型',
    field: 'workOrderTypeName',
    width: 240,
  },

  {
    title: '仓位代码',
    field: 'locationCode',
    minWidth: 140,
  },
  {
    title: '仓位工厂',
    field: 'locFactoryCode',
    width: 240,
  },
  {
    title: '备注',
    field: 'remark',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 70,
    fixed: 'right',
  },
];

export const getAddColumns = [
  {
    title: '工厂',
    field: 'factory',
    minWidth: 100,
    width: 220,
    formatter: 'ApiSelect',
    editRender: {
      cacheField: 'factoryName',
      name: 'ApiSelect',
      props: {
        api: getFactoryList,
        allowClear: true,
        showSearch: true,
        apiSearch: {
          show: true,
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        filterOption: (keyword, data) => {
          if (data.label.includes(keyword)) {
            return true;
          }
        },
        immediate: true,
        onChange: (_value: string, option: any, { row }) => {
          handleFactoryCode(option, row);
        },
      },
    },
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    width: 140,
    editRender: {
      name: 'ApiSelect',
      props: {
        api: filterSapFactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        rowParams: {
          factoryCode: 'factory',
        },
        resultField: 'data',
        labelField: 'code',
        valueField: 'code',
        filterOption: false,
        immediate: true,
        // nameFormat: ['code', '/', 'sapCompanyName'],
        onChange: (_value: string, option: any, { row }) => {
          handleSapFactoryCode(option, row);
        },
      },
    },
  },
  {
    title: 'SAP工厂名称',
    field: 'sapFactoryName',
    width: 140,
  },
  {
    title: '仓位类型',
    field: 'locationType',
    width: 140,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // cacheField: 'locationTypeName',
      props: {
        api: () => baseStore.getDictionaryData('CPKLocationType'),
        showSearch: false,
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
      },
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    width: 140,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('warehouseProductType', true),
        showSearch: false,
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
      },
    },
  },
  {
    title: '工单类型',
    field: 'workOrderType',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('WorkOrder.Type'),
        showSearch: true,
        labelField: 'fullName',
        valueField: 'enCode',
        optionFilterProp: 'label',
        immediate: true,
        filterOption: true,
      },
    },
    minWidth: 100,
  },
  {
    title: '仓位代码',
    field: 'locationCode',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '仓位工厂',
    field: 'locFactoryCode',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '备注',
    field: 'remark',
    minWidth: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

/** SAP工程代码 变更处理 */
export function handleSapFactoryCode(option: any, row: any) {
  row.sapFactoryName = option?.name || '';
}

/** 工厂代码 变更处理 */
export function handleFactoryCode(option: any, row: any) {
  row.sapFactory = '';
  nextTick(() => {
    row.sapFactoryName = '';
  });
}

/** 筛选可选工厂选项 */
export function filterFactory(params: { mainProcess: string | number; keyword?: string }) {
  if (factoryOptions.length === 0) {
    return Promise.resolve({ data: [] });
  }
  return Promise.resolve({
    data: factoryOptions.filter(item => +item.MainProcess === +params.mainProcess && (!params.keyword || item.Code.includes(params.keyword))),
  });
}

/** 筛选可选的Sap工厂选项 */
export function filterSapFactory(params: { factoryCode?: string; keyword?: string }) {
  if (sapFactoryOptions.length === 0) {
    return Promise.resolve({ data: [] });
  }
  const sapdata: Array<string> = [];
  return Promise.resolve({
    data: sapFactoryOptions.filter((item: any) => {
      if (sapdata.some(sap => sap == item.code)) {
        return false;
      }
      sapdata.push(item.code);
      return (!params.factoryCode || item.factoryCode === params.factoryCode) && (!params.keyword || item.code.includes(params.keyword));
    }),
  });
}
/** 主要制程 */
export const mainProcessOptions: Array<any> = [];
/** 工厂 选项 */
export const factoryOptions: Array<{ MainProcess: number | string; Code: string; Name: string }> = [];
/** SAP工厂选项 */
export const sapFactoryOptions: Array<any> = [];
/** 仓位类型字典项 */
export const shippingSpaceTypeOpiotns: Array<any> = [];
/** 仓位归属字典项 */
export const shippingSpaceAttributionOptions: Array<any> = [];
/** 获取编辑用的基本数据 */
export async function getDcitOptions() {
  if (shippingSpaceAttributionOptions.length > 0) {
    return true;
  }
  return Promise.all([
    getFactoryList({}), // 获取全量的工厂
    getSapFactoryList({}), // 获取全量的SAP工厂
    baseStore.getDictionaryData('CPKLocationType'), // 执行一次获取全部字典，其余字典取缓存
  ])
    .then(([factoryRes, sapFactoryRes, typeRes]) => {
      factoryOptions.push(...factoryRes.data);
      sapFactoryOptions.push(...sapFactoryRes.data);
      shippingSpaceTypeOpiotns.push(...(typeRes as Array<any>));
      return Promise.all([baseStore.getDictionaryData('ShippingSpaceAttribution', true), baseStore.getDictionaryData('MainProcess', true)]);
    })
    .then(([attributionRes, mainProcessRes]) => {
      shippingSpaceAttributionOptions.push(...(attributionRes as Array<any>));
      mainProcessOptions.push(...(mainProcessRes as Array<any>));
    });
}

await getDcitOptions();
