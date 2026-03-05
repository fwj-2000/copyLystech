import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getSubclassCodeList } from '/@/api/purchase/materialBase';
import { getFactoryList } from '/@/api/customerSerivce';
import { useUserStore } from '/@/store/modules/user';

const baseStore = useBaseStore();

const { t } = useI18n();

export enum STATUS_ENUM {
  启用 = 1,
  禁用 = 2,
}

export const statusOptions = [
  { label: t('dict.enableStatus.1'), value: STATUS_ENUM.启用, fullName: t('dict.enableStatus.1'), id: STATUS_ENUM.启用, theme: 'green' },
  { label: t('dict.enableStatus.2'), value: STATUS_ENUM.禁用, fullName: t('dict.enableStatus.2'), id: STATUS_ENUM.禁用, theme: 'red' },
];

export const DETAIL_PAGE_TYPE_ENUM = {
  新增: '1',
  升版: '2',
  修改: '3',
};

const userStore = useUserStore();
export function getFormConfig() {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'semiFinishedProductsPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '半成品料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorUserId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'creatorUserName',
      componentProps: {
        placeholder: '创建人',
        defaultValue: userStore.getUserInfo?.userId,
        allowClear: true,
      },
    },
    {
      fieldName: 'factory',
      i18nField: 'CommonCol.factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        immediate: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '半成品料号',
      field: 'semiFinishedProductsPartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 180,
    },
    {
      title: '旧版半成品料号',
      field: 'oldPartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 160,
    },
    {
      title: '出货形态',
      field: 'shipPatternName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
    },
    {
      title: '是否启用',
      field: 'enableStatusEnum',
      // @ts-ignore
      i18nField: 'enableStatus',
      sortable: true,
      width: 120,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '物料类型',
      field: 'materialTypeCode',
      formatter: ({ row, cellValue }) => row.materialTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getSubclassCodeList,
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
      width: 120,
    },
    {
      title: '工厂',
      field: 'factoryNames',
      width: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        searchField: 'factory',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          immediate: true,
        },
      },
    },
    {
      title: '半成品描述',
      field: 'semiFinishedProductsDesc',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '生产类型',
      field: 'productionType',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('ProductionTypeEnum'),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
      },
      width: 120,
    },
    {
      title: '备注',
      field: 'remarks',
      // sortable: true,
      width: 200,
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      // sortable: true,
      width: 200,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      // sortable: true,
      width: 200,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', searchField: 'lastModifyUserId' },
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '主要制程',
      field: 'mainProcess',
      // sortable: true,
      width: 200,
    },
  ];
}

/** 生产类型 选项 */
export const productionTypeOptions: any[] = [];
const getProductionTypeOptions = () =>
  baseStore.getDictionaryData('ProductionTypeEnum').then(res => {
    productionTypeOptions.push(...(res as any[]));
  });

/** 统一加载字典 */
export async function getDictOptions() {
  if (productionTypeOptions.length > 0) {
    return true;
  }
  return getProductionTypeOptions();
}
await getDictOptions();
