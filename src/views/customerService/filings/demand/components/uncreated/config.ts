import { useI18n } from '/@/hooks/web/useI18n';
import { getImUserSelector } from '/@/api/permission/user';
// import { getFactoryList } from '/@/api/engineering/sample';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const userStore = useUserStore();

export function getFormConfig() {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
        // api: getFactoryList,
        // showSearch: true,
        // apiSearch: {
        //   show: true,
        //   searchName: 'Name',
        // },
        // resultField: 'data',
        // labelField: 'Name',
        // valueField: 'Code',
        // filterOption: false,
      },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户料号', allowClear: true },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '终端客户料号', allowClear: true },
    },
    {
      fieldName: 'customersId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customersName',
      componentProps: {
        placeholder: '客服',
        defaultValue: userStore.getUserInfo?.userId,
      },
    },
  ];
}

export function getColumns() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    { title: '来源单号', field: 'sourceNo', width: 150 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    {
      title: '工厂',
      field: 'factory',
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
      width: 150,
    },
    // { title: '出货备案法人', field: 'SellCorporation', width: 150 },
    { title: '直接客户料号', field: 'immediateCustomerPartNumber', width: 150 },
    { title: '终端客户料号', field: 'terminalCustomerPartNumber', width: 150 },
    { title: '终端项目代码', field: 'terminalCustomerProjectCode', width: 150 },
    { title: '直接客户信息', field: 'immediateCustomerName', filters: [{ data: '' }], filterRender: { name: 'Input' }, width: 150 },
    {
      title: '销售',
      field: 'salesId',
      i18nField: 'salesName',
      width: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: (params: any) => {
            return params.keyword ? getImUserSelector(0, params) : Promise.resolve({ data: { list: [] } });
          },
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data.list',
          labelField: 'fullName',
          valueField: 'id',
          showSearch: true,
          immediate: false,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      formatter: ({ cellValue, row }) => row.salesName || cellValue || '',
    },
    {
      title: '客服',
      field: 'customersId',
      i18nField: 'customersName',
      width: 150,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'ApiSelect',
      //   props: {
      //     api: (params: any) => {
      //       return params.keyword ? getImUserSelector(0, params) : Promise.resolve({ data: { list: [] } });
      //     },
      //     apiSearch: {
      //       show: true,
      //       searchName: 'keyword',
      //     },
      //     resultField: 'data.list',
      //     labelField: 'fullName',
      //     valueField: 'id',
      //     showSearch: true,
      //     immediate: false,
      //     alwaysLoad: true,
      //     filterOption: false,
      //     notFoundContent: null,
      //   },
      // },
      formatter: ({ cellValue, row }) => row.customersName || cellValue || '',
    },
    {
      title: '申请人',
      field: 'creatorUserName',
      i18nField: 'applyUserName',
      width: 150,
    },
  ];
}

export const importColumns = [
  {
    title: '产品内部料号',
    dataIndex: 'insidePartNumber',
  },
  {
    title: '工厂',
    dataIndex: 'factory',
  },
  {
    title: '出货备案法人',
    dataIndex: 'sellCorporation',
  },
  {
    title: '备案语言',
    dataIndex: 'filingsLanguage',
  },
  {
    title: '口岸',
    dataIndex: 'prot',
  },
  {
    title: '出货方式',
    dataIndex: 'shipmentType',
  },
  {
    title: 'PD',
    field: 'pdPersonName',
    // i18nField: 'pdPersonName',
  },
  {
    title: '关务',
    field: 'customsPersonName',
    // i18nField: 'customsPersonName',
  },
];

// 基础信息
export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};

// 简表
export const simpleDesc = [
  {
    title: t('dict.FilingsApplyColumn.FilingsApplyNo'),
    dataIndex: 'FilingsApplyNo',
  },
  {
    title: t('dict.FilingsApplyColumn.KfApplyUserName'),
    dataIndex: 'ApplyUserName',
  },
  {
    title: t('dict.FilingsApplyColumn.KfApplyDeptName'),
    dataIndex: 'ApplyDeptName',
  },
  {
    title: t('dict.FilingsApplyColumn.KfApplyDate'),
    dataIndex: 'ApplyDate',
    format: 'date|YYYY-MM-DD HH:MM',
  },
];
