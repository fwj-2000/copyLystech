import { useI18n } from '/@/hooks/web/useI18n';
import { shippingSpaceTypeOpiotns, shippingSpaceAttributionOptions, factoryOptions, sapFactoryOptions, mainProcessOptions } from '../config';

const { t } = useI18n();

//  新加数据的初始值
export const columnsOps = {
  isCalcWithMRP: '',
  shippingSpaceCode: '',
  shippingSpaceName: '',
  factoryId: '',
  factoryCode: '',
  factoryName: '',
  remarks: '',
};

export const mainCoulumn = [
  {
    title: '主要制程',
    field: 'mainProcess',
    i18nField: 'CommonCol.mainProcess',
    width: 140,
    formatter: ({ row }) => {
      if (row.mainProcessName) {
        return row.mainProcessName;
      }
      const target = mainProcessOptions.find(item => +item.enCode === +row.mainProcess);
      return target?.fullName || row.mainProcess;
    },
  },
  {
    title: '是否参与MRP计算',
    field: 'isCalcWithMRP',
    i18nField: 'isCalcWithMRPDes',
    width: 150,
    editRender: {
      cacheField: 'isCalcWithMRPDes',
      name: 'ASelect',
      props: {
        options: [
          { id: 1, fullName: t('dict.isOpen.1') },
          { id: 2, fullName: t('dict.isOpen.2') },
        ],
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
  },
  {
    title: '工厂代码',
    field: 'factoryCode',
    i18nField: 'CommonCol.factoryCode',
    width: 140,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryCode',
      props: {
        api: filterFactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        rowParams: {
          mainProcess: 'mainProcess',
        },
        resultField: 'data',
        labelField: 'Code',
        valueField: 'Code',
        filterOption: false,
        onChange: (_value: string, option: any, { row }) => {
          handleFactoryCode(option, row);
        },
      },
    },
  },
  {
    title: '工厂名称',
    field: 'factoryName',
    i18nField: 'CommonCol.factoryName',
    width: 140,
  },
  {
    title: 'SAP工厂代码',
    field: 'sapFactoryCode',
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
          factoryCode: 'factoryCode',
        },
        resultField: 'data',
        labelField: 'code',
        valueField: 'code',
        filterOption: false,
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
    title: '仓位编码',
    field: 'shippingSpaceCode',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '仓位名称',
    field: 'shippingSpaceName',
    width: 140,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '仓位类型',
    field: 'type',
    width: 140,
    editRender: {
      name: 'ASelect',
      props: {
        options: shippingSpaceTypeOpiotns,
        fieldNames: { label: 'fullName', value: 'enCode' },
      },
    },
  },
  {
    title: '仓位归属',
    field: 'attribution',
    width: 140,
    editRender: {
      name: 'ASelect',
      props: {
        options: shippingSpaceAttributionOptions,
        fieldNames: { label: 'fullName', value: 'enCode' },
      },
    },
  },
  {
    title: '备注',
    field: 'remarks',
    i18nField: 'CommonCol.remark',
    minWidth: 200,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: t('common.action'),
    width: 80,
    slots: { default: 'action' },
    fixed: 'right',
    field: 'action',
  },
];

/** SAP工程代码 变更处理 */
export function handleSapFactoryCode(option: any, row: any) {
  console.log('option', option);
  row.sapFactoryName = option?.name || '';
}

/** 工厂代码 变更处理 */
export function handleFactoryCode(option: any, row: any) {
  row.factoryName = option?.Name || '';
  row.factoryId = option?.Id || '';
  row.sapFactoryName = '';
  row.sapFactoryCode = '';
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
  const list = sapFactoryOptions.filter((item: any) => {
    if (sapdata.some(sap => sap === item.code)) {
      return false;
    }
    const flag = (!params.factoryCode || item.factoryCode === params.factoryCode) && (!params.keyword || item.code.includes(params.keyword));
    if (flag) {
      sapdata.push(item.code);
    }
    return flag;
  });
  return Promise.resolve({
    data: list,
  });
}
