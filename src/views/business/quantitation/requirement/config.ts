import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { useBaseStore } from '/@/store/modules/base';
export const CURRENTNODE = 'QuantitativeApply'; // 当前节点
import { useUserStore } from '/@/store/modules/user';
import { getFactoryList } from '/@/api/engineering/sample';

export const STATUS_OPTIONS = [
  { id: 0, fullName: t('common.draft'), value: 0, label: t('common.draft'), theme: 'gray' }, //草稿
  { id: 1, fullName: t('common.doing'), value: 1, label: t('common.doing'), theme: 'blue' }, //在办
  { id: 2, fullName: t('common.stopText'), value: 2, label: t('common.stopText'), theme: 'red' }, //终止
  { id: 3, fullName: t('common.rejectText'), value: 3, label: t('common.rejectText'), theme: 'yellow' }, //驳回
  { id: 4, fullName: t('common.revoke'), value: 4, label: t('common.revoke'), theme: 'purple' }, //撤回
  { id: 5, fullName: t('common.endding'), value: 5, label: t('common.endding'), theme: 'green' }, //结案
  // { id: 8, fullName: t('common.delText'), value: 8, label: t('common.delText'), theme: 'gray' }, //删除
  // { id: 9, fullName: t('common.submitTodo'), value: 9, label: t('common.submitTodo'), theme: 'gray' }, //待提交
  // { id: 10, fullName: t('common.submitted'), value: 10, label: t('common.submitted'), theme: 'green' }, //已提交
  // { id: 11, fullName: t('common.agree'), value: 11, label: t('common.agree'), theme: 'green' }, //同意
  // { id: 12, fullName: t('common.disagree'), value: 12, label: t('common.disagree'), theme: 'yellow' }, //不同意
  // { id: 13, fullName: t('status.applyStatus.waiting'), value: 13, label: t('status.applyStatus.waiting'), theme: 'blue' }, //待回复
  // { id: 16, fullName: t('common.toConfirm'), value: 16, label: t('common.toConfirm'), theme: 'gray' }, //待确认
];

const baseStore = useBaseStore();
// 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('dict.IsEnum.Yes') },
  { id: 0, fullName: t('dict.IsEnum.No') },
];

// 查询条件
export const schemaFormConfig = () => [
  {
    fieldName: 'applyNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '申请单号', allowClear: true, maxlength: 50 },
  },
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '产品内部料号', allowClear: true, maxlength: 50 },
  },
  {
    fieldName: 'demandType',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getDemandType,
      allowClear: true,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'demandType',
      },
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
    },
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
      allowClear: true,
    },
  },
  {
    fieldName: 'terminalCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '终端客户料号', maxlength: 50, allowClear: true },
  },
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      allowClear: true,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      filterOption: false,
      immediate: true,
      placeholder: t('dict.CommonCol.factoryName'),
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '选择状态',
      submitOnPressEnter: true,
      options: STATUS_OPTIONS,
      allowClear: true,
    },
  },
];

export const columns: BasicColumn[] = [
  { title: '单号', dataIndex: 'applyNo', sorter: true },
  { title: '需求类型', dataIndex: 'demandType', width: 150, sorter: true },
  {
    title: '内部项目代码',
    dataIndex: 'insideProjectCode',
    width: 110,
    sorter: true,
  },
  {
    title: '终端项目代码',
    dataIndex: 'terminalCustomerProjectCode',
    width: 110,
    sorter: true,
  },
  { title: '申请人', dataIndex: 'applyUserName', key: 'applyUserName', width: 180, sorter: true },
  { title: '申请部门', dataIndex: 'applyDeptName', key: 'applyDeptName', width: 150, sorter: true },
  {
    title: '申请时间',
    dataIndex: 'applyDate',
    key: 'applyDate',
    width: 150,
    sorter: true,
    format: 'date|YYYY/MM/DD HH:MM',
  },
  { title: '修改人', dataIndex: 'lastModifyUserName', key: 'lastModifyUserName', width: 110, sorter: true },
  {
    title: '修改时间',
    dataIndex: 'lastModifyTime',
    key: 'lastModifyTime',
    width: 50,
    sorter: true,
    format: 'date|YYYY-MM-DD HH:MM',
  },
];

