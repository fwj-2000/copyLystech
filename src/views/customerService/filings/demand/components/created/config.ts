import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/engineering/sample';
import { getImUserSelector } from '/@/api/permission/user';
import { useUserStore } from '/@/store/modules/user';
import { statusOptions } from '../../config';

export { statusOptions, STATUS_ENUM } from '../../config';

const { t } = useI18n();
const baseStore = useBaseStore();
const userStore = useUserStore();

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
    { title: '备案需求单号', field: 'filingsApplyNo', width: 200 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    {
      title: '状态',
      field: 'status',
      i18nField: 'status',
      width: 100,
      sortable: true,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      i18nField: 'CommonCol.currentNodeUser',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNode',
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 200,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '口岸',
      field: 'protName',
      i18nField: 'prot',
      width: 100,
      formatter: ({ cellValue, row }) => cellValue || row.prot || '',
    },
    {
      title: '出货方式',
      field: 'shipmentType',
      width: 100,
      formatter: ({ cellValue, row }) => row.shipmentTypeName || cellValue || '',
    },
    { title: '出货备案法人', field: 'sellCorporation', width: 150 },
    {
      title: '备案语言',
      field: 'filingsLanguage',
      width: 100,
      formatter: ({ cellValue, row }) => row.filingsLanguageName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('FilingLanguage'),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
        },
      },
    },
    {
      title: '工厂',
      field: 'factory',
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
      width: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          apiSearch: {
            show: true,
            searchName: 'Name',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: 'PD',
      field: 'pdPersonName',
      i18nField: 'pdPersonName',
      filters: [{ data: '' }],
      width: 150,
      filterRender: {
        name: 'CustomUserSelect',
      },
      // formatter: ({ cellValue, row }) => row.pdPersonName || cellValue || '',
    },
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
      formatter: ({ cellValue, row }) => row.customersName || cellValue || '',
    },
    {
      title: '申请人',
      field: 'creatorUserName',
      i18nField: 'applyUserName',
      width: 150,
    },
    {
      title: '申请备案时间',
      field: 'applyDate',
      width: 120,
      sortable: true,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:MM:SS',
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

export function getFormConfig() {
  return [
    {
      fieldName: 'filingsApplyNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '备案需求单号', allowClear: true },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'time',
      label: '',
      component: 'RangePicker',
      componentProps: { placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')], allowClear: true },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      componentProps: { placeholder: '状态', options: statusOptions, fieldNames: { label: 'fullName', value: 'id' }, allowClear: true },
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
