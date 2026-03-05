import { IS_ENABLE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getReviewStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getShipList } from '/@/api/common/basedata';
export const formSchema = [
  {
    label: '',
    fieldName: 'factory',
    i18nField: 'CommonCol.factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactoryList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
    },
  },
  {
    label: '',
    fieldName: 'shippingSpaceCode',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '仓位',
      api: getShipList,
      afterFetch: (res: { data: Array<{ shippingSpaceCode: string }> }) => {
        if (!Array.isArray(res?.data) || res.data.length === 0) {
          return res;
        }
        // 对返回的数据`res.data`根据`shippingSpaceCode`去重
        res.data = [...new Set(res.data.map(item => item.shippingSpaceCode))].map(item => ({
          shippingSpaceCode: item,
        }));
        return res;
      },
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'shippingSpace',
      },
      resultField: 'data',
      labelField: 'shippingSpaceCode',
      valueField: 'shippingSpaceCode',
    },
  },
  {
    label: '',
    fieldName: 'creatorUserId',
    i18nField: 'creatorUserName',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '创建人',
    },
  },
  {
    label: '',
    fieldName: 'lastModifyUserId',
    i18nField: 'CommonCol.updateUser',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '修改人',
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '工厂',
    field: 'factory',
    width: 200,
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    width: 200,
  },
  {
    title: '仓位',
    field: 'shippingSpaceCode',
    width: 300,
  },
  {
    title: '仓位地址',
    field: 'shippingAddress',
    width: 360,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '仓管员',
    field: 'warehouseKeeperNames',
    width: 450,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '审核状态',
    field: 'statusEnum',
    i18nField: 'CommonCol.status',
    width: 150,
    cellRender: {
      name: 'Tag',
      options: getReviewStatus('status'),
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      searchField: 'status',
      options: getReviewStatus('status'),
    },
  },
  {
    title: '审核人',
    field: 'reviewUserName',
    width: 180,
  },
  {
    title: '审核时间',
    field: 'reviewDate',
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'DateRange',
      searchField: ['reviewStartDate', 'reviewEndDate'],
    },
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '是否启用',
    field: 'enableStatusEnum',
    i18nField: 'enableStatus',
    width: 150,
    cellRender: {
      name: 'Tag',
      options: IS_ENABLE_LIST,
    },
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'enableStatus',
      name: 'VxeSelect',
      options: IS_ENABLE_LIST,
    },
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    width: 150,
    sortable: true,
  },
  // { title: '备注', field: 'pmDesc', key: 'pmDesc', width: 120 },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 180,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    i18nField: 'CommonCol.creatorTime',
    width: 150,
    cellRender: {
      name: 'Date',
    },
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'DateRange',
      searchField: ['crStartTime', 'crEndTime'],
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    i18nField: 'CommonCol.updateUser',
    width: 180,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    i18nField: 'CommonCol.updateTime',
    cellRender: {
      name: 'Date',
    },
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'DateRange',
      searchField: ['lastStartTime', 'lastEndTime'],
    },
  },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