export const columnsVxe = [
  // { type: 'expand', field: 'expand', minWidth: 40, slots: { content: 'expand_content' } },
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  {
    title: '申请单号',
    field: 'applyNo',
    width: 140,
    sortable: true,
  },
  {
    title: '需求类型',
    field: 'demandType',
    width: 150,
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ApiSelect',
    //   searchField: 'demandType',
    //   props: {
    //     api: getDemandType,
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     showSearch: true,
    //     apiSearch: {
    //       show: true,
    //       searchName: '',
    //     },
    //     filterOption: false,
    //     notFoundContent: null,
    //   },
    // },
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialNumber',
    width: 180,
    sortable: true,
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
    title: '内部项目代码',
    field: 'insideProjectCode',
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessor',
    width: 160,
    sortable: true,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
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
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    width: 160,
    sortable: true,
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
    title: '直接客户简称',
    field: 'immediateCustomerName',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '终端项目阶段',
    field: 'projectPhase',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '需求数量(PCS)',
    field: 'peakQty',
    key: 'peakQty',
    width: 150,
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
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
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '工厂',
    field: 'factory',
    width: 200,
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '产品描述',
    field: 'productDesc',
    key: 'productDesc',
    width: 300,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注',
    field: 'nodeRemark',
    i18nField: 'CommonCol.remark',
    importField: 'pmDesc',
    key: 'pmDesc',
    width: 150,
    cellRender: {
      name: 'Remark',
      nodeCode: CURRENTNODE,
    },
  },
  { title: '申请人', field: 'applyUserName', key: 'applyUserName', width: 180, sortable: true },
  // { title: '申请部门', field: 'applyDeptName', key: 'applyDeptName', width: 150, sortable: true },
  {
    title: '申请时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
    width: 150,
    sortable: true,
  },
  // { title: '修改人', field: 'lastModifyUserName', key: 'lastModifyUserName', i18nField: 'CommonCol.updateUser', width: 180, sortable: true },
  // {
  //   title: '修改时间',
  //   field: 'lastModifyTime',
  //   i18nField: 'CommonCol.updateTime',
  //   cellRender: {
  //     name: 'Date',
  //   },
  //   width: 150,
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

export const subColumns: BasicColumn[] = [
  { title: '产品内部料号', dataIndex: 'innerMaterialNumber', width: 180 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
  },
  {
    title: '当前处理人',
    dataIndex: 'currentProcessor',
    width: 160,
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    dataIndex: 'nodeDetail',
    width: 160,
  },
  {
    title: '终端客户料号',
    dataIndex: 'terminalCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户料号',
    dataIndex: 'immediateCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户简称',
    dataIndex: 'immediateCustomerName',
    width: 150,
  },
  {
    title: '终端项目阶段',
    dataIndex: 'projectPhase',
    key: 'projectPhase',
    className: 'shadow-end',
    width: 120,
  },
  { title: '需求数量(PCS)', dataIndex: 'peakQty', key: 'peakQty', width: 150 },
  {
    title: '客户要求交期',
    dataIndex: 'customerDeliveryTime',
    key: 'customerDeliveryTime',
    width: 140,
    format: 'date|YYYY-MM-DD',
  },
  // {
  //   title: '报关',
  //   dataIndex: 'isDeclareCustoms',
  //   key: 'isDeclareCustoms',
  //   width: 110,
  //   customRender: ({ record }) => {
  //     let item = CONDITIONAL_OPTIONS.filter(o => o.id == record.isDeclareCustoms)[0];
  //     return item && item.fullName ? item.fullName : '';
  //   },
  // },
  {
    title: '工厂',
    dataIndex: 'factory',
    width: 200,
  },
  { title: '产品描述', dataIndex: 'productDesc', key: 'productDesc', width: 300 },
  { title: '备注', dataIndex: 'nodeRemark', key: 'nodeRemark', width: 100 },
  // { title: '脱敏图纸', dataIndex: 'desensitizedDrawingsName', key: 'desensitizedDrawingsName', width: 300 },
  // { title: 'EPM', dataIndex: 'epm', key: 'epm', width: 150 },
  // { title: 'PD', dataIndex: 'pdName', key: 'pd', width: 150 },
  // { title: 'PD Leader', dataIndex: 'pdLeaderName', key: 'pdLeaderName', width: 150 },
];

/** 获取导入表格列配置 */
export function getImportColumns() {
  const remarkIndex = columnsVxe.findIndex(col => col.field === 'nodeRemark');
  const columns: Array<any> = [...columnsVxe];
  columns.splice(
    remarkIndex,
    0,
    {
      title: '报关',
      field: 'isDeclareCustomsDesc',
      width: 110,
      i18nField: 'isDeclareCustoms',
    },
    {
      title: 'PDT-Leader',
      field: 'epmName',
      width: 180,
      i18nField: 'pdtLeader',
    },
    // {
    //   title: '样品组人员',
    //   field: 'sampleGroupLeaderPersonName',
    //   width: 180,
    // },
  );
  return columns;
}

export async function getDemandType() {
  // const notShow = ['QuotationRequirements', 'DrawingsReviewReq', 'SalesForecast'];
  const showDemand = ['Quantitative', 'BusinessSamples', 'EngineeringSamples']; // 需要显示的需求类型
  const r = await baseStore.getDictionaryData('DemandTypeEnum');
  const data = (r || []).filter(el => {
    // return !notShow.includes(el.enCode);
    return showDemand.includes(el.enCode);
  });
  return data;
}
