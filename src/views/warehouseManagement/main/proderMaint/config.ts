import { IS_ENABLE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getReviewStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { getFactoryList } from '/@/api/business/shippingspace';
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
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  {
    title: '工厂',
    field: 'factory',
    i18nField: 'CommonCol.factory',
    width: 200,
  },
  {
    title: '制单员',
    field: 'swipeUserName',
    minWidth: 120,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '审核状态',
    field: 'statusEnum',
    i18nField: 'CommonCol.status',
    minWidth: 150,
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
    minWidth: 180,
  },
  {
    title: '审核时间',
    field: 'reviewDateTime',
    minWidth: 150,
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
    title: '领料人',
    field: 'receiveMoldUserNames',
    minWidth: 450,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '退料人',
    field: 'refundMoldUserNames',
    minWidth: 450,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '是否启用',
    field: 'enableStatusEnum',
    i18nField: 'enableStatus',
    minWidth: 150,
    cellRender: {
      name: 'Tag',
      options: IS_ENABLE_LIST,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      searchField: 'enableStatus',
      options: IS_ENABLE_LIST,
    },
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    minWidth: 150,
    sortable: true,
  },
  // { title: '备注', field: 'pmDesc', key: 'pmDesc', minWidth: 120 },
  {
    title: '创建人',
    field: 'creatorUserName',
    minWidth: 180,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    i18nField: 'CommonCol.creatorTime',
    minWidth: 150,
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
    minWidth: 180,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    i18nField: 'CommonCol.updateTime',
    cellRender: {
      name: 'Date',
    },
    minWidth: 150,
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
