import { useI18n } from '/@/hooks/web/useI18n';
// import { getFactoryList } from '/@/api/engineering/sample';

const { t } = useI18n();

export enum DOWNLOAD_STATUS_ENUM {
  未下载 = 1,
  已下载 = 2,
}

export const downloadStatusOptions = [
  { fullName: t('common.notDownloaded'), id: DOWNLOAD_STATUS_ENUM.未下载, theme: 'gray' },
  { fullName: t('common.downloaded'), id: DOWNLOAD_STATUS_ENUM.已下载, theme: 'green' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'sourceNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '备案单号', allowClear: true },
    },
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
        //   searchName: 'factoryCode',
        // },
        // resultField: 'data',
        // labelField: 'Name',
        // valueField: 'Code',
        // filterOption: false,
      },
    },
    {
      fieldName: 'customsPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customsPersonName',
      componentProps: { placeholder: '关务', allowClear: true },
    },
    {
      fieldName: 'downloadStatus',
      label: '',
      component: 'Select',
      i18nField: 'status',
      componentProps: { options: downloadStatusOptions, fieldNames: { label: 'fullName', value: 'id' }, allowClear: true },
    },
  ];
}

export function getColumns() {
  return [
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
    {
      field: 'downloadStatus',
      i18nField: 'status',
      title: '状态',
      width: '100',
      cellRender: {
        name: 'Tag',
        options: downloadStatusOptions,
      },
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'ASelect',
      //   props: {
      //     options: downloadStatusOptions,
      //     fieldNames: { label: 'fullName', value: 'id' },
      //   },
      // },
    },
    { title: '来源单号', field: 'sourceNo', width: 150 },
    {
      title: '备案需求单号',
      field: 'filingsApplyNo',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 220 },
    {
      title: '工厂',
      field: 'factory',
      width: 220,
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 220,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    { title: '直接客户料号', field: 'immediateCustomerPartNumber', width: 220 },
    { title: '终端客户料号', field: 'terminalCustomerPartNumber', width: 220 },
    {
      title: '关务',
      field: 'customsPersonId',
      i18nField: 'customsPersonName',
      formatter: ({ cellValue, row }) => row.customsPersonName || cellValue || '',
      width: 220,
    },
    {
      title: '客服',
      field: 'customersId',
      i18nField: 'customersName',
      formatter: ({ cellValue, row }) => row.customersName || cellValue || '',
      width: 220,
      filters: [{ data: '' }],
      filterRender: {
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('common.action'),
      width: 60,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}
