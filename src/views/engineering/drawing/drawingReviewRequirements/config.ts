import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
export const CURRENT_RM_NODE = 'DrawingsReviewReqApply';

export const columnsVxe = [
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  {
    title: '单号',
    field: 'applyCode',
    i18nField: 'applyNo',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 180,
    sortable: true,
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    minWidth: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工厂',
    field: 'factory',
    width: 200,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: 'PDT Leader',
    field: 'epmName',
    width: 200,
    sortable: true,
  },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    width: 140,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '直接客户料号',
    field: 'immediateCustomerPartNumber',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '直接客户项目代码',
    field: 'immediateCustomerProjectCode',
    width: 150,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 160,
  },
  {
    title: '产品描述',
    field: 'productDesc',
    width: 300,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: STATUS_OPTIONS,
    },
    sortable: true,
  },
  {
    title: '当前处理人',
    field: 'handleName',
    width: 160,
    sortable: true,
  },
  {
    title: '当前节点',
    field: 'currentNode',
    i18nField: 'CommonCol.currentNode',
    width: 160,
    sortable: true,
    aqpFilter: {
      enabled: false,
    },
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 160,
    slots: {
      default: 'nodeDetail',
    },
    aqpFilter: {
      enabled: false,
    },
  },
  { title: '备注', field: 'nodeRemark', importField: 'remark', width: 120, cellRender: { name: 'Remark', nodeCode: CURRENT_RM_NODE } },
  { title: '申请人', field: 'applyUserName', key: 'applyUserName', minWidth: 200, sortable: true },
  // { title: '申请部门', field: 'applyDeptName', key: 'applyDeptName', minWidth: 150, sortable: true },
  {
    title: '申请时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
    minWidth: 150,
    sortable: true,
  },
  // { title: '修改人', field: 'lastModifyUserName', key: 'lastModifyUserName', i18nField: 'CommonCol.updateUser', minWidth: 180, sortable: true },
  // {
  //   title: '修改时间',
  //   field: 'lastModifyTime',
  //   i18nField: 'CommonCol.updateTime',
  //   cellRender: {
  //     name: 'Date',
  //   },
  //   minWidth: 150,
  //   sortable: true,
  // },
  {
    title: '操作',
    field: 'action',
    width: 50,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

// 查询条件
export const schemaFormConfig = () => [
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '产品内部料号', maxlength: 50 },
  },
  {
    fieldName: 'applyUserId',
    label: '',
    component: 'CustomUserSelect',
    labelWidth: 100,
    i18nField: 'CommonCol.applyUser',
    componentProps: {
      defaultValue: useUserStore().getUserInfo?.userId,
      placeholder: '申请人',
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
  },
  {
    fieldName: 'status',
    label: '',
    i18nField: 'CommonCol.status',
    component: 'Select',
    componentProps: {
      placeholder: '选择状态',
      submitOnPressEnter: true,
      options: STATUS_OPTIONS.filter(item => item.id !== 6 && item.id !== 7),
    },
  },
];
